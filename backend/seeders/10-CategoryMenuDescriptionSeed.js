'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Languages Belgique: 1=Français, 2=English, 3=Nederlands, 4=Deutsch
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

      // Nederlands (id: 3)
      { categoryMenuId: 1, languageId: 3, name: 'Voorgerechten', description: 'Koude of warme voorgerechten' },
      { categoryMenuId: 2, languageId: 3, name: 'Hoofdgerechten', description: 'Hoofdgerechten' },
      { categoryMenuId: 3, languageId: 3, name: 'Desserts', description: 'Zoete desserts' },
      { categoryMenuId: 4, languageId: 3, name: 'Kaas & brood', description: 'Selectie van kaas en brood' },
      { categoryMenuId: 5, languageId: 3, name: 'Pizza\'s', description: 'Verschillende pizza\'s' },
      { categoryMenuId: 6, languageId: 3, name: 'Dranken', description: 'Alle dranken' },
      { categoryMenuId: 7, languageId: 3, name: 'IJs', description: 'IJs en koude desserts' },
      { categoryMenuId: 8, languageId: 3, name: 'Zoete crêpes', description: 'Huisgemaakte zoete crêpes' },
      { categoryMenuId: 9, languageId: 3, name: 'Hartige crêpes', description: 'Huisgemaakte hartige crêpes' },
      { categoryMenuId: 10, languageId: 3, name: 'Milkshakes', description: 'Verschillende milkshakes' },

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
      { categoryMenuId: 10, languageId: 4, name: 'Milchshakes', description: 'Verschiedene Milchshakes' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_menu_descriptions', null, {});
  }
};
