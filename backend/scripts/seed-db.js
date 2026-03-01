// backend/scripts/seed-db.js
/**
 * Script pour exécuter les seeders SANS recréer les tables.
 * Utile pour peupler une BD existante avec les données de base.
 * 
 * Usage: node scripts/seed-db.js
 */
require('dotenv').config();
const sequelize = require('../config/database');
const path = require('path');
const fs = require('fs');

const seedersDir = path.join(__dirname, '../seeders');

async function seedDatabase() {
  try {
    console.log('🔌 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie !');

    // Charger les modèles (nécessaire pour les associations)
    require('../models');

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
        try {
          await seeder.up(sequelize.getQueryInterface(), sequelize.constructor);
          console.log(`  ✅ ${file} terminé`);
        } catch (err) {
          // Ignorer les erreurs de doublons (données déjà présentes)
          if (err.name === 'SequelizeUniqueConstraintError') {
            console.log(`  ⚠️  ${file} - données déjà présentes, ignoré`);
          } else {
            throw err;
          }
        }
      } else {
        console.log(`  ⚠️  ${file} n'a pas de méthode up(), ignoré`);
      }
    }

    console.log('\n🎉 Seeders exécutés avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
