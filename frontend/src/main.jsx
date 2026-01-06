import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import RestaurantList from './components/RestaurantList';
import RestaurantDetails from './components/RestaurantDetails';
import RegisterRestaurant from './components/RegisterRestaurant';
import LoginRestaurant from './components/LoginRestaurant';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/register-restaurant" element={<RegisterRestaurant />} />
        <Route path="/login-restaurant" element={<LoginRestaurant />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
