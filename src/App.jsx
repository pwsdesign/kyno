import { Routes, Route } from 'react-router-dom';
import KynoApp from './components/KynoApp';
import WebsiteApp from './website/WebsiteApp';

export default function App() {
  return (
    <Routes>
      <Route path="/app" element={<KynoApp />} />
      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}
