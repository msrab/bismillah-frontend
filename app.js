require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Language = require('./models/Language');
const Country = require('./models/Country');
const City = require('./models/City');
const Street = require('./models/Street');
const RestaurantType = require('./models/RestaurantType');
const CategoryMenu = require('./models/CategoryMenu');


const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Bienvenue sur Bismillah-app API ✨');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log('✅ Connexion à la base de données réussie !'))
  .catch(err => console.error('❌ Erreur de connexion à la base de données :', err));

sequelize.sync({ alter: true }) 
  .then(() => console.log("✅ Modèles synchronisés."))
  .catch(err => console.error("❌ Erreur sync Language :", err));