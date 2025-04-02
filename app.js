require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
