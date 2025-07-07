'use strict';

const { Restaurant } = require('../models');

module.exports = {
  /**
   * GET /api/restaurants/profil
   */
  async getProfile(req, res) {
    try {
      if (req.userType !== 'restaurant') {
        return res.status(403).json({ error: 'Accès interdit : pas un restaurant.' });
      }

      const rest = await Restaurant.findByPk(req.userId, {
        attributes: [
          'id','login','name','company_number','address_number','phone','email','logo','nb_followers','createdAt','updatedAt'
        ]
      });
      if (!rest) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }
      return res.status(200).json({ restaurant: rest });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
  },

  /**
   * PUT /api/restaurants/profil
   */
  async updateProfile(req, res) {
    try {
      if (req.userType !== 'restaurant') {
        return res.status(403).json({ error: 'Accès interdit : pas un restaurant.' });
      }

      const rest = await Restaurant.findByPk(req.userId);
      if (!rest) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      const {
        login,
        name,
        company_number,
        address_number,
        phone,
        email,
        logo
      } = req.body;

      // Vérifier unicité du login
      if (login && login !== rest.login) {
        const exists = await Restaurant.findOne({ where: { login } });
        if (exists) {
          return res.status(409).json({ error: 'Ce login est déjà pris.' });
        }
        rest.login = login;
      }

      // Vérifier unicité du company_number
      if (company_number && company_number !== rest.company_number) {
        const existsCompany = await Restaurant.findOne({ where: { company_number } });
        if (existsCompany) {
          return res.status(409).json({ error: 'Ce numéro d’entreprise est déjà utilisé.' });
        }
        rest.company_number = company_number;
      }

      // Vérifier unicité de l’email
      if (email && email !== rest.email) {
        const existsEmail = await Restaurant.findOne({ where: { email } });
        if (existsEmail) {
          return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
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
          login:          rest.login,
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
    }
  },

  /**
   * DELETE /api/restaurants/profil
   */
  async deleteProfile(req, res) {
    try {
      if (req.userType !== 'restaurant') {
        return res.status(403).json({ error: 'Accès interdit : pas un restaurant.' });
      }

      const rest = await Restaurant.findByPk(req.userId);
      if (!rest) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      await rest.destroy();
      return res.status(200).json({ message: 'Compte restaurant supprimé.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la suppression du compte.' });
    }
  },

  /**
   * GET /api/restaurants
   * Liste paginée de restaurants sans mot de passe
   */
  async listRestaurants(req, res) {
    try {
      const page  = Math.max(1, parseInt(req.query.page)  || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const offset = (page - 1) * limit;

      const total = await Restaurant.count();
      const restaurants = await Restaurant.findAll({
        offset,
        limit,
        attributes: [
          'id','name','company_number','address_number','phone','email','logo','nb_followers','createdAt','updatedAt'
        ]
      });

      return res.status(200).json({
        total,
        page,
        pageSize: restaurants.length,
        restaurants
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des restaurants.' });
    }
  },

  /**
   * GET /api/restaurants/:id
   * Récupère un restaurant par son ID
   */
  async getRestaurantById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: 'ID invalide.' });
      }

      const rest = await Restaurant.findByPk(id, {
        attributes: [
          'id','name','company_number','address_number','phone','email','logo','nb_followers','createdAt','updatedAt'
        ]
      });
      if (!rest) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      return res.status(200).json({ restaurant: rest });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la récupération du restaurant.' });
    }
  }
  
};
