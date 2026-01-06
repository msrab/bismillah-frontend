'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Languages Belgique: 1=Français, 2=English, 3=Nederlands, 4=Deutsch
    const descriptions = [
      // La Ruche Halal (Bruxelles) - FR/NL/EN
      { elementMenuId: 1, languageId: 1, name: 'Burger Halal', description: 'Bœuf halal, salade, tomate, sauce maison' },
      { elementMenuId: 1, languageId: 3, name: 'Halal Burger', description: 'Halal rundvlees, sla, tomaat, huissaus' },
      { elementMenuId: 1, languageId: 2, name: 'Halal Burger', description: 'Halal beef, lettuce, tomato, house sauce' },
      { elementMenuId: 2, languageId: 1, name: 'Frites belges', description: 'Pommes de terre fraîches' },
      { elementMenuId: 2, languageId: 3, name: 'Belgische frietjes', description: 'Verse aardappelen' },
      { elementMenuId: 2, languageId: 2, name: 'Belgian Fries', description: 'Fresh potatoes' },
      { elementMenuId: 3, languageId: 1, name: 'Soda', description: 'Coca-Cola, Fanta, Sprite' },
      { elementMenuId: 3, languageId: 3, name: 'Frisdrank', description: 'Coca-Cola, Fanta, Sprite' },
      { elementMenuId: 3, languageId: 2, name: 'Soft Drink', description: 'Coke, Fanta, Sprite' },
      { elementMenuId: 4, languageId: 1, name: 'Glace', description: 'Glace artisanale' },
      { elementMenuId: 4, languageId: 3, name: 'IJs', description: 'Ambachtelijk ijs' },
      { elementMenuId: 4, languageId: 2, name: 'Ice Cream', description: 'Artisanal ice cream' },

      // Antwerp Kebab (Antwerpen) - NL/EN
      { elementMenuId: 5, languageId: 3, name: 'Durum Kebab', description: 'Rundvlees, sla, tomaat, saus' },
      { elementMenuId: 5, languageId: 2, name: 'Durum Kebab', description: 'Beef, lettuce, tomato, sauce' },
      { elementMenuId: 6, languageId: 3, name: 'Frietjes', description: 'Verse Belgische frietjes' },
      { elementMenuId: 6, languageId: 2, name: 'Fries', description: 'Fresh Belgian fries' },
      { elementMenuId: 7, languageId: 3, name: 'Frisdrank', description: 'Diverse dranken' },
      { elementMenuId: 7, languageId: 2, name: 'Soft Drink', description: 'Various drinks' },

      // Gent Grillades (Gent) - NL/EN/FR
      { elementMenuId: 8, languageId: 3, name: 'Gegrilde Steak', description: 'Rundersteak met groenten' },
      { elementMenuId: 8, languageId: 2, name: 'Grilled Steak', description: 'Beef steak with vegetables' },
      { elementMenuId: 8, languageId: 1, name: 'Steak grillé', description: 'Steak de bœuf avec légumes' },
      { elementMenuId: 9, languageId: 3, name: 'Gemengde Salade', description: 'Verse seizoensgroenten' },
      { elementMenuId: 9, languageId: 2, name: 'Mixed Salad', description: 'Fresh seasonal vegetables' },
      { elementMenuId: 9, languageId: 1, name: 'Salade composée', description: 'Légumes frais de saison' },
      { elementMenuId: 10, languageId: 3, name: 'Frisdrank', description: 'Diverse koude dranken' },
      { elementMenuId: 10, languageId: 2, name: 'Soft Drink', description: 'Various cold drinks' },
      { elementMenuId: 10, languageId: 1, name: 'Boisson fraîche', description: 'Diverses boissons froides' },

      // Liège Délices (Liège) - FR/EN
      { elementMenuId: 11, languageId: 1, name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic' },
      { elementMenuId: 11, languageId: 2, name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil' },
      { elementMenuId: 12, languageId: 1, name: 'Pizza Quatre Fromages', description: '4 fromages italiens' },
      { elementMenuId: 12, languageId: 2, name: 'Four Cheese Pizza', description: '4 Italian cheeses' },
      { elementMenuId: 13, languageId: 1, name: 'Boisson gazeuse', description: 'Coca-Cola, Fanta, Sprite' },
      { elementMenuId: 13, languageId: 2, name: 'Soft Drink', description: 'Coke, Fanta, Sprite' },
      { elementMenuId: 14, languageId: 1, name: 'Glace italienne', description: 'Glace artisanale' },
      { elementMenuId: 14, languageId: 2, name: 'Italian Ice Cream', description: 'Artisanal ice cream' },

      // Charleroi Saveurs (Charleroi) - FR/EN
      { elementMenuId: 15, languageId: 1, name: 'Nouilles sautées', description: 'Nouilles, légumes, sauce soja' },
      { elementMenuId: 15, languageId: 2, name: 'Stir-fried Noodles', description: 'Noodles, vegetables, soy sauce' },
      { elementMenuId: 16, languageId: 1, name: 'Dim Sum', description: 'Assortiment de dim sum vapeur' },
      { elementMenuId: 16, languageId: 2, name: 'Dim Sum', description: 'Assorted steamed dim sum' },
      { elementMenuId: 17, languageId: 1, name: 'Riz cantonais', description: 'Riz sauté aux légumes' },
      { elementMenuId: 17, languageId: 2, name: 'Cantonese Rice', description: 'Fried rice with vegetables' },
      { elementMenuId: 18, languageId: 1, name: 'Thé vert', description: 'Thé vert chinois' },
      { elementMenuId: 18, languageId: 2, name: 'Green Tea', description: 'Chinese green tea' }
    ];

    await queryInterface.bulkInsert('element_menu_descriptions', descriptions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('element_menu_descriptions', null, {});
  }
};
