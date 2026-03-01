// backend/scripts/init-db.js
/**
 * Script pour initialiser la base de données avec les données de base.
 * À exécuter UNE SEULE FOIS après le premier déploiement.
 * 
 * Usage: node scripts/init-db.js
 * 
 * Ce script :
 * 1. Recrée toutes les tables (force: true)
 * 2. Exécute les seeders dans l'ordre
 */
require('dotenv').config();
const sequelize = require('../config/database');
const path = require('path');
const fs = require('fs');

const seedersDir = path.join(__dirname, '../seeders');

async function initDatabase() {
  try {
    console.log('🔌 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie !');

    // Charger les modèles
    require('../models');

    // Recréer les tables (ATTENTION: supprime toutes les données !)
    console.log('🗑️  Suppression et recréation des tables (force: true)...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées !');

    // Lister et exécuter les seeders dans l'ordre
    const seedFiles = fs.readdirSync(seedersDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    console.log(`\n📦 Exécution de ${seedFiles.length} seeders...\n`);

    for (const file of seedFiles) {
      const seederPath = path.join(seedersDir, file);
      const seeder = require(seederPath);
      
      if (typeof seeder.up === 'function') {
        console.log(`  ▶️  ${file}...`);
        await seeder.up(sequelize.getQueryInterface(), sequelize.constructor);
        console.log(`  ✅ ${file} terminé`);
      } else {
        console.log(`  ⚠️  ${file} n'a pas de méthode up(), ignoré`);
      }
    }

    console.log('\n🎉 Base de données initialisée avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation:', err);
    process.exit(1);
  }
}

initDatabase();
