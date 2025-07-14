'use strict';

const { Restaurant } = require('../models');
const createError = require('../utils/createError');

module.exports = {
  /**
   * GET /api/restaurants/profil
   */
  async getProfile(req, res, next) {
    try {

      const rest = await Restaurant.findByPk(req.userId, {
        attributes: [
          'id','login','name','company_number','address_number','phone','email','logo','nb_followers','createdAt','updatedAt'
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

      return res.status(200).json({
        message: 'Profil restaurateur mis à jour avec succès.',
        restaurant: {
          id:             rest.id,
          name:           rest.name,
          company_number: rest.company_number,
          address_number: rest.address_number,
          phone:          rest.phone,
          email:          rest.email,
          logo:           rest.logo,
          nb_followers:   rest.nb_followers,
          createdAt:      rest.createdAt,
          updatedAt:      rest.updatedAt
        }
      });
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
      await rest.save();
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
      await rest.save();
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
