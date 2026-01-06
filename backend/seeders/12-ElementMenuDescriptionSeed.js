'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const descriptions = [
      // Le Gourmet Parisien (id:1) - Gastronomique - FR
      { elementMenuId: 1, languageId: 1, name: 'Foie gras maison', description: 'Foie gras de canard, chutney de figues' },
      { elementMenuId: 2, languageId: 1, name: 'Tartare de saumon', description: 'Saumon frais, citron vert, aneth' },
      { elementMenuId: 3, languageId: 1, name: 'Filet de bœuf Rossini', description: 'Filet de bœuf, foie gras poêlé, sauce truffe' },
      { elementMenuId: 4, languageId: 1, name: 'Bar rôti, émulsion citronnée', description: 'Bar entier, légumes de saison' },
      { elementMenuId: 5, languageId: 1, name: 'Moelleux au chocolat', description: 'Cœur coulant, glace vanille' },
      { elementMenuId: 6, languageId: 1, name: 'Tarte fine aux pommes', description: 'Pommes caramélisées, pâte feuilletée' },
      { elementMenuId: 7, languageId: 1, name: 'Assiette de fromages affinés', description: 'Sélection de fromages français, pain artisanal' },
      { elementMenuId: 8, languageId: 1, name: 'Eau minérale', description: 'Plate ou gazeuse' },
      { elementMenuId: 9, languageId: 1, name: 'Jus de fruits frais', description: 'Orange, pomme, ananas' },

      // Crêperie de Montmartre (id:2) - Crêperie - FR/EN
      { elementMenuId: 10, languageId: 1, name: 'Crêpe Suzette', description: 'Crêpe flambée à l’orange' },
      { elementMenuId: 10, languageId: 2, name: 'Crêpe Suzette', description: 'Crepe flambéed with orange' },
      { elementMenuId: 11, languageId: 1, name: 'Galette complète', description: 'Jambon, œuf, fromage' },
      { elementMenuId: 11, languageId: 2, name: 'Complete Galette', description: 'Ham, egg, cheese' },
      { elementMenuId: 12, languageId: 1, name: 'Milkshake vanille', description: 'Lait, glace vanille' },
      { elementMenuId: 12, languageId: 2, name: 'Vanilla Milkshake', description: 'Milk, vanilla ice cream' },
      { elementMenuId: 13, languageId: 1, name: 'Café', description: 'Café expresso' },
      { elementMenuId: 13, languageId: 2, name: 'Coffee', description: 'Espresso coffee' },
      { elementMenuId: 14, languageId: 1, name: 'Limonade artisanale', description: 'Citron, eau pétillante' },
      { elementMenuId: 14, languageId: 2, name: 'Homemade Lemonade', description: 'Lemon, sparkling water' },

      // Pizzeria Bella Italia (id:3) - Pizzeria - FR/NL/EN
      { elementMenuId: 15, languageId: 1, name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic' },
      { elementMenuId: 15, languageId: 2, name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil' },
      { elementMenuId: 15, languageId: 6, name: 'Margherita Pizza', description: 'Tomaat, mozzarella, basilicum' },
      { elementMenuId: 16, languageId: 1, name: 'Pizza Quatre Fromages', description: '4 fromages italiens' },
      { elementMenuId: 16, languageId: 2, name: 'Four Cheese Pizza', description: '4 Italian cheeses' },
      { elementMenuId: 16, languageId: 6, name: 'Vier Kazen Pizza', description: '4 Italiaanse kazen' },
      { elementMenuId: 17, languageId: 1, name: 'Boisson gazeuse', description: 'Coca-Cola, Fanta, Sprite' },
      { elementMenuId: 17, languageId: 2, name: 'Soft Drink', description: 'Coke, Fanta, Sprite' },
      { elementMenuId: 17, languageId: 6, name: 'Frisdrank', description: 'Coca-Cola, Fanta, Sprite' },
      { elementMenuId: 18, languageId: 1, name: 'Glace italienne', description: 'Glace artisanale' },
      { elementMenuId: 18, languageId: 2, name: 'Italian Ice Cream', description: 'Artisanal ice cream' },
      { elementMenuId: 18, languageId: 6, name: 'Italiaans ijs', description: 'Ambachtelijk ijs' },

      // Burger House Bruxelles (id:4) - Fast Food - FR/EN
      { elementMenuId: 19, languageId: 1, name: 'Burger classique', description: 'Bœuf, salade, tomate, sauce maison' },
      { elementMenuId: 19, languageId: 2, name: 'Classic Burger', description: 'Beef, lettuce, tomato, house sauce' },
      { elementMenuId: 20, languageId: 1, name: 'Frites maison', description: 'Pommes de terre belges' },
      { elementMenuId: 20, languageId: 2, name: 'Homemade Fries', description: 'Belgian potatoes' },
      { elementMenuId: 21, languageId: 1, name: 'Soda', description: 'Coca-Cola, Fanta, Sprite' },
      { elementMenuId: 21, languageId: 2, name: 'Soda', description: 'Coke, Fanta, Sprite' },
      { elementMenuId: 22, languageId: 1, name: 'Glace vanille', description: 'Glace artisanale' },
      { elementMenuId: 22, languageId: 2, name: 'Vanilla Ice Cream', description: 'Artisanal ice cream' },

      // Sushi Royal Bruxelles (id:5) - Sushi Bar - FR/EN/NL
      { elementMenuId: 23, languageId: 1, name: 'Assortiment de sushis', description: 'Sushis variés, sauce soja' },
      { elementMenuId: 23, languageId: 2, name: 'Sushi Assortment', description: 'Various sushi, soy sauce' },
      { elementMenuId: 23, languageId: 6, name: 'Sushi assortiment', description: 'Verschillende sushi, sojasaus' },
      { elementMenuId: 24, languageId: 1, name: 'Bento poulet teriyaki', description: 'Poulet, riz, légumes' },
      { elementMenuId: 24, languageId: 2, name: 'Chicken Teriyaki Bento', description: 'Chicken, rice, vegetables' },
      { elementMenuId: 24, languageId: 6, name: 'Kip Teriyaki Bento', description: 'Kip, rijst, groenten' },
      { elementMenuId: 25, languageId: 1, name: 'Thé vert japonais', description: 'Thé vert, servi chaud' },
      { elementMenuId: 25, languageId: 2, name: 'Japanese Green Tea', description: 'Green tea, served hot' },
      { elementMenuId: 25, languageId: 6, name: 'Japanse groene thee', description: 'Groene thee, warm geserveerd' }
    ];

    await queryInterface.bulkInsert('element_menu_descriptions', descriptions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('element_menu_descriptions', null, {});
  }
};