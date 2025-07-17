'use strict';

module.exports = {
  async up (queryInterface) {
    // 2 cities par pays, donc 12 cities, donc 36 rues
    await queryInterface.bulkInsert('streets', [
      // France (cityId: 1, 2)
      { name: 'Rue de Rivoli', cityId: 1 },
      { name: 'Avenue des Champs-Élysées', cityId: 1 },
      { name: 'Boulevard Saint-Germain', cityId: 1 },
      { name: 'Rue de la République', cityId: 2 },
      { name: 'Rue Victor Hugo', cityId: 2 },
      { name: 'Place Bellecour', cityId: 2 },

      // Belgique (cityId: 3, 4)
      { name: 'Avenue Louise', cityId: 3 },
      { name: 'Rue Neuve', cityId: 3 },
      { name: 'Boulevard Anspach', cityId: 3 },
      { name: 'Meir', cityId: 4 },
      { name: 'Kipdorpbrug', cityId: 4 },
      { name: 'Lange Nieuwstraat', cityId: 4 },

      // Allemagne (cityId: 5, 6)
      { name: 'Unter den Linden', cityId: 5 },
      { name: 'Kurfürstendamm', cityId: 5 },
      { name: 'Friedrichstraße', cityId: 5 },
      { name: 'Leopoldstraße', cityId: 6 },
      { name: 'Maximilianstraße', cityId: 6 },
      { name: 'Sendlinger Straße', cityId: 6 },

      // Espagne (cityId: 7, 8)
      { name: 'Gran Vía', cityId: 7 },
      { name: 'Calle de Alcalá', cityId: 7 },
      { name: 'Paseo del Prado', cityId: 7 },
      { name: 'La Rambla', cityId: 8 },
      { name: 'Passeig de Gràcia', cityId: 8 },
      { name: 'Carrer de Balmes', cityId: 8 },

      // Italie (cityId: 9, 10)
      { name: 'Via del Corso', cityId: 9 },
      { name: 'Via Nazionale', cityId: 9 },
      { name: 'Via Appia Nuova', cityId: 9 },
      { name: 'Corso Buenos Aires', cityId: 10 },
      { name: 'Via Monte Napoleone', cityId: 10 },
      { name: 'Via Torino', cityId: 10 },

      // Suisse (cityId: 11, 12)
      { name: 'Rue du Rhône', cityId: 11 },
      { name: 'Boulevard Georges-Favon', cityId: 11 },
      { name: 'Rue de la Confédération', cityId: 11 },
      { name: 'Bahnhofstrasse', cityId: 12 },
      { name: 'Augustinergasse', cityId: 12 },
      { name: 'Limmatquai', cityId: 12 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('streets', null, {});
  }
};