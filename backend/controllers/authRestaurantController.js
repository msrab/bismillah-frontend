const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { Restaurant, Street, City, RestaurantType, RestaurantTypeDescription, RestaurantLanguage, Language, PasswordResetToken } = require('../models');
const { createError } = require('../utils/createError');
const { generateRestaurantSlug } = require('../utils/restaurantSlugHelper');

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
        logo,
        website,
        // Nouvelle méthode: cityId + streetName au lieu de streetId
        cityId,
        streetName,
        streetId,           // Ancienne méthode (rétrocompatibilité)
        restaurantTypeId,   // id d'un type existant
        restaurantType,     // objet pour créer un nouveau type
        defaultLanguage     // langue par défaut (fr, en, nl, de)
      } = req.body;

      const existEmail = await Restaurant.findOne({ where: { email } });
      if (existEmail) {
        return next(createError('Cet email est déjà utilisé.', 409));
      }

      const existCompanyNumber = await Restaurant.findOne({ where: { company_number } });
      if (existCompanyNumber) {
        return next(createError('Ce numéro d’entreprise est déjà pris.', 409));
      }

      // Validation explicite du format côté backend (défense en profondeur)
      if (!/^BE\d{10}$/.test(company_number)) {
        return next(createError("Le numéro d'entreprise doit être au format BE suivi de 10 chiffres (ex: BE0123456789).", 400));
      }

      let typeIdToUse = null;

      if (restaurantTypeId) {
        // Vérifie que le type existe
        const type = await RestaurantType.findOne({ where: { id: restaurantTypeId } });
        if (!type) {
          return next(createError('Type de restaurant non trouvé.', 400));
        }
        typeIdToUse = restaurantTypeId;
      } else if (restaurantType) {
        // Crée un nouveau type non validé
        const { icon, descriptions } = restaurantType;
        const newType = await RestaurantType.create({ icon, isValidated: false });
        for (const desc of descriptions) {
          await RestaurantTypeDescription.create({ ...desc, restaurantTypeId: newType.id });
        }
        typeIdToUse = newType.id;
      }

      // Gestion de l'adresse (rue)
      let streetIdToUse = streetId; // Rétrocompatibilité

      // Nouvelle méthode: créer/trouver la rue à partir de cityId et streetName
      if (cityId && streetName) {
        // Vérifier que la ville existe
        const city = await City.findByPk(cityId);
        if (!city) {
          return next(createError('Ville non trouvée.', 400));
        }

        // Chercher ou créer la rue
        let street = await Street.findOne({ 
          where: { name: streetName.trim(), cityId: cityId } 
        });
        
        if (!street) {
          street = await Street.create({ 
            name: streetName.trim(), 
            cityId: cityId 
          });
        }
        
        streetIdToUse = street.id;
      }

      if (!streetIdToUse) {
        return next(createError('L\'adresse est requise.', 400));
      }

      const hash = await bcrypt.hash(password, 10);



      // Slug généré automatiquement à partir du nom et de la ville (unique)
      let cityName = '';
      if (cityId) {
        const city = await City.findByPk(cityId);
        cityName = city ? city.name : '';
      }
      const slug = await generateRestaurantSlug(name, cityName, Restaurant);

      const newRestaurant = await Restaurant.create({
        name,
        slug,
        company_number,
        address_number,
        phone: phone || null,
        email,
        password: hash,
        logo: logo || null,
        streetId: streetIdToUse,
        restaurantTypeId: typeIdToUse
      });

      // Ajouter la langue par défaut si spécifiée
      if (defaultLanguage) {
        const lang = await Language.findOne({ where: { name: defaultLanguage } });
        if (lang) {
          await RestaurantLanguage.create({
            restaurantId: newRestaurant.id,
            languageId: lang.id,
            is_primary: true
          });
        }
      }

      // On récupère le restaurant avec les associations
      const restaurantWithAssociations = await Restaurant.findByPk(newRestaurant.id, {
        include: [
          { 
            model: Street, 
            as: 'street',
            include: [{ model: City, as: 'city' }]
          }
        ]
      });

      return res.status(201).json({
        message: 'Restaurant créé avec succès.',
        restaurant: restaurantWithAssociations
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

      const restaurant = await Restaurant.findOne({
        where: { email },
        include: [
          { model: Street, as: 'street' }
        ]
      });
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
        restaurant
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