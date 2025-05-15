const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

module.exports = (roles = []) => {
  return (req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({ error:'Token manquant' });
    try{
      const decoded = jwt.verify(token, JWT_SECRET);
      if(roles.length && !roles.includes(decoded.role)) throw new Error('Accès refusé');
      req.user = decoded;
      next();
    }catch(e){ return res.status(401).json({ error:'Token invalide' }); }
  };
};
