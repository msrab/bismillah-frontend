const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { Restaurant } = require('../models');

module.exports = {
  async signup(req, res) {
    try {
      const { login, name, company_number, address_number, phone, email, password, logo } = req.body;

      // Vérifier unicité du login, company_number et email
      const conflictLogin = await Restaurant.findOne({ where: { login } });
      if (conflictLogin) {
        return res.status(409).json({ error: 'Ce login est déjà pris.' });
      }
      const conflictCompany = await Restaurant.findOne({ where: { company_number } });
      if (conflictCompany) {
        return res.status(409).json({ error: 'Ce numéro d’entreprise est déjà utilisé.' });
      }
      const conflictEmail = await Restaurant.findOne({ where: { email } });
      if (conflictEmail) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }

      // Hasher le mot de passe
      const hash = await bcrypt.hash(password, 10);

      // Créer le restaurant
      const newRest = await Restaurant.create({
        login,
        name,
        company_number,
        address_number: address_number || null,
        phone: phone || null,
        email,
        password: hash,
        logo: logo || null,
        nb_followers: 0
      });

      return res.status(201).json({
        message: 'Restaurant créé avec succès.',
        restaurant: {
          id: newRest.id,
          login: newRest.login,
          name: newRest.name
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la création du restaurant.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Vérifier que l’email existe
      const restaurant = await Restaurant.findOne({ where: { email } });
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      // Vérifier le mot de passe
      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Générer un token JWT
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
      return res.status(500).json({ error: 'Erreur lors de la connexion du restaurant.' });
    }
  }
};
