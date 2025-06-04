// controllers/authRestaurantController.js

/**
 * Contrôleur d’authentification pour les Restaurants
 */

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { Restaurant } = require('../models'); // Charge le modèle Restaurant

module.exports = {
  /**
   * Inscription d'un nouveau restaurant.
   * Paramètres d'entrée (req.body) :
   *   - name           : string  (obligatoire)
   *   - company_number : string  (obligatoire, unique)
   *   - address_number : string  (obligatoire)
   *   - phone          : string  (optionnel)
   *   - email          : string  (obligatoire, unique, format email)
   *   - password       : string  (obligatoire)
   *   - logo           : string  (optionnel, URL ou chemin)
   *   - nb_followers   : integer (optionnel, défaut : 0)
   *
   * Réponses :
   *   • 201 + { message: 'Restaurant créé avec succès.', restaurant: { id, name, email, company_number } }
   *   • 409 si company_number déjà utilisé
   *   • 409 si email déjà utilisé
   *   • 400 si un champ obligatoire est manquant ou invalide
   *   • 500 en cas d’erreur serveur
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
        logo,
        nb_followers
      } = req.body;

      // Vérifier que tous les champs obligatoires sont fournis
      if (!name || !company_number || !address_number || !email || !password) {
        return res
          .status(400)
          .json({
            error: 'Champs requis manquants : name, company_number, address_number, email ou password.'
          });
      }

      // Vérifier unicité de company_number
      const existCompany = await Restaurant.findOne({
        where: { company_number }
      });
      if (existCompany) {
        return res
          .status(409)
          .json({ error: 'Ce numéro d’entreprise est déjà enregistré.' });
      }

      // Vérifier unicité de l’email
      const existEmail = await Restaurant.findOne({
        where: { email }
      });
      if (existEmail) {
        return res
          .status(409)
          .json({ error: 'Cet email est déjà utilisé.' });
      }

      // Hasher le mot de passe
      const hash = await bcrypt.hash(password, 10);

      // Créer le restaurant
      const newRestaurant = await Restaurant.create({
        name,
        company_number,
        address_number,
        phone: phone || null,
        email,
        password: hash,
        logo: logo || null,
        nb_followers: nb_followers || 0
      });

      return res.status(201).json({
        message: 'Restaurant créé avec succès.',
        restaurant: {
          id: newRestaurant.id,
          name: newRestaurant.name,
          email: newRestaurant.email,
          company_number: newRestaurant.company_number
        }
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la création du restaurant.' });
    }
  },

  /**
   * Connexion d’un restaurant existant.
   * Paramètres d'entrée (req.body) :
   *   - email    : string (obligatoire)
   *   - password : string (obligatoire)
   *
   * Réponses :
   *   • 200 + { message: 'Connexion réussie.', token: '<JWT>' }
   *   • 400 si email ou password manquant
   *   • 404 si aucun restaurant avec cet email
   *   • 401 si mot de passe incorrect
   *   • 500 en cas d’erreur serveur
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Vérifier que email et password sont fournis
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Email et mot de passe requis.' });
      }

      // Rechercher le restaurant par email
      const restaurant = await Restaurant.findOne({ where: { email } });
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      // Comparer le mot de passe
      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Générer le token JWT
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
