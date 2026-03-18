import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/navbar';
import EmailPrompt from './components/preferences/EmailPrompt';
import DiscoverPage from './pages/DiscoverPage';
import AddEventPage from './pages/AddEventPage';
import PreferencesPage from './pages/PreferencesPage';
import DiscoverTonightPage from './pages/DiscoverTonightPage';

export default function App() {
  const [email, setEmail] = useState(() => localStorage.getItem('eventhub_email') || '');
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eventhub_favorites')) || [];
    } catch { return []; }
  });

  function handleEmailSubmit(submittedEmail) {
    localStorage.setItem('eventhub_email', submittedEmail);
    setEmail(submittedEmail);
  }

  function handleToggleFavorite(eventId) {
    setFavoriteIds(prev => {
      const next = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('eventhub_favorites', JSON.stringify(next));
      return next;
    });
  }

  if (!email) {
    return <EmailPrompt onEmailSubmit={handleEmailSubmit} />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DiscoverPage email={email} />} />
        <Route path="/add" element={<AddEventPage />} />
        <Route path="/preferences" element={<PreferencesPage email={email} onEmailChange={setEmail} />} />
        <Route path="/discover-tonight" element={<DiscoverTonightPage email={email} />} />
      </Routes>
    </BrowserRouter>
  );
}