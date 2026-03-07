import { useState } from 'react';
import StatusBar from './StatusBar';
import HomeScreen from './HomeScreen';
import ServicesScreen from './ServicesScreen';
import ProviderScreen from './ProviderScreen';
import ActivityScreen from './ActivityScreen';
import ProfileScreen from './ProfileScreen';
import WelcomeScreen from './WelcomeScreen';
import { navItems } from '../data/services';
import globalStyles from '../styles/global';
import componentStyles from '../styles/components';

export default function KynoApp() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [tab, setTab] = useState('home');
  const [showProvider, setShowProvider] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('walk');

  const openProvider = (serviceId = 'walk') => {
    setSelectedServiceId(serviceId);
    setShowProvider(true);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <style>{componentStyles}</style>

      <div className="kyno-root">
        <div className="phone-frame">
          {!showWelcome && <StatusBar />}

          {/* Screens */}
          {showWelcome ? (
            <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
          ) : showProvider ? (
            <ProviderScreen
              serviceId={selectedServiceId}
              onBack={() => setShowProvider(false)}
            />
          ) : tab === 'home' ? (
            <HomeScreen
              onServiceTap={() => setTab('services')}
              onProviderTap={openProvider}
            />
          ) : tab === 'services' ? (
            <ServicesScreen onProviderTap={openProvider} />
          ) : tab === 'activity' ? (
            <ActivityScreen />
          ) : tab === 'profile' ? (
            <ProfileScreen />
          ) : null}

          {/* Bottom Nav */}
          {!showWelcome && !showProvider && (
            <div className="bottom-nav">
              {navItems.map(item => (
                <div
                  key={item.id}
                  className={`nav-item ${tab === item.id ? 'active' : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  <div className="nav-icon-wrap">
                    <span className="nav-icon">{item.icon}</span>
                    {tab === item.id && <div className="nav-dot" />}
                  </div>
                  <span className="nav-label">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
