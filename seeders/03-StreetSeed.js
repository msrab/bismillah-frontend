'use strict';

module.exports = {
  async up (queryInterface) {
    // 2 cities par pays, donc 12 cities, donc 36 rues
    await queryInterface.bulkInsert('streets', [
      // France (cityId: 1, 2)
      { id: 1, name: 'Rue de Rivoli', cityId: 1 },
      { id: 2, name: 'Avenue des Champs-Élysées', cityId: 1 },
      { id: 3, name: 'Boulevard Saint-Germain', cityId: 1 },
      { id: 4, name: 'Rue de la République', cityId: 2 },
      { id: 5, name: 'Rue Victor Hugo', cityId: 2 },
      { id: 6, name: 'Place Bellecour', cityId: 2 },

      // Belgique (cityId: 3, 4)
      { id: 7, name: 'Avenue Louise', cityId: 3 },
      { id: 8, name: 'Rue Neuve', cityId: 3 },
      { id: 9, name: 'Boulevard Anspach', cityId: 3 },
      { id: 10, name: 'Meir', cityId: 4 },
      { id: 11, name: 'Kipdorpbrug', cityId: 4 },
      { id: 12, name: 'Lange Nieuwstraat', cityId: 4 },

      // Allemagne (cityId: 5, 6)
      { id: 13, name: 'Unter den Linden', cityId: 5 },
      { id: 14, name: 'Kurfürstendamm', cityId: 5 },
      { id: 15, name: 'Friedrichstraße', cityId: 5 },
      { id: 16, name: 'Leopoldstraße', cityId: 6 },
      { id: 17, name: 'Maximilianstraße', cityId: 6 },
      { id: 18, name: 'Sendlinger Straße', cityId: 6 },

      // Espagne (cityId: 7, 8)
      { id: 19, name: 'Gran Vía', cityId: 7 },
      { id: 20, name: 'Calle de Alcalá', cityId: 7 },
      { id: 21, name: 'Paseo del Prado', cityId: 7 },
      { id: 22, name: 'La Rambla', cityId: 8 },
      { id: 23, name: 'Passeig de Gràcia', cityId: 8 },
      { id: 24, name: 'Carrer de Balmes', cityId: 8 },

      // Italie (cityId: 9, 10)
      { id: 25, name: 'Via del Corso', cityId: 9 },
      { id: 26, name: 'Via Nazionale', cityId: 9 },
      { id: 27, name: 'Via Appia Nuova', cityId: 9 },
      { id: 28, name: 'Corso Buenos Aires', cityId: 10 },
      { id: 29, name: 'Via Monte Napoleone', cityId: 10 },
      { id: 30, name: 'Via Torino', cityId: 10 },

      // Suisse (cityId: 11, 12)
      { id: 31, name: 'Rue du Rhône', cityId: 11 },
      { id: 32, name: 'Boulevard Georges-Favon', cityId: 11 },
      { id: 33, name: 'Rue de la Confédération', cityId: 11 },
      { id: 34, name: 'Bahnhofstrasse', cityId: 12 },
      { id: 35, name: 'Augustinergasse', cityId: 12 },
      { id: 36, name: 'Limmatquai', cityId: 12 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('streets', null, {});
  }
};