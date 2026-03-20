// ─── Kyno Email Triage — Address-Based Routing ───────────────
// Single domain (kyno.pet) with multiple addresses.
// The AI classifier still catches misrouted emails.

export const BRAND = {
  name: "Kyno",
  domain: "kyno.pet",
  tagline: "Premium dog care marketplace · Miami",
  forwardTo: "founderdomicile@gmail.com",

  context: `Kyno is a premium dog care marketplace launching in Miami. 
Services include dog walking (GPS-tracked), grooming, boarding/hotels, 
vet referrals, emergency vet access, and curated pet shopping (Chewy, 
The Farmer's Dog). Currently in pre-launch/early launch phase focused 
on Brickell neighborhood. Target: affluent dog owners 28-45, 
high-rise condo dwellers.`,
};

// ─── Address Routing ──────────────────────────────────────────
// Maps each @kyno.pet address to its primary category and routing.
// When the AI detects a mismatch (e.g. provider emails hello@),
// it overrides the address-based default with the correct category.

export const ADDRESSES = {
  "hello@kyno.pet": {
    label: "General Inbox",
    defaultCategory: "owner_inquiry",
    routeTo: null, // founder handles for now
  },
  "providers@kyno.pet": {
    label: "Provider Applications",
    defaultCategory: "provider_application",
    routeTo: null,
  },
  "partners@kyno.pet": {
    label: "Partnerships",
    defaultCategory: "partnership",
    routeTo: null,
  },
  "press@kyno.pet": {
    label: "Press & Media",
    defaultCategory: "press",
    routeTo: null,
  },
  "support@kyno.pet": {
    label: "Customer Support",
    defaultCategory: "booking_support",
    routeTo: null,
  },
  "emergency@kyno.pet": {
    label: "Emergency",
    defaultCategory: "emergency",
    routeTo: null,
  },
};

// ─── Classification Categories ────────────────────────────────
// The AI classifies every email into one of these regardless of
// which address it was sent to.

export const CATEGORIES = {
  owner_inquiry: {
    label: "Dog Owner Inquiry",
    description: "Dog owners asking about services, pricing, availability, how to sign up, waitlist",
    priority: "high",
    autoRespond: true,
  },
  provider_application: {
    label: "Provider Application",
    description: "Dog walkers, groomers, vets, boarding facilities wanting to join Kyno's network",
    priority: "high",
    autoRespond: true,
  },
  partnership: {
    label: "Partnership Inquiry",
    description: "Brands, businesses, building managers, concierges wanting to partner",
    priority: "medium",
    autoRespond: true,
  },
  booking_support: {
    label: "Booking Support",
    description: "Existing customers with booking issues, changes, cancellations, complaints",
    priority: "urgent",
    autoRespond: true,
  },
  emergency: {
    label: "Emergency / Urgent",
    description: "Urgent pet care situations, safety concerns, time-sensitive issues",
    priority: "critical",
    autoRespond: true,
  },
  press: {
    label: "Press / Media",
    description: "Journalists, bloggers, media outlets requesting info or interviews",
    priority: "medium",
    autoRespond: true,
  },
  feedback: {
    label: "Feedback / Review",
    description: "Users sharing feedback, reviews, suggestions, compliments, or complaints",
    priority: "medium",
    autoRespond: true,
  },
  spam: {
    label: "Spam / Irrelevant",
    description: "Marketing spam, cold outreach, SEO agencies, irrelevant solicitations",
    priority: "low",
    autoRespond: false,
  },
  general: {
    label: "General",
    description: "Anything that doesn't fit the above categories",
    priority: "low",
    autoRespond: true,
  },
};

// ─── Auto-Response Templates ──────────────────────────────────

export const TEMPLATES = {
  owner_inquiry: {
    subject: "Welcome to Kyno — we'll be in touch shortly",
    body: `Hi {{firstName}},

Thank you for reaching out to Kyno. We're building Miami's most trusted dog care platform — every walker, groomer, and provider on Kyno is personally vetted to a hospitality-grade standard.

We received your message and will personally get back to you within a few hours.

In the meantime, if you haven't already, you can join our early access list at kyno.pet to be among the first to book when we launch in your neighborhood.

Warmly,
The Kyno Team
Miami, FL`,
  },

  provider_application: {
    subject: "Kyno Provider Network — application received",
    body: `Hi {{firstName}},

Thank you for your interest in joining the Kyno provider network. We're selective about who we work with because our owners expect the best — and that's exactly the standard we hold.

We've received your message and a member of our team will follow up within 24 hours to discuss next steps, including our vetting process and what it's like to work with Kyno.

In the meantime, here's what to know:
— Kyno providers earn premium rates ($25-35/hr for walkers)
— You set your own schedule and availability
— We handle payments, insurance, and client matching

Looking forward to connecting.

The Kyno Team`,
  },

  partnership: {
    subject: "Kyno Partnership Inquiry — received",
    body: `Hi {{firstName}},

Thank you for your interest in partnering with Kyno. We're thoughtful about the brands and businesses we work with — every partnership should make the experience better for Miami's dog owners.

We've noted your inquiry and will follow up within 48 hours.

Best,
The Kyno Team`,
  },

  booking_support: {
    subject: "Re: Your Kyno booking — we're on it",
    body: `Hi {{firstName}},

We received your message about your booking. Our team is looking into this and will get back to you as soon as possible — typically within 1 hour during operating hours (7 AM – 9 PM ET).

If this is urgent and involves your dog's safety, please email emergency@kyno.pet or call us directly for immediate assistance.

The Kyno Team`,
  },

  emergency: {
    subject: "URGENT — Kyno emergency support",
    body: `Hi {{firstName}},

We see your message is urgent. A member of our team has been alerted and will respond immediately.

If your dog needs emergency veterinary care right now:
— Brickell: MedVet Miami (305) 665-2820
— Coral Gables: Coral Gables Animal Hospital (305) 446-3660
— 24/7 Poison Control: ASPCA (888) 426-4435

We're here to help.

The Kyno Team`,
  },

  press: {
    subject: "Kyno — media inquiry received",
    body: `Hi {{firstName}},

Thank you for reaching out. We're happy to support press and media inquiries about Kyno and the Miami pet care market.

A member of our founding team will follow up within 24–48 hours with the information you need.

Best,
The Kyno Team`,
  },

  feedback: {
    subject: "Thank you for your feedback — Kyno",
    body: `Hi {{firstName}},

Thank you for taking the time to share your thoughts with us. Feedback from our community is how we make Kyno better, and we read every message personally.

We appreciate you and will follow up if your message needs a detailed response.

Warmly,
The Kyno Team`,
  },

  general: {
    subject: "Re: Your message to Kyno",
    body: `Hi {{firstName}},

Thank you for reaching out. We've received your message and will get back to you shortly.

Best,
The Kyno Team`,
  },
};