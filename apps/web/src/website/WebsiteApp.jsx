import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import globalStyles from '../styles/global';
import websiteStyles from '../styles/website';
import WebNav from './WebNav';
import WebLanding from './WebLanding';
import { darkShellSurfaceStyle, lightShellSurfaceStyle } from './surfaces';

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
    <div style={{ ...(isDark ? darkShellSurfaceStyle : lightShellSurfaceStyle), minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      <style>{websiteStyles}</style>

      <WebNav
        isDark={isDark}
        lang={lang}
        setLang={setLang}
        toggleTheme={() => setTheme(current => (current === 'dark' ? 'light' : 'dark'))}
      />
      <Routes>
        <Route index element={<WebLanding audience="owners" isDark={isDark} lang={lang} />} />
        <Route path="owners" element={<Navigate to="/" replace />} />
        <Route path="providers" element={<WebLanding audience="providers" isDark={isDark} lang={lang} />} />
        <Route path="partners" element={<WebLanding audience="partners" isDark={isDark} lang={lang} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
