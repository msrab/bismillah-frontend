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
      { restaurantTypeId: 4, languageId: 6, name: 'Creperie', description: 'Pannenkoekenspecialiteiten' },

      // Sushi Bar
      { restaurantTypeId: 5, languageId: 1, name: 'Sushi Bar', description: 'Spécialités de sushis et cuisine japonaise' },
      { restaurantTypeId: 5, languageId: 2, name: 'Sushi Bar', description: 'Sushi and Japanese cuisine specialties' },
      { restaurantTypeId: 5, languageId: 3, name: 'سوشي بار', description: 'تخصصات السوشي والمطبخ الياباني' },
      { restaurantTypeId: 5, languageId: 4, name: 'Sushi-Bar', description: 'Sushi und japanische Küche' },
      { restaurantTypeId: 5, languageId: 5, name: 'Bar de Sushi', description: 'Especialidades de sushi y cocina japonesa' },
      { restaurantTypeId: 5, languageId: 6, name: 'Sushibar', description: 'Sushi en Japanse specialiteiten' },

      // Mexicain
      { restaurantTypeId: 6, languageId: 1, name: 'Restaurant Mexicain', description: 'Cuisine mexicaine authentique' },
      { restaurantTypeId: 6, languageId: 2, name: 'Mexican Restaurant', description: 'Authentic Mexican cuisine' },
      { restaurantTypeId: 6, languageId: 3, name: 'مطعم مكسيكي', description: 'مأكولات مكسيكية أصيلة' },
      { restaurantTypeId: 6, languageId: 4, name: 'Mexikanisches Restaurant', description: 'Authentische mexikanische Küche' },
      { restaurantTypeId: 6, languageId: 5, name: 'Restaurante Mexicano', description: 'Cocina mexicana auténtica' },
      { restaurantTypeId: 6, languageId: 6, name: 'Mexicaans restaurant', description: 'Authentieke Mexicaanse keuken' },

      // Asiatique
      { restaurantTypeId: 7, languageId: 1, name: 'Restaurant Asiatique', description: 'Cuisine asiatique variée' },
      { restaurantTypeId: 7, languageId: 2, name: 'Asian Restaurant', description: 'Varied Asian cuisine' },
      { restaurantTypeId: 7, languageId: 3, name: 'مطعم آسيوي', description: 'مأكولات آسيوية متنوعة' },
      { restaurantTypeId: 7, languageId: 4, name: 'Asiatisches Restaurant', description: 'Vielseitige asiatische Küche' },
      { restaurantTypeId: 7, languageId: 5, name: 'Restaurante Asiático', description: 'Cocina asiática variada' },
      { restaurantTypeId: 7, languageId: 6, name: 'Aziatisch restaurant', description: 'Gevarieerde Aziatische keuken' },

      // Grill/Steakhouse
      { restaurantTypeId: 8, languageId: 1, name: 'Grill / Steakhouse', description: 'Viandes grillées et spécialités de steak' },
      { restaurantTypeId: 8, languageId: 2, name: 'Grill / Steakhouse', description: 'Grilled meats and steak specialties' },
      { restaurantTypeId: 8, languageId: 3, name: 'مطعم مشاوي', description: 'لحوم مشوية وتخصصات الستيك' },
      { restaurantTypeId: 8, languageId: 4, name: 'Grill / Steakhouse', description: 'Gegrilltes Fleisch und Steak-Spezialitäten' },
      { restaurantTypeId: 8, languageId: 5, name: 'Parrilla / Steakhouse', description: 'Carnes a la parrilla y especialidades de bistec' },
      { restaurantTypeId: 8, languageId: 6, name: 'Grill / Steakhouse', description: 'Gegrild vlees en steak specialiteiten' },

      // Végétarien
      { restaurantTypeId: 9, languageId: 1, name: 'Végétarien', description: 'Cuisine végétarienne et saine' },
      { restaurantTypeId: 9, languageId: 2, name: 'Vegetarian', description: 'Vegetarian and healthy cuisine' },
      { restaurantTypeId: 9, languageId: 3, name: 'مطعم نباتي', description: 'مأكولات نباتية وصحية' },
      { restaurantTypeId: 9, languageId: 4, name: 'Vegetarisch', description: 'Vegetarische und gesunde Küche' },
      { restaurantTypeId: 9, languageId: 5, name: 'Vegetariano', description: 'Cocina vegetariana y saludable' },
      { restaurantTypeId: 9, languageId: 6, name: 'Vegetarisch', description: 'Vegetarische en gezonde keuken' },

      // Glacier
      { restaurantTypeId: 10, languageId: 1, name: 'Glacier', description: 'Spécialités de glaces et desserts glacés' },
      { restaurantTypeId: 10, languageId: 2, name: 'Ice Cream Parlor', description: 'Ice cream and frozen dessert specialties' },
      { restaurantTypeId: 10, languageId: 3, name: 'محل مثلجات', description: 'تخصصات المثلجات والحلويات المجمدة' },
      { restaurantTypeId: 10, languageId: 4, name: 'Eisdiele', description: 'Eis- und gefrorene Dessertspezialitäten' },
      { restaurantTypeId: 10, languageId: 5, name: 'Heladería', description: 'Especialidades de helados y postres congelados' },
      { restaurantTypeId: 10, languageId: 6, name: 'IJssalon', description: 'IJs en bevroren dessertspecialiteiten' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurant_type_descriptions', null, {});
  }
};