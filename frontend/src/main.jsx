import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import RestaurantList from './components/RestaurantList';
import RestaurantDetails from './components/RestaurantDetails';
import RegisterRestaurant from './components/RegisterRestaurant';
import LoginRestaurant from './components/LoginRestaurant';
import CharterPage from './components/CharterPage';
import TermsPage from './components/TermsPage';
import { LanguageProvider } from './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/register-restaurant" element={<RegisterRestaurant />} />
          <Route path="/login-restaurant" element={<LoginRestaurant />} />
          <Route path="/charte-halal" element={<CharterPage />} />
          <Route path="/conditions-utilisation" element={<TermsPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);
