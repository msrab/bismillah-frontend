const slugify = require('./slugify');

/**
 * Vérifie si un slug existe déjà en base (asynchrone)
 * @param {string} slug - Le slug à vérifier
 * @param {object} RestaurantModel - Le modèle Sequelize Restaurant
 * @returns {Promise<boolean>} true si le slug existe, false sinon
 */
async function isSlugTaken(slug, RestaurantModel) {
  const found = await RestaurantModel.findOne({ where: { slug } });
  return !!found;
}

/**
 * Génère un slug unique pour un restaurant à partir du nom du restaurantet de la ville
 * @param {string} name - Nom du restaurant
 * @param {string} city - Nom de la ville (optionnel)
 * @param {object} RestaurantModel - Le modèle Sequelize Restaurant
 * @returns {Promise<string>} Un slug unique
 */
async function generateRestaurantSlug(name, city, RestaurantModel) {
  let baseSlug = slugify(name);
  if (!(await isSlugTaken(baseSlug, RestaurantModel))) {
    return baseSlug;
  }
  if (city) {
    const citySlug = slugify(city);
    const cityVersion = `${baseSlug}-${citySlug}`;
    if (!(await isSlugTaken(cityVersion, RestaurantModel))) {
      return cityVersion;
    }
    const timestampVersion = `${cityVersion}-${Date.now()}`;
    return timestampVersion;
  }
  // Si pas de ville, fallback timestamp
  return `${baseSlug}-${Date.now()}`;
}

module.exports = {
  isSlugTaken,
  generateRestaurantSlug,
};
