import { useEffect, useState } from 'react';
import globalStyles from '../styles/global';
import websiteStyles from '../styles/website';
import WebNav from './WebNav';
import WebLanding from './WebLanding';
import { colors } from '../styles/tokens';
import { darkShellSurfaceStyle } from './surfaces';

export default function WebsiteApp() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem('kyno-web-theme') === 'dark' ? 'dark' : 'light';
  });
  const isDark = theme === 'dark';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('kyno-web-theme', theme);
    }
  }, [theme]);

  return (
    <div style={{ ...(isDark ? darkShellSurfaceStyle : { background: colors.sand }), minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      <style>{websiteStyles}</style>

      <WebNav
        isDark={isDark}
        lang={lang}
        setLang={setLang}
        toggleTheme={() => setTheme(current => (current === 'dark' ? 'light' : 'dark'))}
      />
      <WebLanding isDark={isDark} lang={lang} />
    </div>
  );
}
