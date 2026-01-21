// Fonctions utilitaires de validation pour les adresses et coordonnées

/**
 * Vérifie si un champ est une chaîne non vide (après trim)
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}


/**
 * Valide le format du numéro d'entreprise belge (BE suivi de 10 chiffres)
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
  // Mobile: +324XXXXXXXX ou Fixe: +32[2-9]XXXXXXX
  // Mobile: +324[5-9][0-9]{7} (ex: +32475123456)
  // Fixe: +32[2-9][0-9]{7} (ex: +3221234567)
  const phone = value.replace(/\s+/g, '');
  const mobileRegex = /^\+324[5-9][0-9]{7}$/;
  const fixeRegex = /^\+32[2-9][0-9]{7}$/;
  return mobileRegex.test(phone) || fixeRegex.test(phone);
}

/**
 * Valide le format d'une URL de site web (domaine + extension, sous-domaines autorisés, chemin autorisé)
 */
export function isValidWebsiteUrl(value) {
  if (typeof value !== 'string') return false;
  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(:[0-9]{2,5})?(\/.*)?$/;
  return urlRegex.test(value.trim());
}

/**
 * Valide les champs d'adresse (rue, numéro, ville, code postal)
 * Retourne un tableau d'erreurs (chaînes)
 */
export function validateAddress({ street, number, city, postalCode }) {
  const errors = [];
  if (!isNonEmptyString(street)) errors.push("La rue est obligatoire.");
  if (!isNonEmptyString(number)) errors.push("Le numéro est obligatoire.");
  if (!isNonEmptyString(city)) errors.push("La ville est obligatoire.");
  if (!isNonEmptyString(postalCode)) errors.push("Le code postal est obligatoire.");
  return errors;
}

// Ajoute ici d'autres fonctions de validation si besoin
