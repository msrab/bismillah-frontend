const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token manquant.' });

    // Format attendu : "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Format d’autorisation invalide.' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.id;      // id de l’utilisateur ou restaurant
      req.userType = payload.type;  // "user" ou "restaurant"
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token invalide ou expiré.' });
    }
  }
};
