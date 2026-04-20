import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/navbar';
import AuthPage from './pages/AuthPage';
import DiscoverPage from './pages/DiscoverPage';
import AddEventPage from './pages/AddEventPage';
import PreferencesPage from './pages/PreferencesPage';
import DiscoverTonightPage from './pages/DiscoverTonightPage';
import EventDetailPage from './pages/EventDetailPage';
import { getMe, logout } from './services/authService';

export default function App() {
  const [email, setEmail] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getMe()
      .then((user) => setEmail(user?.email ?? null))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await logout();
    setEmail(null);
  }

  if (checking) return null;

  if (!email) return <AuthPage onAuth={setEmail} />;

  return (
    <BrowserRouter>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<DiscoverPage email={email} />} />
        <Route path="/add" element={<AddEventPage />} />
        <Route
          path="/preferences"
          element={<PreferencesPage email={email} onEmailChange={setEmail} />}
        />
        <Route path="/discover-tonight" element={<DiscoverTonightPage email={email} />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Routes>
      <footer aria-label="Site footer" />
    </BrowserRouter>
  );
}
