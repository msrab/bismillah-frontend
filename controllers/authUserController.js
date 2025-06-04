const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User } = require('../models'); // Charge le modèle User depuis l’index des modèles

module.exports = {
  /**
   * Crée un nouvel utilisateur.
   *
   * @param {Object} req - Objet requête Express.
   *   @property {string} body.login           - Le login choisi (unique, pas au format email).
   *   @property {string} body.email           - L’email de l’utilisateur (unique).
   *   @property {string} body.password        - Le mot de passe en clair.
   *   @property {string} [body.address_number] - Numéro de rue (facultatif).
   *   @property {string} [body.firstname]     - Prénom de l’utilisateur (facultatif).
   *   @property {string} [body.surname]       - Nom de famille (facultatif).
   *   @property {string} [body.phone]         - Téléphone (facultatif).
   *   @property {string} [body.avatar]        - URL de l’avatar (facultatif).
   *
   * @param {Object} res - Objet réponse Express.
   *   @returns {201, JSON} - Si création OK : message + id, login et email du nouvel utilisateur.
   *   @returns {409, JSON} - Si login ou email déjà existant.
   *   @returns {500, JSON} - En cas d’erreur interne.
   */
  async signup(req, res) {
    try {
      const { login, email, password, address_number, firstname, surname, phone, avatar } = req.body;

      // 1) Vérifier qu’aucun utilisateur n’existe déjà avec ce login
      const existLogin = await User.findOne({ where: { login } });
      if (existLogin) {
        return res.status(409).json({ error: 'Ce login est déjà pris.' });
      }

      // 2) Vérifier qu’aucun utilisateur n’existe déjà avec cet email
      const existEmail = await User.findOne({ where: { email } });
      if (existEmail) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }

      // 3) Hasher le mot de passe avant de le stocker
      const hash = await bcrypt.hash(password, 10);

      // 4) Créer le nouvel utilisateur en base
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

      // 5) Retourner un 201 + quelques informations publiques sur l’utilisateur créé
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
   * Authentifie un utilisateur (par login ou par email) et renvoie un JWT.
   *
   * @param {Object} req - Objet requête Express.
   *   @property {string} [body.login]   - Le login (si pas d’email).
   *   @property {string} [body.email]   - L’email (si pas de login).
   *   @property {string} body.password  - Le mot de passe en clair.
   *
   * @param {Object} res - Objet réponse Express.
   *   @returns {200, JSON} - Si auth OK : message + token JWT.
   *   @returns {404, JSON} - Si aucun utilisateur trouvé avec le login/email donné.
   *   @returns {401, JSON} - Si mot de passe incorrect.
   *   @returns {500, JSON} - En cas d’erreur interne.
   */
  async login(req, res) {
    try {
      const { login, email, password } = req.body;

      // Déterminer si l’utilisateur s’authentifie par login ou par email
      let user;
      if (email) {
        user = await User.findOne({ where: { email } });
      } else if (login) {
        user = await User.findOne({ where: { login } });
      } else {
        return res
          .status(400)
          .json({ error: 'Vous devez fournir un login ou un email.' });
      }

      // Si l’utilisateur n’existe pas
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      // Comparer le mot de passe en clair avec le hash en base
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Générer un token JWT (payload contient id et rôle 'user')
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
