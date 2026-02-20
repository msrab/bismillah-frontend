// server.js
/**
 * Point d'entrée de l'API Bismillah (module "core" qui exporte juste `app` et `sequelize`)
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet = require('helmet');
const path = require('path');

/* ------------------------------------------------------------------
 * Sequelize : instance + chargement des modèles
 * -----------------------------------------------------------------*/
const sequelize = require('./config/database');  // l’instance Sequelize configurée
require('./models');  // cette ligne charge automatiquement tous les modèles présents dans backend/models/index.js

/* ------------------------------------------------------------------
 * Express
 * -----------------------------------------------------------------*/
const app = express();

// Configuration CORS - accepter localhost en dev et Railway en prod
const allowedOrigins = [
  'http://localhost:5173',
  'https://bismillah-frontend-production.up.railway.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(helmet());

// Servir les fichiers statiques (uploads de logos, images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* -------------------------- Routes --------------------------------*/
const authUserRoutes       = require('./routes/authUserRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');
const userRoutes           = require('./routes/userRoutes');
const restaurantRoutes     = require('./routes/RestaurantRoutes');
const countryRoutes        = require('./routes/CountryRoutes');
const cityRoutes           = require('./routes/CityRoutes');
const streetRoutes         = require('./routes/StreetRoutes');
const languageRoutes       = require('./routes/LanguageRoutes');
const restaurantLanguageRoutes = require('./routes/RestaurantLanguageRoutes');
const restaurantTypeRoutes = require('./routes/RestaurantTypeRoutes');
const categoryMenuRoutes  = require('./routes/CategoryMenuRoutes');
const ElementMenuRoutes   = require('./routes/ElementMenuRoutes');
const certifierRoutes     = require('./routes/CertifierRoutes');
const restaurantCertificationRoutes = require('./routes/RestaurantCertificationRoutes');

const errorHandler = require('./middlewares/errorHandler');



// Routes "publiques" (inscription + connexion)
//app.use('/api/auth/user', authUserRoutes);
app.use('/api/auth/restaurant', authRestaurantRoutes);

// Routes protégées par JWT
//app.use('/api/users',       verifyToken, userRoutes);
app.use('/api/restaurant-types', restaurantTypeRoutes);
app.use('/api/restaurant-languages', restaurantLanguageRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/streets', streetRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/category-menus', categoryMenuRoutes);
app.use('/api/element-menus', ElementMenuRoutes);
app.use('/api/certifiers', certifierRoutes);
app.use('/api/certifications', restaurantCertificationRoutes);

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
