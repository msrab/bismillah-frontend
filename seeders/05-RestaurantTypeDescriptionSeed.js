'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('restaurant_type_descriptions', [
      // Restaurant Gastronomique
      { restaurantTypeId: 1, languageId: 1, name: 'Restaurant Gastronomique', description: 'Cuisine raffinée et haut de gamme' },
      { restaurantTypeId: 1, languageId: 2, name: 'Fine Dining', description: 'Refined and upscale cuisine' },
      { restaurantTypeId: 1, languageId: 3, name: 'مطعم فاخر', description: 'مأكولات راقية وفاخرة' },
      { restaurantTypeId: 1, languageId: 4, name: 'Gourmetrestaurant', description: 'Feine und gehobene Küche' },
      { restaurantTypeId: 1, languageId: 5, name: 'Restaurante Gastronómico', description: 'Cocina refinada y de alta gama' },
      { restaurantTypeId: 1, languageId: 6, name: 'Gastronomisch restaurant', description: 'Verfijnde en hoogwaardige keuken' },

      // Pizzeria
      { restaurantTypeId: 2, languageId: 1, name: 'Pizzeria', description: 'Spécialités de pizzas' },
      { restaurantTypeId: 2, languageId: 2, name: 'Pizzeria', description: 'Pizza specialties' },
      { restaurantTypeId: 2, languageId: 3, name: 'بيتزا', description: 'تخصصات البيتزا' },
      { restaurantTypeId: 2, languageId: 4, name: 'Pizzeria', description: 'Pizzaspezialitäten' },
      { restaurantTypeId: 2, languageId: 5, name: 'Pizzería', description: 'Especialidades de pizza' },
      { restaurantTypeId: 2, languageId: 6, name: 'Pizzeria', description: 'Pizzaspecialiteiten' },

      // Fast Food
      { restaurantTypeId: 3, languageId: 1, name: 'Fast Food', description: 'Restauration rapide' },
      { restaurantTypeId: 3, languageId: 2, name: 'Fast Food', description: 'Quick service restaurant' },
      { restaurantTypeId: 3, languageId: 3, name: 'وجبات سريعة', description: 'مطعم خدمة سريعة' },
      { restaurantTypeId: 3, languageId: 4, name: 'Fast Food', description: 'Schnellrestaurant' },
      { restaurantTypeId: 3, languageId: 5, name: 'Comida rápida', description: 'Restaurante de servicio rápido' },
      { restaurantTypeId: 3, languageId: 6, name: 'Fastfood', description: 'Snelle service restaurant' },

      // Crêperie
      { restaurantTypeId: 4, languageId: 1, name: 'Crêperie', description: 'Spécialités de crêpes' },
      { restaurantTypeId: 4, languageId: 2, name: 'Creperie', description: 'Crepe specialties' },
      { restaurantTypeId: 4, languageId: 3, name: 'كريب', description: 'تخصصات الكريب' },
      { restaurantTypeId: 4, languageId: 4, name: 'Crêperie', description: 'Crêpe-Spezialitäten' },
      { restaurantTypeId: 4, languageId: 5, name: 'Crepería', description: 'Especialidades de crepes' },
      { restaurantTypeId: 4, languageId: 6, name: 'Creperie', description: 'Pannenkoekenspecialiteiten' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurant_type_descriptions', null, {});
  }
};