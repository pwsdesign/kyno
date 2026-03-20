// ─── Kyno Email Triage Worker ─────────────────────────────────
// Cloudflare Email Worker for kyno.pet
// Classifies inbound emails with Claude, auto-responds via
// Resend, and forwards everything to Gmail.
//
// Addresses:
//   hello@kyno.pet      → general / dog owner inquiries
//   providers@kyno.pet  → provider applications
//   partners@kyno.pet   → partnership inquiries
//   press@kyno.pet      → media inquiries
//   support@kyno.pet    → booking support
//   emergency@kyno.pet  → urgent pet care
// ──────────────────────────────────────────────────────────────

import { parseEmail } from "./parser.js";
import { classifyEmail } from "./classifier.js";
import { sendAutoResponse, buildResponse } from "./responder.js";
import { BRAND, ADDRESSES, CATEGORIES, TEMPLATES } from "./config.js";

export default {
  // ── Email Handler ────────────────────────────────────────
  async email(message, env, ctx) {
    const startTime = Date.now();

    try {
      const recipient = message.to.toLowerCase();
      const addressConfig = ADDRESSES[recipient];

      console.log(
        `Incoming: ${message.from} → ${recipient} (${addressConfig?.label || "catch-all"})`
      );

      // 1. Parse the email
      const parsed = await parseEmail(message.raw, message);
      console.log(
        `Parsed: subject="${parsed.subject}", bodyLength=${parsed.body?.length || 0}`
      );

      // 2. Build domain config object for the classifier
      //    (keeps classifier.js unchanged)
      const domainConfig = {
        brand: BRAND.name,
        tagline: BRAND.tagline,
        context: BRAND.context,
        categories: CATEGORIES,
        templates: TEMPLATES,
      };

      // 3. Classify with AI
      const classification = await classifyEmail(
        parsed,
        domainConfig,
        env.ANTHROPIC_API_KEY
      );

      console.log(
        `Classified: category=${classification.category}, urgency=${classification.urgency}, confidence=${classification.confidence}`
      );

      // 4. Auto-respond if applicable
      let autoResponseResult = null;

      if (
        classification.category !== "spam" &&
        CATEGORIES[classification.category]?.autoRespond
      ) {
        const template = TEMPLATES[classification.category];

        if (template && env.RESEND_API_KEY) {
          const firstName = classification.firstName || "there";

          const body = template.body
            .replace(/\{\{firstName\}\}/g, firstName)
            .replace(/\{\{brand\}\}/g, BRAND.name);

          const subject = template.subject
            .replace(/\{\{firstName\}\}/g, firstName);

          autoResponseResult = await sendAutoResponse({
            to: parsed.from,
            fromAddress: recipient,
            fromName: BRAND.name,
            subject,
            body,
            replyToMsgId: parsed.messageId,
            resendApiKey: env.RESEND_API_KEY,
          });

          console.log(
            `Auto-response: ${autoResponseResult.success ? "sent" : "failed"} → ${parsed.from}`
          );
        }
      }

      // 5. Forward to Gmail (always — nothing is ever lost)
      const forwardTo = BRAND.forwardTo || env.GMAIL_FORWARD;
      await message.forward(forwardTo);
      console.log(`Forwarded to ${forwardTo}`);

      // 6. If this category has a specific routeTo, forward there too
      const categoryRoute = addressConfig?.routeTo;
      if (categoryRoute && categoryRoute !== forwardTo) {
        await message.forward(categoryRoute);
        console.log(`Also routed to ${categoryRoute}`);
      }

      // 7. Log to KV
      const logEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        address: recipient,
        addressLabel: addressConfig?.label || "catch-all",
        from: parsed.from,
        subject: parsed.subject,
        classification: {
          category: classification.category,
          categoryLabel: CATEGORIES[classification.category]?.label || classification.category,
          urgency: classification.urgency,
          sentiment: classification.sentiment,
          summary: classification.summary,
          confidence: classification.confidence,
          needsHumanReply: classification.needsHumanReply,
          model: classification.model,
        },
        autoResponse: autoResponseResult
          ? {
              sent: autoResponseResult.success,
              resendId: autoResponseResult.id || null,
              error: autoResponseResult.error || null,
            }
          : { sent: false, reason: "not applicable" },
        forwarded: true,
        forwardedTo: forwardTo,
        processingTimeMs: Date.now() - startTime,
      };

      if (env.EMAIL_LOG) {
        await env.EMAIL_LOG.put(
          `email:${logEntry.id}`,
          JSON.stringify(logEntry),
          { expirationTtl: 60 * 60 * 24 * 90 }
        );

        // Daily index
        const today = new Date().toISOString().split("T")[0];
        const indexKey = `index:${today}`;
        const existing = await env.EMAIL_LOG.get(indexKey);
        const index = existing ? JSON.parse(existing) : [];
        index.push({
          id: logEntry.id,
          from: parsed.from,
          to: recipient,
          subject: parsed.subject,
          category: classification.category,
          urgency: classification.urgency,
          time: logEntry.timestamp,
        });
        await env.EMAIL_LOG.put(indexKey, JSON.stringify(index), {
          expirationTtl: 60 * 60 * 24 * 90,
        });
      }

      console.log(
        `Done: ${recipient} | ${classification.category} | ${Date.now() - startTime}ms`
      );
    } catch (error) {
      console.error("Email triage error:", error);

      // On any error, still forward so nothing is lost
      try {
        await message.forward(env.GMAIL_FORWARD || "founderdomicile@gmail.com");
        console.log("Error recovery: forwarded to Gmail");
      } catch (fwdError) {
        console.error("Forward also failed:", fwdError);
      }
    }
  },

  // ── HTTP Handler (Monitoring API) ────────────────────────
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Auth check
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${env.DASHBOARD_TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /api/stats?date=2026-03-19
    if (url.pathname === "/api/stats") {
      const date = url.searchParams.get("date") || new Date().toISOString().split("T")[0];
      const indexKey = `index:${date}`;
      const index = await env.EMAIL_LOG?.get(indexKey);
      const emails = index ? JSON.parse(index) : [];

      const stats = {
        date,
        total: emails.length,
        byCategory: {},
        byUrgency: {},
        byAddress: {},
      };

      for (const email of emails) {
        stats.byCategory[email.category] = (stats.byCategory[email.category] || 0) + 1;
        stats.byUrgency[email.urgency] = (stats.byUrgency[email.urgency] || 0) + 1;
        stats.byAddress[email.to] = (stats.byAddress[email.to] || 0) + 1;
      }

      return new Response(JSON.stringify({ stats, emails }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /api/email/:id
    if (url.pathname.startsWith("/api/email/")) {
      const id = url.pathname.split("/api/email/")[1];
      const entry = await env.EMAIL_LOG?.get(`email:${id}`);

      if (!entry) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(entry, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Health check
    return new Response(
      JSON.stringify({
        service: "kyno-email-triage",
        brand: BRAND.name,
        addresses: Object.keys(ADDRESSES),
        status: "running",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
};