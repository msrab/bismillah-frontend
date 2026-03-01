/**
 * Configuration de l'application
 * Utilise les variables d'environnement Vite (VITE_*)
 */

import logger from '../utils/logger';

// URL de base de l'API
// En développement: http://localhost:5000
// En production: URL du backend Railway
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// URL de base de l'API avec /api
export const API_URL = `${API_BASE_URL}/api`;

/**
 * Helper pour construire une URL d'API
 * @param {string} endpoint - Ex: '/auth/restaurant/login'
 * @returns {string} URL complète
 */
export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};

/**
 * Helper pour les appels fetch avec configuration par défaut
 * @param {string} endpoint - Endpoint de l'API
 * @param {object} options - Options fetch
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = apiUrl(endpoint);
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Ajoute le token si présent
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  // Ne pas mettre Content-Type si c'est un FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  try {
    const response = await fetch(url, config);
    logger.api(options.method || 'GET', endpoint, { status: response.status });
    return response;
  } catch (error) {
    logger.error(`[apiFetch] Erreur réseau pour ${options.method || 'GET'} ${endpoint}:`, error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_URL,
  apiUrl,
  apiFetch,
};
