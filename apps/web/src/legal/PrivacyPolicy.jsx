import { colors } from '../styles/tokens';

const EFFECTIVE_DATE = 'March 19, 2026';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{
        fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
        fontSize: 18,
        fontWeight: 500,
        color: colors.charcoal,
        marginBottom: 10,
      }}>{title}</h3>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: colors.olive,
        lineHeight: 1.85,
      }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.sand,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 80px' }}>
        <a href="/" style={{
          fontSize: 13, color: colors.olive, textDecoration: 'none',
          display: 'inline-block', marginBottom: 32,
        }}>← Back to Kyno</a>

        <h1 style={{
          fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 400,
          color: colors.charcoal,
          marginBottom: 6,
        }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: colors.oliveLight, marginBottom: 48 }}>
          Effective {EFFECTIVE_DATE}
        </p>

        <Section title="1. Introduction">
          Kyno Pet Care LLC ("Kyno," "we," "us," or "our") operates the Kyno mobile application and website (the "Services"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services. By using Kyno, you agree to the collection and use of information in accordance with this policy.
        </Section>

        <Section title="2. Information We Collect">
          <p><strong>Account information.</strong> When you create an account we collect your first and last name, email address, phone number, and password.</p>
          <p style={{ marginTop: 12 }}><strong>Pet information.</strong> You may provide your dog's name, breed, date of birth, weight, sex, altered status, care notes, vaccination records, and photos.</p>
          <p style={{ marginTop: 12 }}><strong>Booking data.</strong> When you book a service we record the service type, provider, date, time, and price.</p>
          <p style={{ marginTop: 12 }}><strong>Usage data.</strong> We automatically collect device type, operating system, app version, and interaction data to improve the experience.</p>
          <p style={{ marginTop: 12 }}><strong>Photos and files.</strong> If you upload a profile photo for your dog or vaccine records, those files are stored securely in our cloud infrastructure.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Provide, maintain, and improve the Services</li>
            <li>Process bookings and connect you with providers</li>
            <li>Send booking confirmations and service reminders</li>
            <li>Personalize your experience (e.g., AI care insights)</li>
            <li>Communicate with you about your account or the Services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Information Sharing">
          <p>We do not sell your personal information. We share information only in these circumstances:</p>
          <p style={{ marginTop: 12 }}><strong>Service providers.</strong> When you book a service, we share relevant pet and scheduling details with the selected provider so they can deliver the service.</p>
          <p style={{ marginTop: 12 }}><strong>Infrastructure partners.</strong> We use Supabase for authentication and data storage, Resend for transactional email, and Vercel for hosting. These partners process data on our behalf under contractual obligations.</p>
          <p style={{ marginTop: 12 }}><strong>Legal requirements.</strong> We may disclose information if required by law, regulation, legal process, or governmental request.</p>
        </Section>

        <Section title="5. Data Retention">
          We retain your account and booking data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., transaction records).
        </Section>

        <Section title="6. Data Security">
          We implement industry-standard security measures including encrypted data transmission (TLS), secure password hashing, and row-level security policies on our database. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
        </Section>

        <Section title="7. Your Rights">
          <p>You may:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Access, update, or delete your account information through the app settings</li>
            <li>Request a copy of your personal data by contacting us</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p style={{ marginTop: 12 }}>To exercise these rights, contact us at hello@kyno.pet.</p>
        </Section>

        <Section title="8. Children's Privacy">
          The Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete that information promptly.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy and updating the effective date. Your continued use of the Services after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact Us">
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p style={{ marginTop: 12 }}>
            Kyno Pet Care LLC<br />
            hello@kyno.pet<br />
            Miami, FL
          </p>
        </Section>
      </div>
    </div>
  );
}
