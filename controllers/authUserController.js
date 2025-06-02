const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User } = require('../models'); // selon ton index des modèles

module.exports = {
  async signup(req, res) {
    try {
      const { login, email, password, address_number, firstname, surname, phone, avatar } = req.body;

      // Vérifier qu’aucun user n’existe déjà avec le même login ou email
      const existLogin = await User.findOne({ where: { login } });
      if (existLogin) {
        return res.status(409).json({ error: 'Ce login est déjà pris.' });
      }
      const existEmail = await User.findOne({ where: { email } });
      if (existEmail) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }

      // Hasher le mot de passe
      const hash = await bcrypt.hash(password, 10);

      // Créer l’utilisateur
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

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Vérifier que l’email existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      // Comparer le mot de passe
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Générer un token JWT (payload contient id et type)
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
