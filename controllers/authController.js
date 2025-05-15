const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { User, Restaurant } = require('../models');   // ← grâce à models/index.js

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const TOKEN_EXP  = '7d';

// factorise la création de token
function signToken(payload){ return jwt.sign(payload, JWT_SECRET, { expiresIn:TOKEN_EXP }); }

// ---------- SIGN-UP ----------
exports.signupUser = async (req,res) => {
  try{
    const { login,email,password,...rest } = req.body;
    const hash = await bcrypt.hash(password,10);
    const user = await User.create({ login,email,password:hash, ...rest });
    return res.status(201).json({ message:'Utilisateur créé', user });
  }catch(e){ return res.status(400).json({ error:e.message }); }
};

exports.signupRestaurant = async (req,res) => {
  try{
    const { name,company_number,email,password,...rest } = req.body;
    const hash = await bcrypt.hash(password,10);
    const restaurant = await Restaurant.create({ name,company_number,email,password:hash, ...rest });
    return res.status(201).json({ message:'Restaurant créé', restaurant });
  }catch(e){ return res.status(400).json({ error:e.message }); }
};

// ---------- LOGIN ----------
exports.loginUser = async (req,res) => {
  try{
    const { email,password } = req.body;
    const user = await User.findOne({ where:{ email } });
    if(!user) return res.status(404).json({ error:'Utilisateur introuvable' });

    const ok = await bcrypt.compare(password,user.password);
    if(!ok)   return res.status(401).json({ error:'Mot de passe incorrect' });

    const token = signToken({ id:user.id, role:'user' });
    return res.json({ message:'Connexion réussie', token });
  }catch(e){ return res.status(500).json({ error:e.message }); }
};

exports.loginRestaurant = async (req,res) => {
  try{
    const { email,password } = req.body;
    const resto = await Restaurant.findOne({ where:{ email } });
    if(!resto) return res.status(404).json({ error:'Restaurant introuvable' });

    const ok = await bcrypt.compare(password,resto.password);
    if(!ok)   return res.status(401).json({ error:'Mot de passe incorrect' });

    const token = signToken({ id:resto.id, role:'restaurant' });
    return res.json({ message:'Connexion réussie', token });
  }catch(e){ return res.status(500).json({ error:e.message }); }
};
