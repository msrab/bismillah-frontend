'use strict';

const { User, Street, Language } = require('../models');
const { createError } = require('../utils/createError');

module.exports = {
  // GET /api/users/me
  async getProfile(req, res, next) {
    try {
      if (req.userType !== 'user') {
        return next(createError('Accès interdit : pas un utilisateur.', 403));
      }
      const user = await User.findByPk(req.userId, {
        attributes: [
          'id', 'login', 'email', 'address_number', 'firstname', 'surname',
          'phone', 'avatar', 'streetId', 'languageId', 'createdAt', 'updatedAt'
        ],
        include: [
          { model: Street, as: 'street' },
          { model: Language, as: 'language' }
        ]
      });
      if (!user) {
        return next(createError('Utilisateur non trouvé.', 404));
      }
      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  // PUT /api/users/me
  async updateProfile(req, res, next) {
    try {
      if (req.userType !== 'user') {
        return next(createError('Accès interdit : pas un utilisateur.', 403));
      }
      const user = await User.findByPk(req.userId);
      if (!user) {
        return next(createError('Utilisateur non trouvé.', 404));
      }
      const { login, email, address_number, firstname, surname, phone, avatar, streetId } = req.body;

      // Vérifie unicité login/email si modifiés
      if (login && login !== user.login) {
        const exists = await User.findOne({ where: { login } });
        if (exists) {
          return next(createError('Ce login est déjà pris.', 409));
        }
        user.login = login;
      }
      if (email && email !== user.email) {
        const existsEmail = await User.findOne({ where: { email } });
        if (existsEmail) {
          return next(createError('Cet email est déjà utilisé.', 409));
        }
        user.email = email;
      }

      // Met à jour les autres champs (sauf languageId)
      if (address_number !== undefined) user.address_number = address_number;
      if (firstname       !== undefined) user.firstname       = firstname;
      if (surname         !== undefined) user.surname         = surname;
      if (phone           !== undefined) user.phone           = phone;
      if (avatar          !== undefined) user.avatar          = avatar;
      if (streetId        !== undefined) user.streetId        = streetId;

      await user.save();

      // Recharge avec les associations pour la réponse
      const updatedUser = await User.findByPk(user.id, {
        attributes: [
          'id', 'login', 'email', 'address_number', 'firstname', 'surname',
          'phone', 'avatar', 'streetId', 'languageId', 'createdAt', 'updatedAt'
        ],
        include: [
          { model: Street, as: 'street' },
          { model: Language, as: 'language' }
        ]
      });

      return res.status(200).json({
        message: 'Profil mis à jour avec succès.',
        user: updatedUser
      });
    } catch (error) {
      return next(error);
    }
  },

  // PATCH /api/users/me/language
  async changeLanguage(req, res, next) {
    try {
      if (req.userType !== 'user') {
        return next(createError('Accès interdit : pas un utilisateur.', 403));
      }
      const { languageId } = req.body;
      if (!languageId) {
        return next(createError('La langue (languageId) est requise.', 400));
      }
      const language = await Language.findByPk(languageId);
      if (!language) {
        return next(createError('Langue non trouvée.', 404));
      }
      const user = await User.findByPk(req.userId);
      if (!user) {
        return next(createError('Utilisateur non trouvé.', 404));
      }
      user.languageId = languageId;
      await user.save();

      // Recharge avec l'association
      const updatedUser = await User.findByPk(user.id, {
        attributes: [
          'id', 'login', 'email', 'address_number', 'firstname', 'surname',
          'phone', 'avatar', 'streetId', 'languageId', 'createdAt', 'updatedAt'
        ],
        include: [
          { model: Street, as: 'street' },
          { model: Language, as: 'language' }
        ]
      });

      return res.status(200).json({
        message: 'Langue modifiée avec succès.',
        user: updatedUser
      });
    } catch (error) {
      return next(error);
    }
  },

  // DELETE /api/users/me
  async deleteProfile(req, res, next) {
    try {
      if (req.userType !== 'user') {
        return next(createError('Accès interdit : pas un utilisateur.', 403));
      }
      const user = await User.findByPk(req.userId);
      if (!user) {
        return next(createError('Utilisateur non trouvé.', 404));
      }
      await user.destroy();
      return res.status(200).json({ message: 'Compte utilisateur supprimé.' });
    } catch (error) {
      return next(error);
    }
  }
};