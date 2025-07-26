'use strict';

const { Restaurant, Language, RestaurantLanguage } = require('../models');
const { createError } = require('../utils/createError');

module.exports = {
  /**
   * GET /api/restaurants/profil
   */
  async getProfile(req, res, next) {
    try {
      const rest = await Restaurant.findByPk(req.userId, {
        attributes: [
          'id','name','company_number','address_number','phone','email','logo','nb_followers','createdAt','updatedAt'
        ],
        include: [
          {
            model: Language,
            as: 'languages',
            through: { attributes: ['main'] }
          }
        ]
      });
      if (!rest) {
        return next(createError('Restaurant non trouvé.', 404));
      }
      return res.status(200).json({ restaurant: rest });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/restaurants/profil
   */
  async updateProfile(req, res, next) {
    try {
      const rest = await Restaurant.findByPk(req.userId);
      if (!rest) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      const {
        name,
        company_number,
        address_number,
        phone,
        email,
        logo
      } = req.body;

      // Vérifier unicité du company_number
      if (company_number && company_number !== rest.company_number) {
        const existsCompany = await Restaurant.findOne({ where: { company_number } });
        if (existsCompany) {
          return next(createError('Ce numéro d’entreprise est déjà utilisé.', 409));
        }
        rest.company_number = company_number;
      }

      // Vérifier unicité de l’email
      if (email && email !== rest.email) {
        const existsEmail = await Restaurant.findOne({ where: { email } });
        if (existsEmail) {
          return next(createError('Cet email est déjà utilisé.', 409));
        }
        rest.email = email;
      }

      // Mise à jour des autres champs
      if (name           !== undefined) rest.name           = name;
      if (address_number !== undefined) rest.address_number = address_number;
      if (phone          !== undefined) rest.phone          = phone;
      if (logo           !== undefined) rest.logo           = logo;

      await rest.save();

      // On retourne aussi les langues associées
      const updated = await Restaurant.findByPk(rest.id, {
        attributes: [
          'id','name','company_number','address_number','phone','email','logo','nb_followers','createdAt','updatedAt'
        ],
        include: [
          {
            model: Language,
            as: 'languages',
            through: { attributes: ['main'] }
          }
        ]
      });

      return res.status(200).json({
        message: 'Profil restaurateur mis à jour avec succès.',
        restaurant: updated
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/restaurants/:id/languages
   * Ajoute une ou plusieurs langues à un restaurant
   * body: { languageIds: [1,2], mainId: 1 }
   */
  async addLanguages(req, res, next) {
    try {
      const restaurantId = parseInt(req.params.id, 10);
      const { languageIds, mainId } = req.body;

      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      if (!Array.isArray(languageIds) || languageIds.length === 0) {
        return next(createError('Aucune langue à ajouter.', 400));
      }

      await restaurant.setLanguages(languageIds);

      // Met à jour la langue principale
      if (mainId && languageIds.includes(mainId)) {
        await RestaurantLanguage.update(
          { main: false },
          { where: { restaurantId } }
        );
        await RestaurantLanguage.update(
          { main: true },
          { where: { restaurantId, languageId: mainId } }
        );
      }

      const updated = await Restaurant.findByPk(restaurantId, {
        include: [
          { model: Language, as: 'languages', through: { attributes: ['main'] } }
        ]
      });

      return res.status(200).json({
        message: 'Langues mises à jour.',
        restaurant: updated
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/restaurants/:id/languages/:languageId
   * Supprime une langue d'un restaurant
   */
  async removeLanguage(req, res, next) {
    try {
      const restaurantId = parseInt(req.params.id, 10);
      const languageId = parseInt(req.params.languageId, 10);

      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      await RestaurantLanguage.destroy({
        where: { restaurantId, languageId }
      });

      return res.status(200).json({ message: 'Langue supprimée du restaurant.' });
    } catch (error) {
      next(error);
    }
  },

    /**
   * PATCH /api/restaurants/:id/languages/main
   * Modifie la langue principale d'un restaurant
   * body: { mainId: 2 }
   */
  async setMainLanguage(req, res, next) {
    try {
      const restaurantId = parseInt(req.params.id, 10);
      const { mainId } = req.body;

      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      // Vérifie que la langue existe pour ce restaurant
      const exists = await RestaurantLanguage.findOne({
        where: { restaurantId, languageId: mainId }
      });
      if (!exists) {
        return next(createError('Cette langue n\'est pas associée au restaurant.', 400));
      }

      // Met toutes les langues à main: false
      await RestaurantLanguage.update(
        { main: false },
        { where: { restaurantId } }
      );
      // Met la nouvelle langue principale à main: true
      await RestaurantLanguage.update(
        { main: true },
        { where: { restaurantId, languageId: mainId } }
      );

      return res.status(200).json({ message: 'Langue principale modifiée.' });
    } catch (error) {
      next(error);
    }
  },
  
    /**
     * PATCH /api/restaurants/profil/type
     * Permet au restaurant connecté de choisir son type de restaurant
     * body: { restaurantTypeId }
     */
    async setType(req, res, next) {
      try {
        const { restaurantTypeId } = req.body;
        const restaurant = await Restaurant.findByPk(req.userId);
  
        if (!restaurant) {
          return next(createError('Restaurant non trouvé.', 404));
        }
  
        // Vérifie que le type existe et est validé
        const { RestaurantType } = require('../models');
        const type = await RestaurantType.findOne({ where: { id: restaurantTypeId, isValidated: true } });
        if (!type) {
          return next(createError('Type de restaurant invalide ou non validé.', 400));
        }
  
        restaurant.restaurantTypeId = restaurantTypeId;
        await restaurant.save();
  
        return res.status(200).json({ message: 'Type de restaurant mis à jour.' });
      } catch (error) {
        next(error);
      }
    },

  /**
   * DELETE /api/restaurants/profil
   */
  async deleteProfile(req, res, next) {
    try {

      const rest = await Restaurant.findByPk(req.userId);
      if (!rest) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      await rest.destroy();
      return res.status(200).json({ message: 'Compte restaurant supprimé.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/restaurants/disable
   * Désactive le restaurant connecté
   */
  async disable(req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.userId);

      if (!restaurant) {
        return next(createError('Restaurant non trouvé.', 404));
      }
      restaurant.is_active = false; 
      await restaurant.save();
      return res.status(200).json({ message: 'Restaurant désactivé.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/restaurants/enable
   * Réactive le restaurant connecté
   */
  async enable(req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.userId);
      if (!restaurant) {
        return next(createError('Restaurant non trouvé.', 404));
      }
      restaurant.is_active = true; 
      await restaurant.save();
      return res.status(200).json({ message: 'Restaurant réactivé.' });
    } catch (error) {
      next(error);
    }
  },


  /**
   * GET /api/restaurants
   * Liste paginée de restaurants
   */
  async listRestaurants(req, res, next) {
    try {
      const page  = Math.max(1, parseInt(req.query.page)  || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const offset = (page - 1) * limit;

      const total = await Restaurant.count({ where: { is_active: true }});
      const restaurants = await Restaurant.findAll({
        offset,
        limit,
        where: { is_active: true },
        attributes: [
          'id','name','company_number','address_number','phone','email','logo','nb_followers'
        ]
      });

      return res.status(200).json({
        total,
        page,
        pageSize: restaurants.length,
        restaurants
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/restaurants/:id
   * Récupère un restaurant par son ID
   */
  async getRestaurantById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id < 1) {
        return next(createError('ID invalide.', 400));
      }

      const rest = await Restaurant.findOne({
        where: { id, is_active: true },
        attributes: [
          'id','name','company_number','address_number','phone','email','logo','nb_followers'
        ]
      });
      
      if (!rest) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      return res.status(200).json({ restaurant: rest });
    } catch (error) {
      next(error);
    }
  }
  
};
