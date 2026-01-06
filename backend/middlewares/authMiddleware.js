// backend/middleware/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => 
   {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ error: 'Token manquant.' });
      }

      // Format attendu : "Bearer <token>"
      const tokenParts = authHeader.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Format d’Authorization invalide.' });
      }

      const token = tokenParts[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          return res.status(401).json({ error: 'Token invalide ou expiré.' });
        }
        req.userId   = payload.id;
        req.userType = payload.userType || payload.type; // <-- accepte les deux
        next();
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur interne (vérification token).' });
    }
  
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: 'Accès interdit : admin only.' });
  }
  next();
};
