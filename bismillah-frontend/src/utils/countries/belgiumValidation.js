/**
 * Valide et retourne un message d'erreur pour un numéro d'entreprise belge
 * @param {string} value
 * @param {boolean} required
 * @returns {{valid: boolean, message: string}}
 */
export function validateBelgianCompanyNumber(value, required = false) {
  if (required && !isValidBelgianCompanyNumber(value)) {
    return { valid: false, message: "Numéro d'entreprise invalide pour la Belgique." };
  }
  return { valid: true, message: '' };
}
/**
 * Formate un numéro d'entreprise belge (ajoute BE devant, tronque à 10 chiffres)
 * @param {string} value - chaîne de chiffres
 * @returns {string} - BE + 10 chiffres
 */
export function formatBelgianCompanyNumber(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 10);
  return digits ? `BE${digits}` : '';
}
// validationBelgium.js
// Fonctions de validation spécifiques à la Belgique

/**
 * Valide le format du numéro d'entreprise belge (BCE)
 * Format attendu : BE suivi de 10 chiffres
 */
export function isValidBelgianCompanyNumber(value) {
  return /^BE\d{10}$/.test(value);
}

/**
 * Valide un numéro de téléphone belge (fixe ou mobile), doit commencer par +32
 * Exemples valides : +32475123456, +3221234567
 */
export function isValidBelgianPhoneNumber(value) {
  if (typeof value !== 'string') return false;
  const phone = value.replace(/\s+/g, '');
  const mobileRegex = /^\+324[5-9][0-9]{7}$/;
  const fixeRegex = /^\+32[2-9][0-9]{7}$/;
  return mobileRegex.test(phone) || fixeRegex.test(phone);
}

// Ajoute ici d'autres validations spécifiques à la Belgique si besoin
