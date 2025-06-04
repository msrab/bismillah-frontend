// __tests__/authUser.test.js
const request = require('supertest');
const { app, sequelize } = require('../server');
const { User } = require('../models');

describe('Auth Utilisateur', () => {
  const userPayload = {
    login: 'testuser',
    email: 'test@example.com',
    password: 'Password123'
    // pas d’address_number, firstname, etc.
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/user/signup – Validation express-validator', () => {
    it('renvoie 400 si login est vide', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: '',
          email: 'ok@example.com',
          password: 'Password123'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le login est requis.');
    });

    it('renvoie 400 si email malformé', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: 'not-an-email',
          password: 'Password123'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Email invalide.');
    });

    it('renvoie 400 si password < 8 caractères', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: 'ok2@example.com',
          password: 'short'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe doit contenir au moins 8 caractères.');
    });

    // les autres tests existants (“login déjà pris”, “email déjà utilisé”, “création OK”) restent valides
  });

  describe('POST /api/auth/user/login – Validation express-validator', () => {
    it('renvoie 400 si ni login ni email fourni', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Login ou email requis.');
    });

    it('renvoie 400 si password non fourni', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ login: 'testuser' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe est requis.');
    });

    // etc.
  });
});
