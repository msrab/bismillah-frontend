// start.js
/**
 * Fichier "réel" de démarrage du serveur (pour dev / prod).
 *
 * Il importe `app` et `sequelize` depuis server.js, puis appelle `app.listen()`.
 */
require('dotenv').config();
const { app, sequelize } = require('./server');
const path = require('path');

const PORT = process.env.PORT || 5000;

/**
 * Seeders de données de référence (indispensables au fonctionnement de l'app).
 * Exécutés automatiquement UNIQUEMENT si la BD est vide (tables de base sans données).
 * Les seeders de données de test (restaurants, users, menus…) ne sont PAS inclus ici.
 */
const ESSENTIAL_SEEDERS = [
  '00-LanguageSeed.js',
  '01-CountrySeed.js',
  '04-RestaurantTypeSeed.js',
  '05-RestaurantTypeDescriptionSeed.js',
  '09-CategoryMenuSeed.js',
  '10-CategoryMenuDescriptionSeed.js',
  '13-CertifierSeed.js',
];

/**
 * Vérifie si les données de référence essentielles existent.
 * Retourne true si la BD a besoin d'être peuplée.
 */
async function needsSeeding() {
  try {
    const [countries] = await sequelize.query('SELECT COUNT(*) as count FROM countries');
    const [languages] = await sequelize.query('SELECT COUNT(*) as count FROM Languages');
    return countries[0].count === 0 || languages[0].count === 0;
  } catch {
    // Si les tables n'existent pas encore, on a besoin du seeding
    return true;
  }
}

/**
 * Exécute les seeders essentiels (données de référence uniquement).
 */
async function runEssentialSeeders() {
  const seedersDir = path.join(__dirname, 'seeders');
  const queryInterface = sequelize.getQueryInterface();

  console.log(`\n��� Exécution de ${ESSENTIAL_SEEDERS.length} seeders essentiels...\n`);

  for (const file of ESSENTIAL_SEEDERS) {
    const seeder = require(path.join(seedersDir, file));
    if (typeof seeder.up === 'function') {
      try {
        await seeder.up(queryInterface, sequelize.constructor);
        console.log(`  ✅ ${file}`);
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          console.log(`  ⚠️  ${file} — données déjà présentes, ignoré`);
        } else {
          console.error(`  ❌ ${file} — erreur:`, err.message);
          throw err;
        }
      }
    }
  }

  console.log('\n��� Données de référence insérées avec succès !\n');
}

(async () => {
  try {
    // 1) Vérifier la connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');

    // 2) Charger les modèles
    const db = require('./models');
    console.log('��� Modèles chargés:', Object.keys(db).filter(k => k !== 'sequelize' && k !== 'Sequelize'));

    // 3) Synchroniser les modèles
    // En production: alter:true préserve les données existantes
    // En dev: utiliser force:true UNIQUEMENT pour réinitialiser la BD
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.log('��� Synchronisation des tables (production - alter: true)...');
      await sequelize.sync({ alter: true });
    } else {
      console.log('��� Synchronisation des tables (dev - alter: true)...');
      await sequelize.sync({ alter: true });
    }
    console.log('✅ Tables synchronisées !');

    // Vérifier les tables créées
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('��� Tables créées:', tables.map(t => Object.values(t)[0]));

    // 4) Seeder automatique si la BD est vide (données de référence uniquement)
    if (await needsSeeding()) {
      console.log('��� Base de données vide détectée — insertion des données de référence...');
      await runEssentialSeeders();
    } else {
      console.log('✅ Données de référence déjà présentes, seeding ignoré.');
    }

    // 5) Démarrer le serveur HTTP
    app.listen(PORT, () => {
      console.log(`��� Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur de démarrage :', err);
    console.error(err.stack);
    process.exit(1);
  }
})();
