const request = require('supertest');
const { app } = require('../server');
const { User, Street, Language } = require('../models');
const bcrypt = require('bcrypt');

let street;
let language;

beforeAll(async () => {
  await User.destroy({ where: {} });
  street = await Street.findOne({ where: { name: 'Rue de Rivoli' } });
  language = await Language.findOne({ where: { name: 'Français' } });
});

describe('Auth User', () => {
  describe('POST /api/auth/user/signup', () => {
    it('crée un utilisateur avec succès', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'user1',
          email: 'user1@example.com',
          password: 'Password123!',
          address_number: '10',
          firstname: 'Jean',
          surname: 'Dupont',
          phone: '0600000000',
          streetId: street.id,
          languageId: language.id
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('login', 'user1');
      expect(res.body.user.street).toHaveProperty('id', street.id);
      expect(res.body.user.language).toHaveProperty('id', language.id);
    });

    it('refuse un login déjà pris', async () => {
      await User.create({
        login: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('Password123!', 10),
        address_number: '11',
        streetId: street.id,
        languageId: language.id
      });
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'user2',
          email: 'unique@example.com',
          password: 'Password123!',
          address_number: '12',
          streetId: street.id,
          languageId: language.id
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.errors || res.body.error).toContain('Ce login est déjà pris.');
    });

    it('refuse un email déjà utilisé', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'uniqueuser',
          email: 'user2@example.com',
          password: 'Password123!',
          address_number: '13',
          streetId: street.id,
          languageId: language.id
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.errors || res.body.error).toContain('Cet email est déjà utilisé.');
    });

    it('refuse si champs obligatoires manquants', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe('POST /api/auth/user/login', () => {
    it('connecte avec login', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login: 'user1',
          password: 'Password123!'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('login', 'user1');
      expect(res.body.user.street).toHaveProperty('id', street.id);
      expect(res.body.user.language).toHaveProperty('id', language.id);
    });

    it('connecte avec email', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: 'user1@example.com',
          password: 'Password123!'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'user1@example.com');
      expect(res.body.user.street).toHaveProperty('id', street.id);
      expect(res.body.user.language).toHaveProperty('id', language.id);
    });

    it('refuse connexion mauvais mot de passe', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login: 'user1',
          password: 'WrongPassword!'
        });
      expect(res.statusCode).toBe(401);
      expect(res.body.errors || res.body.error).toContain('Mot de passe incorrect.');
    });

    it('refuse connexion user inconnu', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login: 'inconnu',
          password: 'Password123!'
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.errors || res.body.error).toContain('Utilisateur non trouvé.');
    });
  });
});