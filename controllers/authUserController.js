// controllers/authUserController.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');
const createError = require('../utils/createError');

module.exports = {
  /**
   * POST /api/auth/user/signup
   * Crée un nouvel utilisateur si login, email et password sont fournis et uniques.
   * Entrées (req.body) : { login, email, password, address_number?, firstname?, surname?, phone?, avatar? }
   * Sortie : status 201 + { message, user:{ id, login, email } } ou status 400/409/500 + { error }.
   */
  async signup(req, res, next) {
    try {
      const { login, email, password, address_number, firstname, surname, phone, avatar } = req.body;

      // 1) Validation des champs obligatoires
      if (!login || login.trim() === '') {
        return next(createError('Login requis.', 400));
      }
      if (!email || email.trim() === '') {
        return next(createError('Email requis.', 400));
      }
      if (!password || password.trim() === '') {
        return next(createError('Password requis.', 400));
      }

      // 2) Vérifier qu’aucun user n’existe déjà avec le même login ou email
      const existLogin = await User.findOne({ where: { login } });
      if (existLogin) {
        return next(createError('Ce login est déjà pris.', 409));
      }
      const existEmail = await User.findOne({ where: { email } });
      if (existEmail) {
        return next(createError('Cet email est déjà utilisé.', 409));
      }

      // 3) Hasher le mot de passe
      const hash = await bcrypt.hash(password, 10);

      // 4) Créer l’utilisateur
      const newUser = await User.create({
        login,
        email,
        password: hash,
        address_number: address_number || null,
        firstname: firstname || null,
        surname: surname || null,
        phone: phone || null,
        avatar: avatar || null
      });

      return res.status(201).json({
        message: 'Utilisateur créé avec succès.',
        user: {
          id: newUser.id,
          login: newUser.login,
          email: newUser.email
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/user/login
   * Connecte un utilisateur existant en login *ou* email + password.
   * Entrées (req.body) : { login?, email?, password }
   * Sortie : status 200 + { message, token } ou status 400/401/404/500 + { error }.
   */
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

      // 4) Générer un token JWT (payload contient id et type)
      const token = jwt.sign(
        { id: user.id, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Connexion réussie.',
        token
      });
    } catch (error) {
      next(error);
    }
  }
};
