import globalStyles from '../styles/global';
import websiteStyles from '../styles/website';
import WebNav from './WebNav';
import WebLanding from './WebLanding';

export default function WebsiteApp() {
  return (
    <>
      <style>{globalStyles}</style>
      <style>{websiteStyles}</style>

      <WebNav />
      <WebLanding />
    </>
  );
}
