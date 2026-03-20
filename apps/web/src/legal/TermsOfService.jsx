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

export default function TermsOfService() {
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
        }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: colors.oliveLight, marginBottom: 48 }}>
          Effective {EFFECTIVE_DATE}
        </p>

        <Section title="1. Acceptance of Terms">
          By creating an account or using the Kyno mobile application or website (the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Services. These Terms constitute a legally binding agreement between you and Kyno Pet Care LLC ("Kyno," "we," "us," or "our").
        </Section>

        <Section title="2. Eligibility">
          You must be at least 18 years old and capable of forming a binding contract to use the Services. By using Kyno, you represent and warrant that you meet these requirements.
        </Section>

        <Section title="3. Account Registration">
          You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
        </Section>

        <Section title="4. The Kyno Platform">
          <p>Kyno is a marketplace that connects dog owners ("Owners") with independent dog care service providers ("Providers"). We facilitate the discovery, scheduling, and booking of services including walking, grooming, boarding, veterinary care, and emergency care.</p>
          <p style={{ marginTop: 12 }}>Kyno is not itself a pet care provider. Providers listed on the platform are independent contractors, not employees or agents of Kyno. We do not guarantee the quality, safety, or legality of any services offered by Providers.</p>
        </Section>

        <Section title="5. Bookings and Payments">
          <p>When you book a service through the Services, you enter into a direct arrangement with the Provider. Pricing is displayed at the time of booking.</p>
          <p style={{ marginTop: 12 }}>Payment processing will be handled through our payment partner. By booking a service, you authorize us to charge the payment method on file. Cancellation and refund policies will be communicated at the time of booking.</p>
        </Section>

        <Section title="6. User Conduct">
          <p>You agree not to:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Provide false or misleading information</li>
            <li>Use the Services for any unlawful purpose</li>
            <li>Interfere with or disrupt the Services' operation</li>
            <li>Attempt to gain unauthorized access to any part of the Services</li>
            <li>Harass, threaten, or abuse any Provider or other user</li>
            <li>Circumvent the platform to arrange services or payments directly with Providers found through Kyno</li>
          </ul>
        </Section>

        <Section title="7. Pet Information and Responsibility">
          You are responsible for providing accurate information about your pet(s), including health conditions, behavioral issues, and vaccination status. Failure to disclose relevant information that results in harm to a Provider or their property may result in liability to you and termination of your account.
        </Section>

        <Section title="8. Intellectual Property">
          The Services, their content, features, and functionality are owned by Kyno Pet Care LLC and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of the Services without our prior written consent.
        </Section>

        <Section title="9. Limitation of Liability">
          To the maximum extent permitted by law, Kyno shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Services or any services booked through the platform. Our total liability for any claim arising under these Terms shall not exceed the amount you paid to Kyno in the twelve months preceding the claim.
        </Section>

        <Section title="10. Indemnification">
          You agree to indemnify and hold harmless Kyno, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of the Services, your violation of these Terms, or your violation of any rights of a third party.
        </Section>

        <Section title="11. Termination">
          We may suspend or terminate your account at any time for any reason, including violation of these Terms. You may delete your account at any time through the app settings. Upon termination, your right to use the Services will immediately cease.
        </Section>

        <Section title="12. Disclaimer of Warranties">
          The Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components. We do not endorse or guarantee any Provider listed on the platform.
        </Section>

        <Section title="13. Governing Law">
          These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts located in Miami-Dade County, Florida.
        </Section>

        <Section title="14. Changes to Terms">
          We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms. Your continued use of the Services after changes constitutes acceptance of the modified Terms.
        </Section>

        <Section title="15. Contact">
          <p>Questions about these Terms should be directed to:</p>
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
