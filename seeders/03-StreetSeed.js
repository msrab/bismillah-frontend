'use strict';

module.exports = {
  async up (queryInterface) {
    // Rues pour les villes belges
    await queryInterface.bulkInsert('streets', [
      // Bruxelles (cityId: 1)
      { id: 1, name: 'Avenue Louise', cityId: 1 },
      { id: 2, name: 'Rue Neuve', cityId: 1 },
      { id: 3, name: 'Boulevard Anspach', cityId: 1 },
      { id: 4, name: 'Grand-Place', cityId: 1 },
      { id: 5, name: 'Rue de la Loi', cityId: 1 },

      // Anvers (cityId: 2)
      { id: 6, name: 'Meir', cityId: 2 },
      { id: 7, name: 'Kipdorpbrug', cityId: 2 },
      { id: 8, name: 'Lange Nieuwstraat', cityId: 2 },
      { id: 9, name: 'Groenplaats', cityId: 2 },

      // Gand (cityId: 3)
      { id: 10, name: 'Veldstraat', cityId: 3 },
      { id: 11, name: 'Korenmarkt', cityId: 3 },
      { id: 12, name: 'Sint-Baafsplein', cityId: 3 },

      // Charleroi (cityId: 4)
      { id: 13, name: 'Boulevard Tirou', cityId: 4 },
      { id: 14, name: 'Rue de la Montagne', cityId: 4 },
      { id: 15, name: 'Place Charles II', cityId: 4 },

      // Liège (cityId: 5)
      { id: 16, name: 'Rue Vinâve d\'Île', cityId: 5 },
      { id: 17, name: 'Place Saint-Lambert', cityId: 5 },
      { id: 18, name: 'Boulevard de la Sauvenière', cityId: 5 },

      // Bruges (cityId: 6)
      { id: 19, name: 'Markt', cityId: 6 },
      { id: 20, name: 'Steenstraat', cityId: 6 },
      { id: 21, name: 'Breidelstraat', cityId: 6 },

      // Namur (cityId: 7)
      { id: 22, name: 'Rue de l\'Ange', cityId: 7 },
      { id: 23, name: 'Place d\'Armes', cityId: 7 },

      // Louvain (cityId: 8)
      { id: 24, name: 'Oude Markt', cityId: 8 },
      { id: 25, name: 'Naamsestraat', cityId: 8 },

      // Mons (cityId: 9)
      { id: 26, name: 'Grand-Place', cityId: 9 },
      { id: 27, name: 'Rue de la Chaussée', cityId: 9 },

      // Schaerbeek (cityId: 10)
      { id: 28, name: 'Chaussée de Haecht', cityId: 10 },
      { id: 29, name: 'Avenue Louis Bertrand', cityId: 10 },

      // Anderlecht (cityId: 11)
      { id: 30, name: 'Rue Wayez', cityId: 11 },
      { id: 31, name: 'Place de la Vaillance', cityId: 11 },

      // Molenbeek-Saint-Jean (cityId: 12)
      { id: 32, name: 'Chaussée de Gand', cityId: 12 },
      { id: 33, name: 'Rue du Comte de Flandre', cityId: 12 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('streets', null, {});
  }
};
