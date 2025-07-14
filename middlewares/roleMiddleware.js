// middlewares/roleMiddleware.js

module.exports.requireRole = (role) => (req, res, next) => {
  if (req.userType !== role) {
    return res.status(403).json({ error: `Accès interdit : Vous n'étes pas un ${role}.` });
  }
  next();
};
