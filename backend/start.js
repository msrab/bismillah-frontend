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

    // 2) Charger les modèles
    const db = require('./models');
    console.log('📦 Modèles chargés:', Object.keys(db).filter(k => k !== 'sequelize' && k !== 'Sequelize'));

    // 3) Synchroniser les modèles
    // En production: alter:true préserve les données existantes
    // En dev: utiliser force:true UNIQUEMENT pour réinitialiser la BD
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.log('🔄 Synchronisation des tables (production - alter: true)...');
      await sequelize.sync({ alter: true });
    } else {
      console.log('🔄 Synchronisation des tables (dev - alter: true)...');
      await sequelize.sync({ alter: true });
    }
    console.log('✅ Tables synchronisées !');
    
    // Vérifier les tables créées
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 Tables créées:', tables.map(t => Object.values(t)[0]));

    // 4) Démarrer le serveur HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur de démarrage :', err);
    console.error(err.stack);
    process.exit(1);
  }
})();
