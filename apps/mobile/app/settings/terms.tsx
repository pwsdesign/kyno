import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, stone } from '../../constants/colors';

const EFFECTIVE_DATE = 'March 19, 2026';

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={s.title}>Terms of Service</Text>
        <Text style={s.effective}>Effective {EFFECTIVE_DATE}</Text>

        <Section title="1. Acceptance of Terms">
          By creating an account or using the Kyno mobile application (the "App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App. These Terms constitute a legally binding agreement between you and Kyno Pet Care LLC ("Kyno," "we," "us," or "our").
        </Section>

        <Section title="2. Eligibility">
          You must be at least 18 years old and capable of forming a binding contract to use the App. By using Kyno, you represent and warrant that you meet these requirements.
        </Section>

        <Section title="3. Account Registration">
          You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
        </Section>

        <Section title="4. The Kyno Platform">
          Kyno is a marketplace that connects dog owners ("Owners") with independent dog care service providers ("Providers"). We facilitate the discovery, scheduling, and booking of services including walking, grooming, boarding, veterinary care, and emergency care.{'\n\n'}
          Kyno is not itself a pet care provider. Providers listed on the platform are independent contractors, not employees or agents of Kyno. We do not guarantee the quality, safety, or legality of any services offered by Providers.
        </Section>

        <Section title="5. Bookings and Payments">
          When you book a service through the App, you enter into a direct arrangement with the Provider. Pricing is displayed at the time of booking.{'\n\n'}
          Payment processing will be handled through our payment partner. By booking a service, you authorize us to charge the payment method on file. Cancellation and refund policies will be communicated at the time of booking.
        </Section>

        <Section title="6. User Conduct">
          You agree not to:{'\n\n'}
          • Provide false or misleading information{'\n'}
          • Use the App for any unlawful purpose{'\n'}
          • Interfere with or disrupt the App's operation{'\n'}
          • Attempt to gain unauthorized access to any part of the App{'\n'}
          • Harass, threaten, or abuse any Provider or other user{'\n'}
          • Circumvent the platform to arrange services or payments directly with Providers found through Kyno
        </Section>

        <Section title="7. Pet Information and Responsibility">
          You are responsible for providing accurate information about your pet(s), including health conditions, behavioral issues, and vaccination status. Failure to disclose relevant information that results in harm to a Provider or their property may result in liability to you and termination of your account.
        </Section>

        <Section title="8. Intellectual Property">
          The App, its content, features, and functionality are owned by Kyno Pet Care LLC and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of the App without our prior written consent.
        </Section>

        <Section title="9. Limitation of Liability">
          To the maximum extent permitted by law, Kyno shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the App or any services booked through the App. Our total liability for any claim arising under these Terms shall not exceed the amount you paid to Kyno in the twelve months preceding the claim.
        </Section>

        <Section title="10. Indemnification">
          You agree to indemnify and hold harmless Kyno, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of the App, your violation of these Terms, or your violation of any rights of a third party.
        </Section>

        <Section title="11. Termination">
          We may suspend or terminate your account at any time for any reason, including violation of these Terms. You may delete your account at any time through the App settings. Upon termination, your right to use the App will immediately cease.
        </Section>

        <Section title="12. Disclaimer of Warranties">
          The App is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of harmful components. We do not endorse or guarantee any Provider listed on the platform.
        </Section>

        <Section title="13. Governing Law">
          These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts located in Miami-Dade County, Florida.
        </Section>

        <Section title="14. Changes to Terms">
          We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms in the App. Your continued use of the App after changes constitutes acceptance of the modified Terms.
        </Section>

        <Section title="15. Contact">
          Questions about these Terms should be directed to:{'\n\n'}
          Kyno Pet Care LLC{'\n'}
          hello@kyno.pet{'\n'}
          Miami, FL
        </Section>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <Text style={s.body}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, padding: 28 },
  backBtn: { marginBottom: 24 },
  backText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.textPrimary, marginBottom: 4 },
  effective: { fontFamily: fonts.sans, fontSize: 12, color: colors.textTertiary, marginBottom: 32 },
  section: { marginBottom: 28 },
  sectionTitle: { fontFamily: fonts.serifMedium, fontSize: 17, color: colors.textPrimary, marginBottom: 10 },
  body: { fontFamily: fonts.sans, fontSize: 14, color: stone[600], lineHeight: 22 },
});
