# Kyno Email Triage — AI-Powered Email Routing

An intelligent email triage system built on Cloudflare Email Workers that classifies 
inbound emails with Claude, auto-responds via Resend, and forwards everything to Gmail.

## Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │          Cloudflare Email Routing            │
                    │                                             │
  hello@kyno.pet ──►│  ┌──────────────────────────────────────┐  │
  hello@hilo.com ──►│  │      Email Worker (this project)     │  │
  hello@castelo ───►│  │                                      │  │
  hello@domicile ──►│  │  1. Parse email                      │  │
                    │  │  2. Classify with Claude API          │  │
                    │  │  3. Auto-respond via Resend           │  │
                    │  │  4. Forward to Gmail (always)         │  │
                    │  │  5. Log to KV (analytics)             │  │
                    │  └──────────┬────────────┬───────────────┘  │
                    │             │            │                   │
                    └─────────────┼────────────┼───────────────────┘
                                  │            │
                    ┌─────────────▼──┐  ┌──────▼──────────┐
                    │   Gmail Inbox   │  │  Resend (reply)  │
                    │  (archive/read) │  │  from: @kyno.pet │
                    └────────────────┘  └─────────────────┘
```

## What It Does

For every inbound email:

1. **Parses** the raw MIME message (subject, body, sender)
2. **Classifies** using Claude into categories:
   - Owner inquiry, Provider application, Partnership, Booking support
   - Emergency, Press/media, Feedback, Spam, General
3. **Auto-responds** with a branded, category-specific email via Resend
   - Threading is preserved (reply appears in the same thread)
   - Each brand gets its own styled email template
   - Spam gets no response
4. **Forwards** the original email to Gmail (nothing is ever lost)
5. **Logs** classification data to Cloudflare KV for monitoring

## Prerequisites

- Cloudflare account with your domains configured
- Anthropic API key (for Claude classification)
- Resend account with your domains verified
- Node.js 18+ installed locally

## Setup Guide

### Step 1: Clone and install

```bash
cd kyno-email-triage
npm install
```

### Step 2: Create KV namespace

```bash
npx wrangler kv namespace create EMAIL_LOG
```

Copy the `id` value from the output and paste it into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "EMAIL_LOG"
id = "<paste-your-id-here>"
```

### Step 3: Set secrets

```bash
# Your Anthropic API key
npx wrangler secret put ANTHROPIC_API_KEY

# Your Resend API key  
npx wrangler secret put RESEND_API_KEY

# Gmail forwarding address
npx wrangler secret put GMAIL_FORWARD
# → enter: founderdomicile@gmail.com

# Dashboard access token (make up a strong random string)
npx wrangler secret put DASHBOARD_TOKEN
```

### Step 4: Verify domains in Resend

In the Resend dashboard (resend.com/domains), add and verify each domain:

- kyno.pet
- hilo.com  
- castelo.com
- domicile.com

For each domain, Resend gives you DNS records to add. Go to Cloudflare → 
your domain → DNS and add the DKIM, SPF, and DMARC records Resend provides.

### Step 5: Deploy the worker

```bash
npx wrangler deploy
```

### Step 6: Connect Email Routing to the worker

For each domain in Cloudflare:

1. Go to the domain → **Email** → **Email Routing**
2. Make sure Email Routing is enabled
3. Go to **Email Workers** tab
4. Click **Create rule** (or edit catch-all):
   - **Custom address**: `hello@kyno.pet` (or catch-all `*`)
   - **Action**: Send to Worker → select `kyno-email-triage`
5. Repeat for each domain

### Step 7: Verify Gmail forwarding

Cloudflare Email Routing needs your Gmail address verified as a 
destination. In Cloudflare → Email Routing → Destination addresses, 
add `founderdomicile@gmail.com` if not already there. Gmail will 
send a verification link.

### Step 8: Set up Gmail filters

In Gmail → Settings → Filters:

| Filter                  | Label     | 
|------------------------|-----------|
| To: *@kyno.pet         | Kyno      |
| To: *@hilo.com         | Hilo      |
| To: *@castelo.com      | Castelo   |
| To: *@domicile.com     | Domicile  |

## Configuration

### Adding a new domain

Edit `src/config.js` and add a new entry to the `DOMAINS` object. 
At minimum you need:

```javascript
"newdomain.com": {
  brand: "Brand Name",
  tagline: "Short description",
  forwardTo: "founderdomicile@gmail.com",
  context: "What this brand does (helps AI classify better)",
  categories: {
    inquiry: {
      label: "General Inquiry",
      priority: "medium",
      autoRespond: true,
      routeTo: null,
    },
    spam: {
      label: "Spam",
      priority: "low",
      autoRespond: false,
      routeTo: null,
    },
  },
  templates: {
    inquiry: {
      subject: "Re: Your message",
      body: "Hi {{firstName}},\n\nThank you...",
    },
  },
},
```

### Routing to specific people

When you hire team members, update `routeTo` in the category config:

```javascript
provider_application: {
  routeTo: "ops-lead@kyno.pet",  // forwards to this person too
  autoRespond: true,
},
```

Then update the worker to forward to both Gmail AND the routeTo address.

### Disabling auto-response for a category

Set `autoRespond: false` in the category config. The email still gets 
classified and forwarded — it just won't trigger an auto-reply.

## Monitoring

### Dashboard API

The worker exposes a simple API at your worker URL:

```bash
# Health check
curl https://kyno-email-triage.<you>.workers.dev/

# Today's email stats for Kyno
curl -H "Authorization: Bearer YOUR_DASHBOARD_TOKEN" \
  "https://kyno-email-triage.<you>.workers.dev/api/stats?domain=kyno.pet"

# Specific email details
curl -H "Authorization: Bearer YOUR_DASHBOARD_TOKEN" \
  "https://kyno-email-triage.<you>.workers.dev/api/email/<email-id>"
```

### Logs

View real-time logs:

```bash
npx wrangler tail
```

This streams every email processing event with classification results.

## Cost Breakdown

| Service                    | Cost                         |
|---------------------------|------------------------------|
| Cloudflare Email Routing   | Free                         |
| Cloudflare Workers         | Free (100K requests/day)     |
| Cloudflare KV              | Free (100K reads, 1K writes) |
| Claude Sonnet API          | ~$0.003 per email classified |
| Resend                     | Free (3K emails/month)       |
| **Total at <500 emails/mo**| **~$1.50/month**            |

## Scaling Notes

- At **500+ emails/day**: Consider upgrading to Workers Paid ($5/mo)
- At **3K+ auto-responses/month**: Upgrade Resend to Pro ($20/mo)
- At **team routing needed**: Add Forward Email or Google Workspace
- At **dashboard needed**: Build a React dashboard using the API endpoints

## Files

```
kyno-email-triage/
├── wrangler.toml          # Cloudflare Worker config
├── package.json           # Dependencies
├── README.md              # This file
└── src/
    ├── index.js           # Main worker: email + HTTP handlers
    ├── config.js          # Domain configs, categories, templates
    ├── classifier.js      # AI classification via Claude API
    ├── responder.js       # Auto-response via Resend API
    └── parser.js          # Raw MIME email parser
```
