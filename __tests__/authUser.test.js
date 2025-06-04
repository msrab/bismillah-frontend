// __tests__/authUser.test.js
const request = require('supertest');
const { app, sequelize } = require('../server');
const { User } = require('../models');
const bcrypt = require('bcrypt');

describe('Auth Utilisateur', () => {
  const userPayload = {
    login: 'testuser',
    email: 'testuser@example.com',
    password: 'Passw0rd!',
    address_number: '123',
    firstname: 'Jean',
    surname: 'Dupont',
    phone: '0123456789',
    avatar: null
  };

  beforeAll(async () => {
    // Vérifie qu'on peut se connecter à la base de test
    await sequelize.authenticate();
  });

  afterAll(async () => {
    // Ferme la connexion Sequelize après tous les tests
    await sequelize.close();
  });

  describe('POST /api/auth/user/signup', () => {
    beforeEach(async () => {
      // Vide et recrée la table "users" avant chaque test
      await sequelize.sync({ force: true });
    });

    it('doit créer un nouvel utilisateur (201)', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send(userPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toMatchObject({
        login: userPayload.login,
        email: userPayload.email
      });
    });

    it('ne doit pas créer un utilisateur si login déjà pris (409)', async () => {
      // Crée manuellement un user avec le même login
      const hash = await bcrypt.hash(userPayload.password, 10);
      await User.create({
        login: userPayload.login,
        email: 'autrediff@example.com',
        password: hash
      });

      // Tentative de signup avec login dupliqué
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: userPayload.login,
          email: 'nouvel@example.com',
          password: 'AutrePass1!'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Ce login est déjà pris.');
    });

    it('ne doit pas créer un utilisateur si email déjà utilisé (409)', async () => {
      // Crée manuellement un user avec le même email
      const hash = await bcrypt.hash(userPayload.password, 10);
      await User.create({
        login: 'autrelogin',
        email: userPayload.email,
        password: hash
      });

      // Tentative de signup avec email dupliqué
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveaulogin',
          email: userPayload.email,
          password: 'AutrePass1!'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Cet email est déjà utilisé.');
    });

    it('ne doit pas créer si login est vide (400)', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: '',
          email: 'nouveau@example.com',
          password: 'SomePass123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('ne doit pas créer si email est vide (400)', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveaulogin',
          email: '',
          password: 'SomePass123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('ne doit pas créer si password est vide (400)', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveaulogin',
          email: 'nouveau@example.com',
          password: ''
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/user/login', () => {
    beforeEach(async () => {
      // Vide et recrée la table puis crée un user valide
      await sequelize.sync({ force: true });
      const hash = await bcrypt.hash(userPayload.password, 10);
      await User.create({
        login: userPayload.login,
        email: userPayload.email,
        password: hash
      });
    });

    it('doit connecter l’utilisateur existant et renvoyer un token (200)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ login: userPayload.login, password: userPayload.password });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');
    });

    it('ne doit pas connecter avec un mot de passe incorrect (401)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ login: userPayload.login, password: 'WrongPass!' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Mot de passe incorrect.');
    });

    it('ne doit pas connecter un utilisateur non existant (404)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ login: 'inconnu', password: 'AnyPass123' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Utilisateur non trouvé.');
    });

    it('doit aussi permettre la connexion par email (200)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ email: userPayload.email, password: userPayload.password });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');
    });

    it('renvoie 400 si ni login ni email fourni', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ password: userPayload.password }); // ni login ni email

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Login ou email requis.');
    });
  });
});
