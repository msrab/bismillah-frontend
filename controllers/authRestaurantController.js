const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { Restaurant } = require('../models');
const { createError } = require('../utils/createError');

module.exports = {

  async signup(req, res, next) {
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
        return next(createError('Ce numéro d’entreprise est déjà pris.', 409));
      }

      const existEmail = await Restaurant.findOne({ where: { email } });
      if (existEmail) {
        return next(createError('Cet email est déjà utilisé.', 409));
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
          email: newRestaurant.email,
          company_number: newRestaurant.company_number,
          address_number: newRestaurant.address_number,
          phone: newRestaurant.phone,
          logo: newRestaurant.logo
        }
      });
    } catch (error) {
      // Gestion des erreurs de contrainte unique Sequelize
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors.some(e => e.path === 'email')) {
          return next(createError('Cet email est déjà utilisé.', 409));
        }
        if (error.errors.some(e => e.path === 'company_number')) {
          return next(createError('Ce numéro d’entreprise est déjà pris.', 409));
        }
      }
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return next(createError('L’email est requis.', 400));
      }
      if (!password) {
        return next(createError('Le mot de passe est requis.', 400));
      }

      const restaurant = await Restaurant.findOne({ where: { email } });
      if (!restaurant) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) {
        return next(createError('Mot de passe incorrect.', 401));
      }

      const token = jwt.sign(
        { id: restaurant.id, type: 'restaurant' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Connexion réussie.',
        token,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          email: restaurant.email,
          company_number: restaurant.company_number,
          address_number: restaurant.address_number,
          phone: restaurant.phone,
          logo: restaurant.logo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
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
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const record = await PasswordResetToken.findOne({ where: { token } });
      if (!record || record.expiresAt < Date.now()) {
        return next(createError('Token invalide ou expiré.', 400));
      }

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
      } catch {
        return next(createError('Token invalide ou expiré.', 400));
      }

      const rest = await Restaurant.findByPk(payload.id);
      if (!rest) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      const hash = await bcrypt.hash(newPassword, 10);
      rest.password = hash;
      await rest.save();

      await record.destroy();

      return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    // Optionnel : stocker req.token en blacklist pour interdire son usage jusqu’à expiration
    return res.status(200).json({ message: 'Déconnexion réussie.' });
  },

  async changePassword(req, res, next) {
    try {
      if (req.userType !== 'restaurant') {
        return next(createError('Accès interdit : pas un restaurant.', 403));
      }

      const { oldPassword, newPassword } = req.body;

      const rest = await Restaurant.findByPk(req.userId);
      if (!rest) {
        return next(createError('Restaurant non trouvé.', 404));
      }

      const match = await bcrypt.compare(oldPassword, rest.password);
      if (!match) {
        return next(createError('Ancien mot de passe incorrect.', 401));
      }

      rest.password = await bcrypt.hash(newPassword, 10);
      await rest.save();

      return res.status(200).json({ message: 'Mot de passe changé avec succès.' });
    } catch (error) {
      next(error);
    }
  }

};