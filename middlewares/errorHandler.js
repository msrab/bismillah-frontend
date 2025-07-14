function errorHandler(err, req, res, next) {
  // Log l’erreur côté serveur (optionnel)
  console.error(err);

  // Format de réponse uniforme
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur.',
    // Optionnel : code personnalisé ou détails (jamais de stack trace en prod)
  });
}

module.exports = errorHandler;