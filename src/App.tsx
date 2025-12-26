import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CoupleSelection from './pages/CoupleSelection';
import TherapyRoom from './pages/TherapyRoom';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="couples" element={<CoupleSelection />} />
            <Route path="session/:coupleId" element={<TherapyRoom />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;
