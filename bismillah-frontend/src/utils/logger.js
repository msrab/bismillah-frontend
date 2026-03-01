/**
 * Logger utilitaire avec mode développement activable/désactivable.
 * 
 * En mode dev (par défaut en développement Vite), les messages sont affichés dans la console.
 * En mode production, les messages sont masqués sauf si on force l'activation.
 * 
 * Usage:
 *   import logger from '../utils/logger';
 * 
 *   logger.log('message');           // console.log conditionnel
 *   logger.warn('attention');        // console.warn conditionnel
 *   logger.error('erreur');          // console.error conditionnel
 *   logger.info('info');             // console.info conditionnel
 *   logger.group('label');           // console.group conditionnel
 *   logger.groupEnd();              // console.groupEnd conditionnel
 *   logger.table(data);             // console.table conditionnel
 * 
 *   logger.enable();                // Active les logs manuellement
 *   logger.disable();               // Désactive les logs manuellement
 *   logger.isEnabled();             // Vérifie si le mode dev est actif
 */

// Par défaut: activé en développement (Vite), désactivé en production
let devMode = import.meta.env.DEV || false;

/**
 * Active le mode développement (affiche les messages console)
 */
function enable() {
  devMode = true;
  console.log(
    '%c[Logger] Mode développement ACTIVÉ',
    'color: #4caf50; font-weight: bold;'
  );
}

/**
 * Désactive le mode développement (masque les messages console)
 */
function disable() {
  console.log(
    '%c[Logger] Mode développement DÉSACTIVÉ',
    'color: #f44336; font-weight: bold;'
  );
  devMode = false;
}

/**
 * Vérifie si le mode développement est actif
 * @returns {boolean}
 */
function isEnabled() {
  return devMode;
}

/**
 * Crée une fonction de log conditionnelle pour un niveau donné
 * @param {'log'|'warn'|'error'|'info'|'debug'} level
 * @returns {Function}
 */
function createLogFn(level) {
  return (...args) => {
    if (devMode) {
      console[level](...args);
    }
  };
}

const logger = {
  log: createLogFn('log'),
  warn: createLogFn('warn'),
  error: createLogFn('error'),
  info: createLogFn('info'),
  debug: createLogFn('debug'),

  /**
   * Affiche un tableau dans la console (conditionnel)
   */
  table: (...args) => {
    if (devMode) {
      console.table(...args);
    }
  },

  /**
   * Ouvre un groupe dans la console (conditionnel)
   */
  group: (...args) => {
    if (devMode) {
      console.group(...args);
    }
  },

  /**
   * Ouvre un groupe fermé dans la console (conditionnel)
   */
  groupCollapsed: (...args) => {
    if (devMode) {
      console.groupCollapsed(...args);
    }
  },

  /**
   * Ferme un groupe dans la console (conditionnel)
   */
  groupEnd: () => {
    if (devMode) {
      console.groupEnd();
    }
  },

  /**
   * Log spécifique pour les requêtes API — affiche les détails de la requête et de la réponse
   * @param {string} method - GET, POST, etc.
   * @param {string} url - URL de la requête
   * @param {object} [options] - { status, data, error }
   */
  api: (method, url, { status, data, error } = {}) => {
    if (!devMode) return;

    const color = status && status >= 400 ? '#f44336' : '#4caf50';
    console.groupCollapsed(
      `%c[API] ${method} ${url} ${status ? `→ ${status}` : ''}`,
      `color: ${color}; font-weight: bold;`
    );
    if (data !== undefined) console.log('Response data:', data);
    if (error !== undefined) console.error('Error:', error);
    console.groupEnd();
  },

  enable,
  disable,
  isEnabled,
};

// Expose le logger dans la console du navigateur pour un toggle facile
// Usage dans la console: window.__logger.enable() / window.__logger.disable()
if (typeof window !== 'undefined') {
  window.__logger = logger;
}

export default logger;
