// backend/start.js
const app = require('./server');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés (alter).');
    }
    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Erreur de démarrage :', err);
    process.exit(1);
  }
})();
