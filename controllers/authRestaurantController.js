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

      if (!email) {
        return res.status(400).json({ error: 'L’email est requis.' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Le mot de passe est requis.' });
      }

      const restaurant = await Restaurant.findOne({ where: { email } });
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

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
  },

  /**
   * POST /api/auth/restaurant/forgot-password
   * Génère un token temporaire et l’envoie par mail.
   * @param req.body.email
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const rest = await Restaurant.findOne({ where: { email } });
      if (!rest) {
        return res.status(200).json({
          message: 'Si cet email est enregistré, vous allez recevoir un lien de réinitialisation.'
        });
      }

      const token = jwt.sign(
        { id: rest.id, type: 'restaurant' },
        process.env.JWT_RESET_SECRET,
        { expiresIn: '1h' }
      );

      await PasswordResetToken.create({
        token,
        restaurantId: rest.id,
        expiresAt: Date.now() + 3600 * 1000
      });

      // TODO : Envoyer le mail avec lien
      // e.g. sendMail(rest.email, `https://votresite.com/reset-password?token=${token}`)

      return res.status(200).json({
        message: 'Si cet email est enregistré, vous allez recevoir un lien de réinitialisation.'
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la génération du lien de réinitialisation.' });
    }
  },

  /**
   * POST /api/auth/restaurant/reset-password
   * Réinitialise le mot de passe via le token.
   * @param req.body.token
   * @param req.body.newPassword
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const record = await PasswordResetToken.findOne({ where: { token } });
      if (!record || record.expiresAt < Date.now()) {
        return res.status(400).json({ error: 'Token invalide ou expiré.' });
      }

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
      } catch {
        return res.status(400).json({ error: 'Token invalide ou expiré.' });
      }

      const rest = await Restaurant.findByPk(payload.id);
      if (!rest) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      const hash = await bcrypt.hash(newPassword, 10);
      rest.password = hash;
      await rest.save();

      await record.destroy();

      return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
    }
  },

  /**
   * POST /api/auth/restaurant/logout
   * Invalide le token côté client (et/ou côté serveur via blacklist).
   */
  async logout(req, res) {
    // Optionnel : stocker req.token en blacklist pour interdire son usage jusqu’à expiration
    return res.status(200).json({ message: 'Déconnexion réussie.' });
  },

  /**
   * POST /api/auth/restaurant/change-password
   * Permet à un restaurant connecté de changer son mot de passe.
   * @param req.userId      — injecté par verifyToken
   * @param req.userType    — injecté par verifyToken (doit être 'restaurant')
   * @param req.body.oldPassword
   * @param req.body.newPassword
   */
  async changePassword(req, res) {
    try {
      if (req.userType !== 'restaurant') {
        return res.status(403).json({ error: 'Accès interdit : pas un restaurant.' });
      }

      const { oldPassword, newPassword } = req.body;

      const rest = await Restaurant.findByPk(req.userId);
      if (!rest) {
        return res.status(404).json({ error: 'Restaurant non trouvé.' });
      }

      const match = await bcrypt.compare(oldPassword, rest.password);
      if (!match) {
        return res.status(401).json({ error: 'Ancien mot de passe incorrect.' });
      }

      rest.password = await bcrypt.hash(newPassword, 10);
      await rest.save();

      return res.status(200).json({ message: 'Mot de passe changé avec succès.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors du changement de mot de passe.' });
    }
  }

};
