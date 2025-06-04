// controllers/authUserController.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
  /**
   * POST /api/auth/user/signup
   * Crée un nouvel utilisateur si login, email et password sont fournis et uniques.
   * Entrées (req.body) : { login, email, password, address_number?, firstname?, surname?, phone?, avatar? }
   * Sortie : status 201 + { message, user:{ id, login, email } } ou status 400/409/500 + { error }.
   */
  async signup(req, res) {
    try {
      const { login, email, password, address_number, firstname, surname, phone, avatar } = req.body;

      // 1) Validation des champs obligatoires
      if (!login || login.trim() === '') {
        return res.status(400).json({ error: 'Login requis.' });
      }
      if (!email || email.trim() === '') {
        return res.status(400).json({ error: 'Email requis.' });
      }
      if (!password || password.trim() === '') {
        return res.status(400).json({ error: 'Password requis.' });
      }

      // 2) Vérifier qu’aucun user n’existe déjà avec le même login ou email
      const existLogin = await User.findOne({ where: { login } });
      if (existLogin) {
        return res.status(409).json({ error: 'Ce login est déjà pris.' });
      }
      const existEmail = await User.findOne({ where: { email } });
      if (existEmail) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur.' });
    }
  },

  /**
   * POST /api/auth/user/login
   * Connecte un utilisateur existant en login *ou* email + password.
   * Entrées (req.body) : { login?, email?, password }
   * Sortie : status 200 + { message, token } ou status 400/401/404/500 + { error }.
   */
  async login(req, res) {
    try {
      const { login, email, password } = req.body;

      // 1) Validation des champs obligatoires
      if ((!login || login.trim() === '') && (!email || email.trim() === '')) {
        return res.status(400).json({ error: 'Login ou email requis.' });
      }
      if (!password || password.trim() === '') {
        return res.status(400).json({ error: 'Password requis.' });
      }

      // 2) Chercher l’utilisateur par login OU email
      let user;
      if (login && login.trim() !== '') {
        user = await User.findOne({ where: { login } });
      } else {
        user = await User.findOne({ where: { email } });
      }
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      // 3) Comparer le mot de passe
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  }
};
