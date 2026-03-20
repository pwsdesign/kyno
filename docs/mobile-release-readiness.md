# Mobile Release Readiness

## Completed In Repo

- Expo mobile app scaffolded under `apps/mobile`
- Supabase-backed auth service wired for email/password sign up and sign in
- Supabase-backed booking persistence wired for mobile booking creation
- Initial Supabase SQL migration added under `backend/supabase/migrations`
- Mobile env template added at `apps/mobile/.env.example`
- Starter EAS build/submit profiles added at `apps/mobile/eas.json`

## Still Required Outside The Repo

- Create the Supabase project and apply `backend/supabase/migrations/20260319123000_mobile_auth_and_bookings.sql`
- Add real values to `apps/mobile/.env.local`
- Disable Supabase Auth email confirmation if sign-up should land users directly in the app
- Keep Resend for transactional mail from `hello@kyno.pet` such as welcome, support, and booking emails
- Create a support URL and privacy policy URL for App Store Connect
- Implement secure account deletion with a server-side or Edge Function flow
- Create App Store screenshots, metadata, App Privacy answers, and review notes
- Connect `apps/mobile/eas.json` to real Apple credentials and App Store Connect
- Add an iOS privacy manifest if the final native dependency set requires one

## Recommended Next Implementation Steps

1. Replace remaining hardcoded profile/account content with Supabase-backed data everywhere.
2. Add booking history and upcoming booking surfaces backed by live Supabase rows.
3. Add support/legal screens and real outbound links.
4. Add account deletion and profile editing.
5. Add EAS configuration and TestFlight build automation.
