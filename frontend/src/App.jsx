import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/navbar';
import DiscoverPage from './pages/DiscoverPage';
import AddEventPage from './pages/AddEventPage';
import PreferencesPage from './pages/PreferencesPage';
import DiscoverTonightPage from './pages/DiscoverTonightPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/add" element={<AddEventPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/discover-tonight" element={<DiscoverTonightPage />} />
      </Routes>
    </BrowserRouter>
  );
}
