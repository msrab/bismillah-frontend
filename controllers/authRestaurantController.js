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
   * 
   * @return {201}    {message, restaurant}
   * @return {401}    si error
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

      const existCIF = await Restaurant.findOne({ where: { company_number } });
      if (existCIF) {
        return res.status(409).json({
          error: 'Ce numéro d’entreprise est déjà enregistré.'
        });
      }

      const existEmail = await Restaurant.findOne({ where: { email } });
      if (existEmail) {
        return res.status(409).json({
          error: 'Cet email est déjà utilisé.'
        });
      }

      const hash = await bcrypt.hash(password, 10);

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
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la création du restaurant.' });
    }
  },

  /**
   * POST /api/auth/restaurant/login
   * Connexion par email + mot de passe.
   * @param  {string} req.body.email
   * @param  {string} req.body.password
   * @return {200}    { message: 'Connexion réussie.', token }
   * @return {400}    si email ou password manquant
   * @return {404}    si pas de restaurant trouvé pour cet email
   * @return {401}    si mot de passe incorrect
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // On vérifie que l'email et le password sont présents
      if (!email) {
        return res.status(400).json({ error: 'L’email est requis.' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Le mot de passe est requis.' });
      }

      // Recherche du restaurant uniquement par email
      const restaurant = await Restaurant.findOne({ where: { email } });
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      // Vérification du mot de passe
      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Génération du JWT
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
