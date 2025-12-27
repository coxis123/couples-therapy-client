import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ConvaiProvider } from './contexts/ConvaiContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CoupleSelection from './pages/CoupleSelection';
import TherapyRoom from './pages/TherapyRoom';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

// Convai configuration from environment variables
const convaiConfig = {
  apiKey: import.meta.env.VITE_CONVAI_API_KEY,
  robertCharId: import.meta.env.VITE_CONVAI_ROBERT_ID,
  lindaCharId: import.meta.env.VITE_CONVAI_LINDA_ID,
  endUserId: undefined, // Will be set to user ID when auth is implemented
};

function App() {
  return (
    <AuthProvider>
      <ConvaiProvider config={convaiConfig}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="couples" element={<CoupleSelection />} />
            <Route path="session/:coupleId" element={<TherapyRoom />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </ConvaiProvider>
    </AuthProvider>
  );
}

export default App;
