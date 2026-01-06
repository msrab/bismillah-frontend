'use strict';

module.exports = {
  async up (queryInterface) {
    // Langues Belgique: 1=Français, 2=English, 3=Nederlands, 4=Deutsch
    await queryInterface.bulkInsert('restaurant_type_descriptions', [
      // Restaurant Gastronomique
      { restaurantTypeId: 1, languageId: 1, name: 'Restaurant Gastronomique', description: 'Cuisine raffinée et haut de gamme' },
      { restaurantTypeId: 1, languageId: 2, name: 'Fine Dining', description: 'Refined and upscale cuisine' },
      { restaurantTypeId: 1, languageId: 3, name: 'Gastronomisch restaurant', description: 'Verfijnde en hoogwaardige keuken' },
      { restaurantTypeId: 1, languageId: 4, name: 'Gourmetrestaurant', description: 'Feine und gehobene Küche' },

      // Pizzeria
      { restaurantTypeId: 2, languageId: 1, name: 'Pizzeria', description: 'Spécialités de pizzas' },
      { restaurantTypeId: 2, languageId: 2, name: 'Pizzeria', description: 'Pizza specialties' },
      { restaurantTypeId: 2, languageId: 3, name: 'Pizzeria', description: 'Pizzaspecialiteiten' },
      { restaurantTypeId: 2, languageId: 4, name: 'Pizzeria', description: 'Pizzaspezialitäten' },

      // Fast Food
      { restaurantTypeId: 3, languageId: 1, name: 'Fast Food', description: 'Restauration rapide' },
      { restaurantTypeId: 3, languageId: 2, name: 'Fast Food', description: 'Quick service restaurant' },
      { restaurantTypeId: 3, languageId: 3, name: 'Fastfood', description: 'Snelle service restaurant' },
      { restaurantTypeId: 3, languageId: 4, name: 'Fast Food', description: 'Schnellrestaurant' },

      // Crêperie
      { restaurantTypeId: 4, languageId: 1, name: 'Crêperie', description: 'Spécialités de crêpes' },
      { restaurantTypeId: 4, languageId: 2, name: 'Creperie', description: 'Crepe specialties' },
      { restaurantTypeId: 4, languageId: 3, name: 'Creperie', description: 'Pannenkoekenspecialiteiten' },
      { restaurantTypeId: 4, languageId: 4, name: 'Crêperie', description: 'Crêpe-Spezialitäten' },

      // Sushi Bar
      { restaurantTypeId: 5, languageId: 1, name: 'Sushi Bar', description: 'Spécialités de sushis et cuisine japonaise' },
      { restaurantTypeId: 5, languageId: 2, name: 'Sushi Bar', description: 'Sushi and Japanese cuisine specialties' },
      { restaurantTypeId: 5, languageId: 3, name: 'Sushibar', description: 'Sushi en Japanse specialiteiten' },
      { restaurantTypeId: 5, languageId: 4, name: 'Sushi-Bar', description: 'Sushi und japanische Küche' },

      // Mexicain
      { restaurantTypeId: 6, languageId: 1, name: 'Restaurant Mexicain', description: 'Cuisine mexicaine authentique' },
      { restaurantTypeId: 6, languageId: 2, name: 'Mexican Restaurant', description: 'Authentic Mexican cuisine' },
      { restaurantTypeId: 6, languageId: 3, name: 'Mexicaans restaurant', description: 'Authentieke Mexicaanse keuken' },
      { restaurantTypeId: 6, languageId: 4, name: 'Mexikanisches Restaurant', description: 'Authentische mexikanische Küche' },

      // Asiatique
      { restaurantTypeId: 7, languageId: 1, name: 'Restaurant Asiatique', description: 'Cuisine asiatique variée' },
      { restaurantTypeId: 7, languageId: 2, name: 'Asian Restaurant', description: 'Varied Asian cuisine' },
      { restaurantTypeId: 7, languageId: 3, name: 'Aziatisch restaurant', description: 'Gevarieerde Aziatische keuken' },
      { restaurantTypeId: 7, languageId: 4, name: 'Asiatisches Restaurant', description: 'Vielseitige asiatische Küche' },

      // Grill/Steakhouse
      { restaurantTypeId: 8, languageId: 1, name: 'Grill / Steakhouse', description: 'Viandes grillées et spécialités de steak' },
      { restaurantTypeId: 8, languageId: 2, name: 'Grill / Steakhouse', description: 'Grilled meats and steak specialties' },
      { restaurantTypeId: 8, languageId: 3, name: 'Grill / Steakhouse', description: 'Gegrild vlees en steak specialiteiten' },
      { restaurantTypeId: 8, languageId: 4, name: 'Grill / Steakhouse', description: 'Gegrilltes Fleisch und Steak-Spezialitäten' },

      // Végétarien
      { restaurantTypeId: 9, languageId: 1, name: 'Végétarien', description: 'Cuisine végétarienne et saine' },
      { restaurantTypeId: 9, languageId: 2, name: 'Vegetarian', description: 'Vegetarian and healthy cuisine' },
      { restaurantTypeId: 9, languageId: 3, name: 'Vegetarisch', description: 'Vegetarische en gezonde keuken' },
      { restaurantTypeId: 9, languageId: 4, name: 'Vegetarisch', description: 'Vegetarische und gesunde Küche' },

      // Glacier
      { restaurantTypeId: 10, languageId: 1, name: 'Glacier', description: 'Spécialités de glaces et desserts glacés' },
      { restaurantTypeId: 10, languageId: 2, name: 'Ice Cream Parlor', description: 'Ice cream and frozen dessert specialties' },
      { restaurantTypeId: 10, languageId: 3, name: 'IJssalon', description: 'IJs en bevroren dessertspecialiteiten' },
      { restaurantTypeId: 10, languageId: 4, name: 'Eisdiele', description: 'Eis- und gefrorene Dessertspezialitäten' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurant_type_descriptions', null, {});
  }
};
