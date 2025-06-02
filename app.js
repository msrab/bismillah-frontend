/**
 * Point d’entrée de l’API Bismillah
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

/* ------------------------------------------------------------------
 * Sequelize : instance + chargement des modèles
 * -----------------------------------------------------------------*/
// Attention aux chemins relatifs : on suppose que ce fichier app.js
// est placé à la racine du projet (à côté de package.json).
const { sequelize } = require('./backend/config/database');
require('./backend/models');  // index.js charge tous les modèles

/* ------------------------------------------------------------------
 * Express
 * -----------------------------------------------------------------*/
const app = express();
app.use(cors());
app.use(express.json());

/* -------------------------- Routes --------------------------------*/
const authRoutes       = require('./backend/routes/authRoutes');
// Si tu crées d’autres routes protégées, décommente et adapte ces lignes :
const userRoutes       = require('./backend/routes/userRoutes');
const restaurantRoutes = require('./backend/routes/restaurantRoutes');

app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/restaurants', restaurantRoutes);

app.get('/', (_, res) => {
  res.send('Bienvenue sur Bismillah-app API ✨');
});

/* ------------------------------------------------------------------
 * Démarrage
 * -----------------------------------------------------------------*/
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');

    /* --------------------------------------------------------------
     * 1) Pendant le développement :
     *    On peut conserver sync({ alter:true }) pour aller vite
     * --------------------------------------------------------------*/
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés (alter).');
    }

    /* --------------------------------------------------------------
     * 2) En staging / production :
     *    -> commenter la ligne ci-dessus
     *    -> exécuter les migrations : npx sequelize-cli db:migrate
     * --------------------------------------------------------------*/

    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Erreur de démarrage :', err);
    process.exit(1);
  }
})();
