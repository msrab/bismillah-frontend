// start.js
/**
 * Fichier “réel” de démarrage du serveur (pour dev / prod).
 * 
 * Il importe `app` et `sequelize` depuis server.js, puis appelle `app.listen()`.
 */
require('dotenv').config();
const { app, sequelize } = require('./server');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1) Vérifier la connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');

    // 2) En environnement "dev" (NODE_ENV !== 'production'), on synchronise directement
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés (alter).');
    }
    // En staging/production, on utilisera plutôt : npx sequelize-cli db:migrate

    // 3) Démarrer le serveur HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur de démarrage :', err);
    process.exit(1);
  }
})();
