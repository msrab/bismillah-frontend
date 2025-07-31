'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('category_menu_descriptions', [
      // Français (id: 1)
      { categoryMenuId: 1, languageId: 1, name: 'Entrées', description: 'Entrées froides ou chaudes' },
      { categoryMenuId: 2, languageId: 1, name: 'Plats', description: 'Plats principaux' },
      { categoryMenuId: 3, languageId: 1, name: 'Desserts', description: 'Desserts sucrés' },
      { categoryMenuId: 4, languageId: 1, name: 'Pizzas', description: 'Pizzas variées' },
      { categoryMenuId: 5, languageId: 1, name: 'Salades', description: 'Salades fraîches' },
      { categoryMenuId: 6, languageId: 1, name: 'Plats froids', description: 'Plats servis froids' },
      { categoryMenuId: 7, languageId: 1, name: 'Plats chauds', description: 'Plats servis chauds' },
      { categoryMenuId: 8, languageId: 1, name: 'Boissons', description: 'Toutes les boissons' },
      { categoryMenuId: 9, languageId: 1, name: 'Boissons froides', description: 'Boissons rafraîchissantes' },
      { categoryMenuId: 10, languageId: 1, name: 'Boissons chaudes', description: 'Boissons chaudes' },

      // English (id: 2)
      { categoryMenuId: 1, languageId: 2, name: 'Starters', description: 'Hot or cold starters' },
      { categoryMenuId: 2, languageId: 2, name: 'Main Courses', description: 'Main dishes' },
      { categoryMenuId: 3, languageId: 2, name: 'Desserts', description: 'Sweet desserts' },
      { categoryMenuId: 4, languageId: 2, name: 'Pizzas', description: 'Various pizzas' },
      { categoryMenuId: 5, languageId: 2, name: 'Salads', description: 'Fresh salads' },
      { categoryMenuId: 6, languageId: 2, name: 'Cold Dishes', description: 'Served cold' },
      { categoryMenuId: 7, languageId: 2, name: 'Hot Dishes', description: 'Served hot' },
      { categoryMenuId: 8, languageId: 2, name: 'Drinks', description: 'All drinks' },
      { categoryMenuId: 9, languageId: 2, name: 'Cold Drinks', description: 'Refreshing drinks' },
      { categoryMenuId: 10, languageId: 2, name: 'Hot Drinks', description: 'Hot drinks' },

      // العربية (id: 3)
      { categoryMenuId: 1, languageId: 3, name: 'مقبلات', description: 'مقبلات باردة أو ساخنة' },
      { categoryMenuId: 2, languageId: 3, name: 'الأطباق الرئيسية', description: 'الأطباق الرئيسية' },
      { categoryMenuId: 3, languageId: 3, name: 'حلويات', description: 'حلويات' },
      { categoryMenuId: 4, languageId: 3, name: 'بيتزا', description: 'أنواع البيتزا' },
      { categoryMenuId: 5, languageId: 3, name: 'سلطات', description: 'سلطات طازجة' },
      { categoryMenuId: 6, languageId: 3, name: 'أطباق باردة', description: 'أطباق تقدم باردة' },
      { categoryMenuId: 7, languageId: 3, name: 'أطباق ساخنة', description: 'أطباق تقدم ساخنة' },
      { categoryMenuId: 8, languageId: 3, name: 'مشروبات', description: 'جميع المشروبات' },
      { categoryMenuId: 9, languageId: 3, name: 'مشروبات باردة', description: 'مشروبات منعشة' },
      { categoryMenuId: 10, languageId: 3, name: 'مشروبات ساخنة', description: 'مشروبات ساخنة' },

      // Deutsch (id: 4)
      { categoryMenuId: 1, languageId: 4, name: 'Vorspeisen', description: 'Kalte oder warme Vorspeisen' },
      { categoryMenuId: 2, languageId: 4, name: 'Hauptgerichte', description: 'Hauptgerichte' },
      { categoryMenuId: 3, languageId: 4, name: 'Desserts', description: 'Süße Nachspeisen' },
      { categoryMenuId: 4, languageId: 4, name: 'Pizzen', description: 'Verschiedene Pizzen' },
      { categoryMenuId: 5, languageId: 4, name: 'Salate', description: 'Frische Salate' },
      { categoryMenuId: 6, languageId: 4, name: 'Kalte Gerichte', description: 'Kalt serviert' },
      { categoryMenuId: 7, languageId: 4, name: 'Warme Gerichte', description: 'Warm serviert' },
      { categoryMenuId: 8, languageId: 4, name: 'Getränke', description: 'Alle Getränke' },
      { categoryMenuId: 9, languageId: 4, name: 'Kalte Getränke', description: 'Erfrischende Getränke' },
      { categoryMenuId: 10, languageId: 4, name: 'Heiße Getränke', description: 'Heiße Getränke' },

      // Español (id: 5)
      { categoryMenuId: 1, languageId: 5, name: 'Entrantes', description: 'Entrantes fríos o calientes' },
      { categoryMenuId: 2, languageId: 5, name: 'Platos principales', description: 'Platos principales' },
      { categoryMenuId: 3, languageId: 5, name: 'Postres', description: 'Postres dulces' },
      { categoryMenuId: 4, languageId: 5, name: 'Pizzas', description: 'Variedad de pizzas' },
      { categoryMenuId: 5, languageId: 5, name: 'Ensaladas', description: 'Ensaladas frescas' },
      { categoryMenuId: 6, languageId: 5, name: 'Platos fríos', description: 'Servidos fríos' },
      { categoryMenuId: 7, languageId: 5, name: 'Platos calientes', description: 'Servidos calientes' },
      { categoryMenuId: 8, languageId: 5, name: 'Bebidas', description: 'Todas las bebidas' },
      { categoryMenuId: 9, languageId: 5, name: 'Bebidas frías', description: 'Bebidas refrescantes' },
      { categoryMenuId: 10, languageId: 5, name: 'Bebidas calientes', description: 'Bebidas calientes' },

      // Nederlands (id: 6)
      { categoryMenuId: 1, languageId: 6, name: 'Voorgerechten', description: 'Koude of warme voorgerechten' },
      { categoryMenuId: 2, languageId: 6, name: 'Hoofdgerechten', description: 'Hoofdgerechten' },
      { categoryMenuId: 3, languageId: 6, name: 'Desserts', description: 'Zoete desserts' },
      { categoryMenuId: 4, languageId: 6, name: 'Pizza\'s', description: 'Verschillende pizza\'s' },
      { categoryMenuId: 5, languageId: 6, name: 'Salades', description: 'Verse salades' },
      { categoryMenuId: 6, languageId: 6, name: 'Koude gerechten', description: 'Koud geserveerd' },
      { categoryMenuId: 7, languageId: 6, name: 'Warme gerechten', description: 'Warm geserveerd' },
      { categoryMenuId: 8, languageId: 6, name: 'Dranken', description: 'Alle dranken' },
      { categoryMenuId: 9, languageId: 6, name: 'Koude dranken', description: 'Verfrissende dranken' },
      { categoryMenuId: 10, languageId: 6, name: 'Warme dranken', description: 'Warme dranken' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_menu_descriptions', null, {});
  }
};