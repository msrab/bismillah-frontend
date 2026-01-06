'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 5 restaurants belges avec éléments de menu
    // Restaurants: 1=La Ruche Halal (Bruxelles), 2=Antwerp Kebab, 3=Gent Grillades, 4=Liège Délices, 5=Charleroi Saveurs
    const elements = [
      // La Ruche Halal (id:1) - Bruxelles - Fast Food Halal
      { id: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', price: 8.50, categoryMenuId: 12, restaurantId: 1 },
      { id: 2, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783', price: 3.50, categoryMenuId: 13, restaurantId: 1 },
      { id: 3, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846', price: 2.50, categoryMenuId: 14, restaurantId: 1 },
      { id: 4, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f', price: 3.00, categoryMenuId: 15, restaurantId: 1 },

      // Antwerp Kebab (id:2) - Antwerpen - Kebab
      { id: 5, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0', price: 7.50, categoryMenuId: 12, restaurantId: 2 },
      { id: 6, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783', price: 3.00, categoryMenuId: 13, restaurantId: 2 },
      { id: 7, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846', price: 2.00, categoryMenuId: 14, restaurantId: 2 },

      // Gent Grillades (id:3) - Gent - Grill
      { id: 8, image: 'https://images.unsplash.com/photo-1544025162-d76694265947', price: 18.00, categoryMenuId: 26, restaurantId: 3 },
      { id: 9, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', price: 8.50, categoryMenuId: 27, restaurantId: 3 },
      { id: 10, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846', price: 3.00, categoryMenuId: 28, restaurantId: 3 },

      // Liège Délices (id:4) - Liège - Pizzeria
      { id: 11, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', price: 11.00, categoryMenuId: 5, restaurantId: 4 },
      { id: 12, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', price: 13.50, categoryMenuId: 5, restaurantId: 4 },
      { id: 13, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846', price: 2.50, categoryMenuId: 6, restaurantId: 4 },
      { id: 14, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f', price: 4.00, categoryMenuId: 7, restaurantId: 4 },

      // Charleroi Saveurs (id:5) - Charleroi - Asiatique
      { id: 15, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', price: 12.00, categoryMenuId: 22, restaurantId: 5 },
      { id: 16, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d', price: 8.00, categoryMenuId: 23, restaurantId: 5 },
      { id: 17, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99', price: 10.00, categoryMenuId: 24, restaurantId: 5 },
      { id: 18, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', price: 3.50, categoryMenuId: 25, restaurantId: 5 }
    ];

    await queryInterface.bulkInsert('element_menus', elements, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('element_menus', null, {});
  }
};
