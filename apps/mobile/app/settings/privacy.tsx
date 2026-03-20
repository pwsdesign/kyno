import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, stone } from '../../constants/colors';

const EFFECTIVE_DATE = 'March 19, 2026';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={s.title}>Privacy Policy</Text>
        <Text style={s.effective}>Effective {EFFECTIVE_DATE}</Text>

        <Section title="1. Introduction">
          Kyno Pet Care LLC ("Kyno," "we," "us," or "our") operates the Kyno mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the App. By using Kyno, you agree to the collection and use of information in accordance with this policy.
        </Section>

        <Section title="2. Information We Collect">
          <Bold>Account information.</Bold> When you create an account we collect your first and last name, email address, phone number, and password.{'\n\n'}
          <Bold>Pet information.</Bold> You may provide your dog's name, breed, date of birth, weight, sex, altered status, care notes, vaccination records, and photos.{'\n\n'}
          <Bold>Booking data.</Bold> When you book a service we record the service type, provider, date, time, and price.{'\n\n'}
          <Bold>Usage data.</Bold> We automatically collect device type, operating system, app version, and interaction data to improve the App experience.{'\n\n'}
          <Bold>Photos and files.</Bold> If you upload a profile photo for your dog or vaccine records, those files are stored securely in our cloud infrastructure.
        </Section>

        <Section title="3. How We Use Your Information">
          We use the information we collect to:{'\n\n'}
          • Provide, maintain, and improve the App{'\n'}
          • Process bookings and connect you with providers{'\n'}
          • Send booking confirmations and service reminders{'\n'}
          • Personalize your experience (e.g., AI care insights){'\n'}
          • Communicate with you about your account or the App{'\n'}
          • Comply with legal obligations
        </Section>

        <Section title="4. Information Sharing">
          We do not sell your personal information. We share information only in these circumstances:{'\n\n'}
          <Bold>Service providers.</Bold> When you book a service, we share relevant pet and scheduling details with the selected provider so they can deliver the service.{'\n\n'}
          <Bold>Infrastructure partners.</Bold> We use Supabase for authentication and data storage, Resend for transactional email, and Vercel for hosting. These partners process data on our behalf under contractual obligations.{'\n\n'}
          <Bold>Legal requirements.</Bold> We may disclose information if required by law, regulation, legal process, or governmental request.
        </Section>

        <Section title="5. Data Retention">
          We retain your account and booking data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., transaction records).
        </Section>

        <Section title="6. Data Security">
          We implement industry-standard security measures including encrypted data transmission (TLS), secure password hashing, and row-level security policies on our database. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
        </Section>

        <Section title="7. Your Rights">
          You may:{'\n\n'}
          • Access, update, or delete your account information through the App settings{'\n'}
          • Request a copy of your personal data by contacting us{'\n'}
          • Request deletion of your account and associated data{'\n'}
          • Opt out of non-essential communications{'\n\n'}
          To exercise these rights, contact us at hello@kyno.pet.
        </Section>

        <Section title="8. Children's Privacy">
          The App is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete that information promptly.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy in the App and updating the effective date. Your continued use of the App after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact Us">
          If you have questions about this Privacy Policy, contact us at:{'\n\n'}
          Kyno Pet Care LLC{'\n'}
          hello@kyno.pet{'\n'}
          Miami, FL
        </Section>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Bold({ children }: { children: string }) {
  return <Text style={{ fontFamily: fonts.sansMedium }}>{children}</Text>;
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
