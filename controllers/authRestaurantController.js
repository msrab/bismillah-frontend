// backend/controllers/authRestaurantController.js

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { Restaurant } = require('../models');

module.exports = {
  /**
   * POST /api/auth/restaurant/signup
   * Crée un nouveau restaurant.
   * @param req.body.name
   * @param req.body.company_number
   * @param req.body.address_number
   * @param req.body.email
   * @param req.body.password
   * @param req.body.phone (optionnel)
   * @param req.body.logo (optionnel)
   */
  async signup(req, res) {
    try {
      const {
        name,
        company_number,
        address_number,
        phone,
        email,
        password,
        logo
      } = req.body;

      // 1) Vérifier unicité company_number
      const existCIF = await Restaurant.findOne({ where: { company_number } });
      if (existCIF) {
        return res.status(409).json({
          error: 'Ce numéro d’entreprise est déjà enregistré.'
        });
      }

      // 2) Vérifier unicité email
      const existEmail = await Restaurant.findOne({ where: { email } });
      if (existEmail) {
        return res.status(409).json({
          error: 'Cet email est déjà utilisé.'
        });
      }

      // 3) Hasher le mot de passe
      const hash = await bcrypt.hash(password, 10);

      // 4) Créer le restaurant en base
      const newRestaurant = await Restaurant.create({
        name,
        company_number,
        address_number,
        phone: phone || null,
        email,
        password: hash,
        logo: logo || null
      });

      return res.status(201).json({
        message: 'Restaurant créé avec succès.',
        restaurant: {
          id: newRestaurant.id,
          name: newRestaurant.name,
          email: newRestaurant.email
          // … on peut renvoyer d’autres champs si besoin
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la création du restaurant.' });
    }
  },

  /**
   * POST /api/auth/restaurant/login
   * Connexion par company_number ou par email (pass + bcrypt.compare).
   * @param req.body.company_number (ou) req.body.email
   * @param req.body.password
   */
  async login(req, res) {
    try {
      const { company_number, email, password } = req.body;

      // On recherche soit par email soit par company_number
      const restaurant = email
        ? await Restaurant.findOne({ where: { email } })
        : await Restaurant.findOne({ where: { company_number } });

      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Générer le JWT
      const token = jwt.sign(
        { id: restaurant.id, type: 'restaurant' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Connexion réussie.',
        token
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  }
};
