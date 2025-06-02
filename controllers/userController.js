'use strict';

const bcrypt = require('bcrypt');
const { User } = require('../models'); // Vérifie que ton index des modèles exporte bien User

module.exports = {
  /**
   * GET /api/users/me
   * Récupère les informations du user connecté (depuis req.userId, req.userType)
   */
  async getProfile(req, res) {
    try {
      // S’assurer que c’est un user qui appelle
      if (req.userType !== 'user') {
        return res.status(403).json({ error: 'Accès interdit : pas un utilisateur.' });
      }

      const user = await User.findByPk(req.userId, {
        attributes: ['id','login','email','address_number','firstname','surname','phone','avatar','createdAt','updatedAt']
      });
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      return res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
  },

  /**
   * PUT /api/users/me
   * Met à jour le profil du user connecté (login,email,address_number,firstname,surname,phone,avatar)
   */
  async updateProfile(req, res) {
    try {
      if (req.userType !== 'user') {
        return res.status(403).json({ error: 'Accès interdit : pas un utilisateur.' });
      }

      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      const { login, email, address_number, firstname, surname, phone, avatar } = req.body;

      // Si login/email modifiés, vérifier unicité
      if (login && login !== user.login) {
        const exists = await User.findOne({ where: { login } });
        if (exists) {
          return res.status(409).json({ error: 'Ce login est déjà pris.' });
        }
        user.login = login;
      }

      if (email && email !== user.email) {
        const existsEmail = await User.findOne({ where: { email } });
        if (existsEmail) {
          return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
        }
        user.email = email;
      }

      // Mettre à jour les autres champs sans validation d’unicité
      if (address_number !== undefined) user.address_number = address_number;
      if (firstname       !== undefined) user.firstname       = firstname;
      if (surname         !== undefined) user.surname         = surname;
      if (phone           !== undefined) user.phone           = phone;
      if (avatar          !== undefined) user.avatar          = avatar;

      await user.save();

      // Ne pas renvoyer le mot de passe
      return res.status(200).json({
        message: 'Profil mis à jour avec succès.',
        user: {
          id:             user.id,
          login:          user.login,
          email:          user.email,
          address_number: user.address_number,
          firstname:      user.firstname,
          surname:        user.surname,
          phone:          user.phone,
          avatar:         user.avatar,
          createdAt:      user.createdAt,
          updatedAt:      user.updatedAt
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
    }
  },

  /**
   * DELETE /api/users/me
   * Supprime le compte du user connecté
   */
  async deleteProfile(req, res) {
    try {
      if (req.userType !== 'user') {
        return res.status(403).json({ error: 'Accès interdit : pas un utilisateur.' });
      }

      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      await user.destroy();
      return res.status(200).json({ message: 'Compte utilisateur supprimé.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la suppression du compte.' });
    }
  }
};
