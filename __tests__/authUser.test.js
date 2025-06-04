// __tests__/authUser.test.js

const request = require('supertest');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const app     = require('../server');                   // Votre fichier serveur qui exporte l’instance Express
const { sequelize, User } = require('../models');       // Sequelize et modèle User

/**
 * Tests des routes d’authentification utilisateur (signup & login).
 */
describe('Auth Utilisateur', () => {
  // Avant tous les tests, on reconstruit la base de test
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Après tous les tests, on ferme la connexion à la base
  afterAll(async () => {
    await sequelize.close();
  });

  const userPayload = {
    login:    'testuser',
    email:    'testuser@example.com',
    password: 'Passw0rd!',
    address_number: '12A',
    firstname: 'Alice',
    surname:   'Dupont',
    phone:     '0123456789',
    avatar:    'http://example.com/avatar.png'
  };

  describe('POST /api/auth/user/signup', () => {
    it('doit créer un nouvel utilisateur (201)', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send(userPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
      expect(res.body).toHaveProperty('user.id');
      expect(res.body.user).toMatchObject({
        login: userPayload.login,
        email: userPayload.email
      });
    });

    it('ne doit pas créer un utilisateur si login déjà pris (409)', async () => {
      // On réessaie avec le même login
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          ...userPayload,
          email: 'different@example.com'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Ce login est déjà pris.');
    });

    it('ne doit pas créer un utilisateur si email déjà utilisé (409)', async () => {
      // On réessaie avec le même email
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          ...userPayload,
          login: 'differentlogin'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Cet email est déjà utilisé.');
    });
  });

  describe('POST /api/auth/user/login', () => {
    it('doit connecter l’utilisateur existant et renvoyer un token (200)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login: userPayload.login,
          password: userPayload.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');

      // Vérifier que le token est un JWT valide
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('type', 'user');
    });

    it('ne doit pas connecter avec un mot de passe incorrect (401)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login: userPayload.login,
          password: 'WrongPassword!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Mot de passe incorrect.');
    });

    it('ne doit pas connecter un utilisateur non existant (404)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login: 'inconnu',
          password: 'AnyPass123'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Utilisateur non trouvé.');
    });

    it('doit aussi permettre la connexion par email (200)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: userPayload.email,
          password: userPayload.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');

      // Vérifier le contenu du JWT
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('type', 'user');
    });

    it('renvoie 400 si ni login ni email fourni', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ password: userPayload.password });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Vous devez fournir un login ou un email.');
    });
  });
});
