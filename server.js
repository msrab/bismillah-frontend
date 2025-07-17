// server.js
/**
 * Point d’entrée de l’API Bismillah (module “core” qui exporte juste `app` et `sequelize`)
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet = require('helmet');

/* ------------------------------------------------------------------
 * Sequelize : instance + chargement des modèles
 * -----------------------------------------------------------------*/
const sequelize = require('./config/database');  // l’instance Sequelize configurée
require('./models');  // cette ligne charge automatiquement tous les modèles présents dans backend/models/index.js

/* ------------------------------------------------------------------
 * Express
 * -----------------------------------------------------------------*/
const app = express();
app.use(cors({
  origin: 'https://monapp.front',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(helmet());

/* -------------------------- Routes --------------------------------*/
const authUserRoutes       = require('./routes/authUserRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');
const userRoutes           = require('./routes/userRoutes');
const restaurantRoutes     = require('./routes/restaurantRoutes');
const countryRoutes        = require('./routes/CountryRoutes');
const cityRoutes        = require('./routes/CityRoutes');
const streetRoutes        = require('./routes/StreetRoutes');

const errorHandler = require('./middlewares/errorHandler');

// Middleware d’authentification (vérification JWT)
const { verifyToken } = require('./middlewares/authMiddleware');

// Routes “publiques” (inscription + connexion)
app.use('/api/auth/user', authUserRoutes);
app.use('/api/auth/restaurant', authRestaurantRoutes);

// Routes protégées par JWT
app.use('/api/users',       verifyToken, userRoutes);
app.use('/api/restaurants', verifyToken, restaurantRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/streets', streetRoutes);

// Route de test basique
app.get('/', (_, res) => {
  res.send('Bienvenue sur Bismillah-app API ✨');
});

app.use(errorHandler);

/* ------------------------------------------------------------------
 * Export pour permettre aux tests de récupérer `app` et `sequelize`.
 * 
 * NE PAS appeler app.listen() ici : on démarre le serveur dans start.js.
 * -----------------------------------------------------------------*/
module.exports = { app, sequelize };
