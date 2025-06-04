/**
 * Point d’entrée de l’API Bismillah
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

/* ------------------------------------------------------------------
 * Sequelize : instance + chargement des modèles
 * -----------------------------------------------------------------*/
const sequelize = require('./config/database');  // l’instance Sequelize configurée
require('./models');  // cette ligne charge automatiquement tous les modèles présents dans backend/models/index.js

/* ------------------------------------------------------------------
 * Express
 * -----------------------------------------------------------------*/
const app = express();
app.use(cors());
app.use(express.json());

/* -------------------------- Routes --------------------------------*/
const authUserRoutes       = require('./routes/authUserRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');
//const profilRoutes         = require('./routes/profilRoutes');
const userRoutes           = require('./routes/userRoutes');
const restaurantRoutes     = require('./routes/restaurantRoutes');

// Middleware d’authentification (vérification JWT)
const authMiddleware = require('./middlewares/authMiddleware');

// Routes “publices” (inscription + connexion)
app.use('/api/auth/user', authUserRoutes);
app.use('/api/auth/restaurant', authRestaurantRoutes);

// Routes protégées par JWT
//app.use('/api/profil', authMiddleware.verifyToken, profilRoutes);
app.use('/api/users', authMiddleware.verifyToken, userRoutes);
app.use('/api/restaurants', authMiddleware.verifyToken, restaurantRoutes);

// Route de test basique
app.get('/', (_, res) => {
  res.send('Bienvenue sur Bismillah-app API ✨');
});

/* ------------------------------------------------------------------
 * Démarrage du serveur
 * -----------------------------------------------------------------*/
// Exposer app et sequelize pour les tests
module.exports = { app, sequelize };

// Si on n’est PAS en mode “test”, on démarre vraiment le serveur :
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      // 1) Vérifier la connexion à la base de données
      await sequelize.authenticate();
      console.log('✅ Connexion à la base de données réussie !');

      // 2) En développement local, synchroniser automatiquement le schéma
      if (process.env.NODE_ENV !== 'production') {
        await sequelize.sync({ alter: true });
        console.log('✅ Modèles synchronisés (alter).');
      }

      // 3) Démarrer le serveur HTTP
      app.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('❌ Erreur de démarrage :', err);
      process.exit(1);
    }
  })();
}
