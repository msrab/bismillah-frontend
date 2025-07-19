const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User, Language, Street } = require('../models');
const { createError } = require('../utils/createError');

module.exports = {
  // POST /api/auth/user/signup
  async signup(req, res, next) {
    try {
      const { login, email, password, address_number, firstname, surname, phone, avatar, streetId, languageId } = req.body;

      // Vérifie champs obligatoires
      if (!streetId) {
        return next(createError('La rue (streetId) est requise.', 400));
      }
      if (!languageId) {
        return next(createError('La langue (languageId) est requise.', 400));
      }

      // Vérifie unicité login/email
      const existLogin = await User.findOne({ where: { login } });
      if (existLogin) {
        return next(createError('Ce login est déjà pris.', 409));
      }
      const existEmail = await User.findOne({ where: { email } });
      if (existEmail) {
        return next(createError('Cet email est déjà utilisé.', 409));
      }

      // Vérifie que la langue existe
      const language = await Language.findByPk(languageId);
      if (!language) {
        return next(createError('Langue non trouvée.', 404));
      }

      // Vérifie que la rue existe
      const street = await Street.findByPk(streetId);
      if (!street) {
        return next(createError('Rue non trouvée.', 404));
      }

      const hash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        login,
        email,
        password: hash,
        address_number,
        firstname: firstname || null,
        surname: surname || null,
        phone: phone || null,
        avatar: avatar || null,
        streetId,
        languageId
      });

      return res.status(201).json({
        message: 'Utilisateur créé avec succès.',
        user: {
          id: newUser.id,
          login: newUser.login,
          email: newUser.email,
          address_number: newUser.address_number,
          firstname: newUser.firstname,
          surname: newUser.surname,
          phone: newUser.phone,
          avatar: newUser.avatar,
          street: { id: street.id, name: street.name, ...street.toJSON() },
          language: { id: language.id, name: language.name, icon: language.icon }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/user/login
  async login(req, res, next) {
    try {
      const { login, email, password } = req.body;

      // 1) Validation des champs obligatoires
      if ((!login || login.trim() === '') && (!email || email.trim() === '')) {
        return next(createError('Login ou email requis.', 400));
      }
      if (!password || password.trim() === '') {
        return next(createError('Password requis.', 400));
      }

      // 2) Chercher l’utilisateur par login OU email
      let user;
      if (login && login.trim() !== '') {
        user = await User.findOne({ where: { login } });
      } else {
        user = await User.findOne({ where: { email } });
      }
      if (!user) {
        return next(createError('Utilisateur non trouvé.', 404));
      }

      // 3) Comparer le mot de passe
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next(createError('Mot de passe incorrect.', 401));
      }

      // 4) Récupère la langue et la rue associées
      const language = user.languageId ? await Language.findByPk(user.languageId) : null;
      const street = user.streetId ? await Street.findByPk(user.streetId) : null;

      // 5) Générer un token JWT (payload contient id et type)
      const token = jwt.sign(
        { id: user.id, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Connexion réussie.',
        token,
        user: {
          id: user.id,
          login: user.login,
          email: user.email,
          address_number: user.address_number,
          firstname: user.firstname,
          surname: user.surname,
          phone: user.phone,
          avatar: user.avatar,
          street: street ? { id: street.id, name: street.name, ...street.toJSON() } : null,
          language: language ? { id: language.id, name: language.name, icon: language.icon } : null
        }
      });
    } catch (error) {
      next(error);
    }
  }
};