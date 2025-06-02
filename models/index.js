// backend/models/index.js

'use strict';

const fs       = require('fs');
const path     = require('path');
const basename = path.basename(__filename);

// On importe notre instance Sequelize (celle configurée dans config/database.js)
// ATTENTION : ajustez le chemin si nécessaire
const { sequelize } = require('../config/database');

// On déclarera un objet vide qui recueillera tous les modèles
const db = {};

// Pour chaque fichier .js du dossier models (sauf index.js),
fs
  .readdirSync(__dirname)
  .filter(file => {
    // On ne garde que les .js, sauf ce fichier index.js lui-même
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // On importe le modèle : chaque fichier doit faire "module.exports = (sequelize) => { ... }"
    const model = require(path.join(__dirname, file))(sequelize, sequelize.Sequelize.DataTypes);
    db[model.name] = model;
  });

// Si certains modèles ont une fonction associate, on l’exécute
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// On ajoute l’instance Sequelize et la classe Sequelize dans l’objet exporté
db.sequelize = sequelize;
db.Sequelize = sequelize.Sequelize;

module.exports = db;
