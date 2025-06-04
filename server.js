// server.js
/**
 * Point d’entrée de l’API Bismillah (module “core” qui exporte juste `app` et `sequelize`)
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
const userRoutes           = require('./routes/userRoutes');
const restaurantRoutes     = require('./routes/restaurantRoutes');

// Middleware d’authentification (vérification JWT)
const { verifyToken } = require('./middlewares/authMiddleware');

// Routes “publiques” (inscription + connexion)
app.use('/api/auth/user', authUserRoutes);
app.use('/api/auth/restaurant', authRestaurantRoutes);

// Routes protégées par JWT
app.use('/api/users',       verifyToken, userRoutes);
app.use('/api/restaurants', verifyToken, restaurantRoutes);

// Route de test basique
app.get('/', (_, res) => {
  res.send('Bienvenue sur Bismillah-app API ✨');
});

/* ------------------------------------------------------------------
 * Export pour permettre aux tests de récupérer `app` et `sequelize`.
 * 
 * NE PAS appeler app.listen() ici : on démarre le serveur dans start.js.
 * -----------------------------------------------------------------*/
module.exports = { app, sequelize };
