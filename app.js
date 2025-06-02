// backend/app.js
/**
 * Point d’entrée de l’API Bismillah
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

/* ------------------------------------------------------------------
 * 1) Import de l’instance Sequelize et chargement des modèles
 * -----------------------------------------------------------------*/
const db = require('./models');        // <-- va exécuter models/index.js
const sequelize = db.sequelize;

/* ------------------------------------------------------------------
 * 2) Configuration d’Express
 * -----------------------------------------------------------------*/
const app = express();
app.use(cors());
app.use(express.json());

/* ------------------------------------------------------------------
 * 3) Routes (exemple : auth)
 * -----------------------------------------------------------------*/
const authUserRoutes       = require('./routes/authUserRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');

app.use('/api/auth/user',       authUserRoutes);
app.use('/api/auth/restaurant', authRestaurantRoutes);

/* ------------------------------------------------------------------
 * 4) Route de test
 * -----------------------------------------------------------------*/
app.get('/', (_, res) => {
  res.send('Bienvenue sur Bismillah-app API ✨');
});

/* ------------------------------------------------------------------
 * 5) Démarrage
 * -----------------------------------------------------------------*/
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
