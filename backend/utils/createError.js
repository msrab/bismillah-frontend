/**
 * Crée un objet Error avec un message et un code HTTP personnalisé.
 * @param {string} message - Message d'erreur à afficher au client.
 * @param {number} status - Code HTTP à renvoyer (ex: 400, 401, 403, 404, 409, 500).
 * @returns {Error} - Objet Error enrichi du code HTTP.
 */
function createError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = { createError };