'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('category_menu_descriptions', [
      // Français (id: 1)
      { categoryMenuId: 1, languageId: 1, name: 'Entrées', description: 'Entrées froides ou chaudes' },
      { categoryMenuId: 2, languageId: 1, name: 'Plats principaux', description: 'Plats principaux' },
      { categoryMenuId: 3, languageId: 1, name: 'Desserts', description: 'Desserts sucrés' },
      { categoryMenuId: 4, languageId: 1, name: 'Fromages & pains', description: 'Sélection de fromages et pains' },
      { categoryMenuId: 5, languageId: 1, name: 'Pizzas', description: 'Pizzas variées' },
      { categoryMenuId: 6, languageId: 1, name: 'Boissons', description: 'Toutes les boissons' },
      { categoryMenuId: 7, languageId: 1, name: 'Desserts glacés', description: 'Glaces et desserts glacés' },
      { categoryMenuId: 8, languageId: 1, name: 'Crêpes sucrées', description: 'Crêpes sucrées maison' },
      { categoryMenuId: 9, languageId: 1, name: 'Crêpes salées', description: 'Crêpes salées maison' },
      { categoryMenuId: 10, languageId: 1, name: 'Milkshakes', description: 'Milkshakes variés' },

      // English (id: 2)
      { categoryMenuId: 1, languageId: 2, name: 'Starters', description: 'Hot or cold starters' },
      { categoryMenuId: 2, languageId: 2, name: 'Main Courses', description: 'Main courses' },
      { categoryMenuId: 3, languageId: 2, name: 'Desserts', description: 'Sweet desserts' },
      { categoryMenuId: 4, languageId: 2, name: 'Cheese & Bread', description: 'Selection of cheese and bread' },
      { categoryMenuId: 5, languageId: 2, name: 'Pizzas', description: 'Various pizzas' },
      { categoryMenuId: 6, languageId: 2, name: 'Drinks', description: 'All drinks' },
      { categoryMenuId: 7, languageId: 2, name: 'Ice Cream', description: 'Ice cream and frozen desserts' },
      { categoryMenuId: 8, languageId: 2, name: 'Sweet Crepes', description: 'Homemade sweet crepes' },
      { categoryMenuId: 9, languageId: 2, name: 'Savory Crepes', description: 'Homemade savory crepes' },
      { categoryMenuId: 10, languageId: 2, name: 'Milkshakes', description: 'Variety of milkshakes' },

      // العربية (id: 3)
      { categoryMenuId: 1, languageId: 3, name: 'مقبلات', description: 'مقبلات باردة أو ساخنة' },
      { categoryMenuId: 2, languageId: 3, name: 'الأطباق الرئيسية', description: 'الأطباق الرئيسية' },
      { categoryMenuId: 3, languageId: 3, name: 'حلويات', description: 'حلويات' },
      { categoryMenuId: 4, languageId: 3, name: 'أجبان وخبز', description: 'تشكيلة من الأجبان والخبز' },
      { categoryMenuId: 5, languageId: 3, name: 'بيتزا', description: 'أنواع البيتزا' },
      { categoryMenuId: 6, languageId: 3, name: 'مشروبات', description: 'جميع المشروبات' },
      { categoryMenuId: 7, languageId: 3, name: 'مثلجات', description: 'مثلجات وحلويات باردة' },
      { categoryMenuId: 8, languageId: 3, name: 'كريب حلو', description: 'كريب حلو منزلي' },
      { categoryMenuId: 9, languageId: 3, name: 'كريب مالح', description: 'كريب مالح منزلي' },
      { categoryMenuId: 10, languageId: 3, name: 'ميلك شيك', description: 'ميلك شيك متنوع' },

      // Deutsch (id: 4)
      { categoryMenuId: 1, languageId: 4, name: 'Vorspeisen', description: 'Kalte oder warme Vorspeisen' },
      { categoryMenuId: 2, languageId: 4, name: 'Hauptgerichte', description: 'Hauptgerichte' },
      { categoryMenuId: 3, languageId: 4, name: 'Desserts', description: 'Süße Nachspeisen' },
      { categoryMenuId: 4, languageId: 4, name: 'Käse & Brot', description: 'Auswahl an Käse und Brot' },
      { categoryMenuId: 5, languageId: 4, name: 'Pizzen', description: 'Verschiedene Pizzen' },
      { categoryMenuId: 6, languageId: 4, name: 'Getränke', description: 'Alle Getränke' },
      { categoryMenuId: 7, languageId: 4, name: 'Eis', description: 'Eis und gefrorene Desserts' },
      { categoryMenuId: 8, languageId: 4, name: 'Süße Crêpes', description: 'Hausgemachte süße Crêpes' },
      { categoryMenuId: 9, languageId: 4, name: 'Herzhafte Crêpes', description: 'Hausgemachte herzhafte Crêpes' },
      { categoryMenuId: 10, languageId: 4, name: 'Milchshakes', description: 'Verschiedene Milchshakes' },

      // Español (id: 5)
      { categoryMenuId: 1, languageId: 5, name: 'Entrantes', description: 'Entrantes fríos o calientes' },
      { categoryMenuId: 2, languageId: 5, name: 'Platos principales', description: 'Platos principales' },
      { categoryMenuId: 3, languageId: 5, name: 'Postres', description: 'Postres dulces' },
      { categoryMenuId: 4, languageId: 5, name: 'Quesos y panes', description: 'Selección de quesos y panes' },
      { categoryMenuId: 5, languageId: 5, name: 'Pizzas', description: 'Variedad de pizzas' },
      { categoryMenuId: 6, languageId: 5, name: 'Bebidas', description: 'Todas las bebidas' },
      { categoryMenuId: 7, languageId: 5, name: 'Helados', description: 'Helados y postres fríos' },
      { categoryMenuId: 8, languageId: 5, name: 'Crepes dulces', description: 'Crepes dulces caseras' },
      { categoryMenuId: 9, languageId: 5, name: 'Crepes saladas', description: 'Crepes saladas caseras' },
      { categoryMenuId: 10, languageId: 5, name: 'Batidos', description: 'Variedad de batidos' },

      // Nederlands (id: 6)
      { categoryMenuId: 1, languageId: 6, name: 'Voorgerechten', description: 'Koude of warme voorgerechten' },
      { categoryMenuId: 2, languageId: 6, name: 'Hoofdgerechten', description: 'Hoofdgerechten' },
      { categoryMenuId: 3, languageId: 6, name: 'Desserts', description: 'Zoete desserts' },
      { categoryMenuId: 4, languageId: 6, name: 'Kaas & brood', description: 'Selectie van kaas en brood' },
      { categoryMenuId: 5, languageId: 6, name: 'Pizza\'s', description: 'Verschillende pizza\'s' },
      { categoryMenuId: 6, languageId: 6, name: 'Dranken', description: 'Alle dranken' },
      { categoryMenuId: 7, languageId: 6, name: 'IJs', description: 'IJs en koude desserts' },
      { categoryMenuId: 8, languageId: 6, name: 'Zoete crêpes', description: 'Huisgemaakte zoete crêpes' },
      { categoryMenuId: 9, languageId: 6, name: 'Hartige crêpes', description: 'Huisgemaakte hartige crêpes' },
      { categoryMenuId: 10, languageId: 6, name: 'Milkshakes', description: 'Verschillende milkshakes' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_menu_descriptions', null, {});
  }
};