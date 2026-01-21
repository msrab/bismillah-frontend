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
