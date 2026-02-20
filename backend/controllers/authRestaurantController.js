const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const { Restaurant, Street, City, Country, RestaurantType, RestaurantTypeDescription, RestaurantLanguage, Language, PasswordResetToken, RestaurantCertification, Certifier } = require('../models');
const { createError } = require('../utils/createError');
const { generateRestaurantSlug } = require('../utils/restaurantSlugHelper');
const { sendVerificationEmail } = require('../utils/emailService');

/**
 * Génère un token de vérification sécurisé
 * @returns {string} Token hexadécimal de 32 caractères
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

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
        website,
        // Nouvelle méthode: cityName + postalCode
        cityName,
        postalCode,
        countryId,
        streetName,
        // Ancienne méthode (rétrocompatibilité)
        cityId,
        streetId,
        // Type de restaurant
        restaurantTypeId,   // id d'un type existant
        newTypeName,        // nom d'un nouveau type à créer (non validé)
        restaurantType,     // objet pour créer un nouveau type (rétrocompatibilité)
        defaultLanguage,    // langue par défaut (fr, en, nl, de)
        // Certification halal
        hasCertification,
        certifierId,
        customCertifierName,
        certificationNumber
      } = req.body;

      // Récupération du logo uploadé (si présent)
      // Stocke le chemin relatif (ex: "uploads/restaurant/nom-resto/logo-xxx.png")
      let logoPath = null;
      if (req.file) {
        // Convertit le chemin absolu en chemin relatif depuis le dossier backend
        logoPath = req.file.path
          .replace(/\\/g, '/')
          .split('/uploads/')
          .pop();
        logoPath = 'uploads/' + logoPath;
      }

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
      } else if (newTypeName && typeof newTypeName === 'string' && newTypeName.trim()) {
        // Créer un nouveau type simple (non validé) avec le nom fourni
        const trimmedTypeName = newTypeName.trim();
        
        // Vérifier si un type avec ce nom existe déjà
        const existingDesc = await RestaurantTypeDescription.findOne({
          where: { languageId: 1, name: trimmedTypeName }
        });
        
        if (existingDesc) {
          // Utiliser le type existant
          typeIdToUse = existingDesc.restaurantTypeId;
        } else {
          // Créer le nouveau type avec isValidated = false
          const newType = await RestaurantType.create({
            icon: '🍽️',
            isValidated: false
          });
          await RestaurantTypeDescription.create({
            restaurantTypeId: newType.id,
            languageId: 1, // Français par défaut
            name: trimmedTypeName,
            description: `Type de restaurant : ${trimmedTypeName}`
          });
          typeIdToUse = newType.id;
        }
      } else if (restaurantType) {
        // Crée un nouveau type non validé (ancienne méthode - rétrocompatibilité)
        const { icon, descriptions } = restaurantType;
        const newType = await RestaurantType.create({ icon, isValidated: false });
        for (const desc of descriptions) {
          await RestaurantTypeDescription.create({ ...desc, restaurantTypeId: newType.id });
        }
        typeIdToUse = newType.id;
      }

      // Gestion de l'adresse (rue)
      let streetIdToUse = streetId; // Rétrocompatibilité
      let cityIdToUse = cityId; // Rétrocompatibilité

      // ========== Gestion de la ville (créer si n'existe pas) ==========
      if (cityName && postalCode) {
        // Chercher la ville par nom et code postal
        let city = await City.findOne({
          where: { 
            name: cityName.trim(),
            postal_code: postalCode.trim()
          }
        });

        if (!city) {
          // Créer la ville
          city = await City.create({
            name: cityName.trim(),
            postal_code: postalCode.trim(),
            countryId: countryId || 1 // Par défaut Belgique
          });
        }

        cityIdToUse = city.id;
      }

      // ========== Gestion de la rue (créer si n'existe pas) ==========
      if (streetName && cityIdToUse) {
        let street = await Street.findOne({ 
          where: { name: streetName.trim(), cityId: cityIdToUse } 
        });
        
        if (!street) {
          street = await Street.create({ 
            name: streetName.trim(), 
            cityId: cityIdToUse 
          });
        }
        
        streetIdToUse = street.id;
      }

      if (!streetIdToUse) {
        return next(createError('L\'adresse est requise.', 400));
      }

      if (!cityIdToUse) {
        return next(createError('La ville est requise.', 400));
      }

      const hash = await bcrypt.hash(password, 10);

      // ========== Transformations ==========
      const normalizedName = name ? name.trim().toUpperCase() : '';
      const normalizedEmail = email ? email.trim().toLowerCase() : '';

      // Slug généré automatiquement à partir du nom et de la ville (unique)
      const cityForSlug = await City.findByPk(cityIdToUse);
      const slug = await generateRestaurantSlug(normalizedName, cityForSlug ? cityForSlug.name : '', Restaurant);

      // ========== Génération du token de vérification email ==========
      const verificationToken = generateVerificationToken();
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      const newRestaurant = await Restaurant.create({
        name: normalizedName,
        slug,
        company_number,
        address_number,
        phone: phone || null,
        email: normalizedEmail,
        password: hash,
        logo: logoPath,
        website: website || null,
        streetId: streetIdToUse,
        restaurantTypeId: typeIdToUse,
        // Vérification email désactivée - compte vérifié automatiquement
        is_email_verified: true,
        verification_token: null,
        verification_token_expires: null
      });

      // ========== Création de la certification (si applicable) ==========
      if (hasCertification && certificationNumber) {
        await RestaurantCertification.create({
          restaurantId: newRestaurant.id,
          certifierId: certifierId || null,
          custom_certifier_name: customCertifierName || null,
          certification_number: certificationNumber,
          is_verified: false
        });
      }

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

      // ========== Envoi de l'email de vérification (DÉSACTIVÉ) ==========
      // La vérification email est désactivée pour le moment
      // try {
      //   const emailResult = await sendVerificationEmail(
      //     normalizedEmail,
      //     normalizedName,
      //     verificationToken
      //   );
      //   console.log('📧 Email de vérification envoyé:', emailResult.previewUrl || 'envoyé');
      // } catch (emailError) {
      //   console.error('❌ Erreur envoi email:', emailError);
      // }

      // On récupère le restaurant avec les associations (sans les champs sensibles)
      const restaurantWithAssociations = await Restaurant.findByPk(newRestaurant.id, {
        attributes: { exclude: ['password', 'verification_token', 'verification_token_expires'] },
        include: [
          { 
            model: Street, 
            as: 'street',
            include: [{ model: City, as: 'city' }]
          },
          {
            model: RestaurantCertification,
            as: 'certifications',
            include: [{ model: Certifier, as: 'certifier' }]
          }
        ]
      });

      // Générer le token JWT pour connexion automatique
      const token = jwt.sign(
        { id: newRestaurant.id, type: 'restaurant' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'Inscription réussie !',
        token,
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

      // ========== Vérification du compte email ==========
      if (!restaurant.is_email_verified) {
        return res.status(403).json({
          message: 'Votre compte n\'est pas encore vérifié. Veuillez cliquer sur le lien envoyé par email pour activer votre compte.',
          requiresVerification: true,
          email: restaurant.email
        });
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
  },

  /**
   * Vérifie l'email d'un restaurant via le token envoyé par email
   * GET /api/auth/restaurant/verify-email?token=xxx
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        return next(createError('Token de vérification manquant.', 400));
      }

      // Recherche le restaurant avec ce token
      const restaurant = await Restaurant.findOne({
        where: { verification_token: token }
      });

      if (!restaurant) {
        return next(createError('Token de vérification invalide ou expiré.', 400));
      }

      // Vérifie si le token n'a pas expiré
      if (restaurant.verification_token_expires && new Date() > restaurant.verification_token_expires) {
        return next(createError('Le lien de vérification a expiré. Veuillez demander un nouveau lien.', 400));
      }

      // Vérifie si le compte n'est pas déjà vérifié
      if (restaurant.is_email_verified) {
        return res.status(200).json({
          message: 'Votre compte est déjà vérifié. Vous pouvez vous connecter.',
          alreadyVerified: true
        });
      }

      // Active le compte
      restaurant.is_email_verified = true;
      restaurant.verification_token = null;
      restaurant.verification_token_expires = null;
      await restaurant.save();

      return res.status(200).json({
        message: 'Votre compte a été vérifié avec succès ! Vous pouvez maintenant vous connecter.',
        verified: true
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Renvoie l'email de vérification
   * POST /api/auth/restaurant/resend-verification
   */
  async resendVerificationEmail(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return next(createError('L\'email est requis.', 400));
      }

      const restaurant = await Restaurant.findOne({
        where: { email: email.toLowerCase().trim() }
      });

      if (!restaurant) {
        // Pour la sécurité, on renvoie un message générique
        return res.status(200).json({
          message: 'Si cet email est enregistré, un nouveau lien de vérification sera envoyé.'
        });
      }

      // Vérifie si le compte n'est pas déjà vérifié
      if (restaurant.is_email_verified) {
        return res.status(200).json({
          message: 'Votre compte est déjà vérifié. Vous pouvez vous connecter.',
          alreadyVerified: true
        });
      }

      // Génère un nouveau token
      const verificationToken = generateVerificationToken();
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      restaurant.verification_token = verificationToken;
      restaurant.verification_token_expires = verificationTokenExpires;
      await restaurant.save();

      // Envoie l'email
      try {
        const emailResult = await sendVerificationEmail(
          restaurant.email,
          restaurant.name,
          verificationToken
        );
        console.log('📧 Email de vérification renvoyé:', emailResult.previewUrl || 'envoyé');
      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError);
        return next(createError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.', 500));
      }

      return res.status(200).json({
        message: 'Un nouveau lien de vérification a été envoyé à votre adresse email.'
      });
    } catch (error) {
      next(error);
    }
  }

};