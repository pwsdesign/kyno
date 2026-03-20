import { Routes, Route } from 'react-router-dom';
import KynoApp from './app-prototype/KynoApp';
import WebsiteApp from './website/WebsiteApp';
import PrivacyPolicy from './legal/PrivacyPolicy';
import TermsOfService from './legal/TermsOfService';
import DashboardApp, { AuthApp } from './dashboard/DashboardApp';

export default function App() {
  return (
    <Routes>
      <Route path="/app" element={<KynoApp />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/auth/*" element={<AuthApp />} />
      <Route path="/dashboard/*" element={<DashboardApp />} />
      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}
