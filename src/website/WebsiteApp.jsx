import { useState } from 'react';
import globalStyles from '../styles/global';
import websiteStyles from '../styles/website';
import WebNav from './WebNav';
import WebLanding from './WebLanding';

export default function WebsiteApp() {
  const [lang, setLang] = useState('en');

  return (
    <>
      <style>{globalStyles}</style>
      <style>{websiteStyles}</style>

      <WebNav lang={lang} setLang={setLang} />
      <WebLanding lang={lang} />
    </>
  );
}
