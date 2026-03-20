// ─── Auto-Responder via Resend ────────────────────────────────
// Sends branded auto-responses based on email classification.
// Uses Resend API for reliable delivery from your custom domains.

/**
 * Send an auto-response email via Resend
 *
 * @param {object} params
 * @param {string} params.to          - Recipient (original sender)
 * @param {string} params.fromAddress  - Your domain address (hello@kyno.pet)
 * @param {string} params.fromName     - Brand name (Kyno)
 * @param {string} params.subject      - Response subject
 * @param {string} params.body         - Response body (plain text)
 * @param {string} params.replyToMsgId - Original Message-ID for threading
 * @param {string} resendApiKey        - Resend API key
 * @returns {object} Resend API response
 */
export async function sendAutoResponse({
  to,
  fromAddress,
  fromName,
  subject,
  body,
  replyToMsgId,
  resendApiKey,
}) {
  // Convert plain text body to simple HTML
  const htmlBody = textToHtml(body, fromName);

  const payload = {
    from: `${fromName} <${fromAddress}>`,
    to: [to],
    subject: subject,
    html: htmlBody,
    text: body,
    // Thread the reply to the original email
    ...(replyToMsgId && {
      headers: {
        "In-Reply-To": replyToMsgId,
        References: replyToMsgId,
      },
    }),
    // Tag for analytics
    tags: [
      { name: "type", value: "auto-response" },
      { name: "brand", value: fromName.toLowerCase() },
    ],
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", response.status, errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Resend send error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Build the auto-response from a template + classification data
 */
export function buildResponse(domainConfig, classification, originalEmail) {
  const { category, firstName } = classification;
  const template = domainConfig.templates[category];

  if (!template) {
    return null;
  }

  // Check if this category should auto-respond
  const categoryConfig = domainConfig.categories[category];
  if (!categoryConfig?.autoRespond) {
    return null;
  }

  // Replace template variables
  const body = template.body
    .replace(/\{\{firstName\}\}/g, firstName || "there")
    .replace(/\{\{brand\}\}/g, domainConfig.brand)
    .replace(/\{\{dogName\}\}/g, "your dog"); // future: extract from profile

  const subject = template.subject
    .replace(/\{\{firstName\}\}/g, firstName || "there");

  // Determine the "from" address — use the address the email was sent TO
  const toAddress = originalEmail.to;
  const domain = toAddress.split("@")[1];

  return {
    to: originalEmail.from,
    fromAddress: toAddress,
    fromName: domainConfig.brand,
    subject,
    body,
  };
}

/**
 * Convert plain text to clean, branded HTML email
 */
function textToHtml(text, brandName) {
  // Brand colors (Kyno palette)
  const colors = {
    Kyno: { bg: "#F5F0EA", accent: "#C4A46B", text: "#2E2A28", muted: "#7A7F6D" },
    Hilo: { bg: "#F5F0EA", accent: "#4A6741", text: "#2E2A28", muted: "#7A7F6D" },
    Castelo: { bg: "#F5F0EA", accent: "#8B6F47", text: "#2E2A28", muted: "#7A7F6D" },
    Domicile: { bg: "#F5F0EA", accent: "#5B6770", text: "#2E2A28", muted: "#7A7F6D" },
  };

  const c = colors[brandName] || colors.Kyno;

  const paragraphs = text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      // Handle lines that start with — (bullet-like items)
      if (p.includes("\n—") || p.startsWith("—")) {
        const lines = p.split("\n").map((line) => {
          if (line.startsWith("—")) {
            return `<div style="padding: 4px 0 4px 16px; color: ${c.text};">${line}</div>`;
          }
          return `<p style="margin: 0 0 8px; color: ${c.text}; line-height: 1.6;">${line}</p>`;
        });
        return lines.join("");
      }
      return `<p style="margin: 0 0 16px; color: ${c.text}; line-height: 1.7; font-size: 15px;">${p.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: ${c.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 40px 24px;">
    
    <!-- Logo mark -->
    <div style="margin-bottom: 32px;">
      <div style="display: inline-block; width: 32px; height: 32px; background: ${c.accent}; border-radius: 8px; text-align: center; line-height: 32px; font-family: Georgia, serif; font-size: 16px; color: #3D2B1F; font-weight: 500;">${brandName[0]}</div>
    </div>

    <!-- Body -->
    ${paragraphs}

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(122,127,109,0.2);">
      <p style="margin: 0; font-size: 11px; color: ${c.muted}; letter-spacing: 0.5px;">
        ${brandName} · Miami, FL
      </p>
    </div>
  </div>
</body>
</html>`;
}
