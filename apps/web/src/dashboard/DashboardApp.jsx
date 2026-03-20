import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import WelcomePage from './auth/WelcomePage';
import SignInPage from './auth/SignInPage';
import CreateAccountPage from './auth/CreateAccountPage';
import AddDogPage from './auth/AddDogPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ActivityPage from './pages/ActivityPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import DogsPage from './pages/DogsPage';
import MembershipPage from './pages/MembershipPage';
import './styles/dashboard.css';

function AuthRoutes() {
  return (
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="sign-in" element={<SignInPage />} />
      <Route path="create-account" element={<CreateAccountPage />} />
      <Route path="add-dog" element={<AddDogPage />} />
    </Routes>
  );
}

function ThemedRoot({ children }) {
  const { theme } = useTheme();
  return <div className="k-root" data-theme={theme}>{children}</div>;
}

function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="booking/:serviceId" element={<BookingPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="dogs" element={<DogsPage />} />
          <Route path="membership" element={<MembershipPage />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function DashboardApp() {
  return <ThemeProvider><AuthProvider><ThemedRoot><DashboardRoutes /></ThemedRoot></AuthProvider></ThemeProvider>;
}

export function AuthApp() {
  return <ThemeProvider><AuthProvider><ThemedRoot><AuthRoutes /></ThemedRoot></AuthProvider></ThemeProvider>;
}
