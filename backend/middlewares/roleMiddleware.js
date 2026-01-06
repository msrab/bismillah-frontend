// middlewares/roleMiddleware.js

module.exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userType)) {
    return res.status(403).json({ error: `Accès interdit.` });
  }
  next();
};
