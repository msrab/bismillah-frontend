// Fonctions utilitaires de validation pour les adresses et coordonnées

/**
 * Vérifie si un champ est une chaîne non vide (après trim)
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
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
