/**
 * __tests__/authRestaurant.test.js
 */

const request = require('supertest');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { app, sequelize } = require('../server');
const { Restaurant, PasswordResetToken } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

describe('Auth Restaurant', () => {
  const restaurantPayload = {
    name:           'TestBrasserie',
    company_number: 'BRASS123',
    address_number: '123 Rue Principale',
    phone:          '0123456789',
    email:          'brasserie@example.com',
    password:       'Password123',
    logo:           'https://example.com/logo.png'
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/restaurant/signup', () => {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
    });

    it('doit créer un nouveau restaurant (201)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(restaurantPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Restaurant créé avec succès.');
      expect(res.body.restaurant).toHaveProperty('id');
      expect(res.body.restaurant).toHaveProperty('name', restaurantPayload.name);
      expect(res.body.restaurant).toHaveProperty('email', restaurantPayload.email);
    });

    it('ne doit pas créer si company_number déjà pris (409)', async () => {
      await Restaurant.create({
        name:           'AutreBrasserie',
        company_number: restaurantPayload.company_number,
        address_number: '1 Avenue Secondaire',
        phone:          '0487654321',
        email:          'diff@example.com',
        password:       await bcrypt.hash('Password123', 10),
        logo:           null
      });

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send({
          ...restaurantPayload,
          company_number: restaurantPayload.company_number,
          email:          'unique@example.com'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Ce numéro d’entreprise est déjà enregistré.');
    });

    it('ne doit pas créer si email déjà utilisé (409)', async () => {
      await Restaurant.create({
        name:           'BrasserieUnique',
        company_number: 'UNIQ123',
        address_number: '2 Avenue Secondaire',
        phone:          '0571234567',
        email:          restaurantPayload.email,
        password:       await bcrypt.hash('Password123', 10),
        logo:           null
      });

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send({
          ...restaurantPayload,
          company_number: 'NEWCOMP123',
          email:          restaurantPayload.email
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Cet email est déjà utilisé.');
    });

    it('ne doit pas créer si name manquant (400)', async () => {
      const payload = { ...restaurantPayload };
      delete payload.name;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le nom est requis.');
    });

    it('ne doit pas créer si company_number manquant (400)', async () => {
      const payload = { ...restaurantPayload };
      delete payload.company_number;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le numéro d’entreprise est requis.');
    });

    it('ne doit pas créer si company_number non alphanumérique (400)', async () => {
      const payload = {
        ...restaurantPayload,
        company_number: 'COMP#123'
      };

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le numéro d’entreprise ne doit contenir que lettres et chiffres.');
    });

    it('ne doit pas créer si address_number manquant (400)', async () => {
      const payload = { ...restaurantPayload };
      delete payload.address_number;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('L’adresse est requise.');
    });

    it('ne doit pas créer si email vide (400)', async () => {
      const payload = {
        ...restaurantPayload,
        email: ''
      };

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Email invalide.');
    });

    it('ne doit pas créer si email mal formé (400)', async () => {
      const payload = {
        ...restaurantPayload,
        email: 'not-an-email'
      };

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Email invalide.');
    });

    it('ne doit pas créer si password vide (400)', async () => {
      const payload = { ...restaurantPayload };
      delete payload.password;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe est requis.');
    });

    it('ne doit pas créer si password < 8 caractères (400)', async () => {
      const payload = {
        ...restaurantPayload,
        password: 'short'
      };

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe doit contenir au moins 8 caractères.');
    });
  });

  describe('POST /api/auth/restaurant/login', () => {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      await Restaurant.create({
        name:           restaurantPayload.name,
        company_number: 'LOGIN123',
        address_number: restaurantPayload.address_number,
        phone:          restaurantPayload.phone,
        email:          restaurantPayload.email,
        password:       await bcrypt.hash(restaurantPayload.password, 10),
        logo:           null
      });
    });

    it('doit connecter le restaurant existant et renvoyer un token (200)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          company_number: 'LOGIN123',
          password:       restaurantPayload.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');
    });

    it('doit connecter le restaurant existant par email et renvoyer un token (200)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          email:    restaurantPayload.email,
          password: restaurantPayload.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');
    });

    it('ne doit pas connecter avec un mot de passe incorrect (401)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          company_number: 'LOGIN123',
          password:       'WrongPassword!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Mot de passe incorrect.');
    });

    it('ne doit pas connecter un restaurant non existant (404)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          company_number: 'INEXISTANT',
          password:       'AnyPass123'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Restaurant non trouvé.');
    });

    it('renvoie 400 si ni company_number ni email fourni (400)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({ password: restaurantPayload.password });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Le numéro d’entreprise est requis.');
    });

    it('renvoie 400 si email mal formé (400)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          email:    'not-an-email',
          password: restaurantPayload.password
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Email invalide.');
    });

    it('renvoie 400 si password manquant (400)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({ company_number: 'LOGIN123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe est requis.');
    });
  });

  describe('POST /api/auth/restaurant/logout', () => {
    let jwtToken;
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      const rest = await Restaurant.create({
        ...restaurantPayload,
        password: await bcrypt.hash(restaurantPayload.password, 10)
      });
      jwtToken = jwt.sign({ id: rest.id, type: 'restaurant' }, JWT_SECRET);
    });

    it('200 → logout invalide le token côté client (on renvoie juste 200)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/logout')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send();
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Déconnecté avec succès.');
    });

    it('401 → sans token', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/logout')
        .send();
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Token manquant ou invalide.');
    });
  });

  describe('POST /api/auth/restaurant/forgot-password', () => {
    beforeEach(() => sequelize.sync({ force: true }));

    it('200 → toujours renvoie "email envoyé" même si restaurant inexistant', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/forgot-password')
        .send({ email: 'no@no.com' });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe(
        'Si cet email existe chez nous, vous allez recevoir un lien pour réinitialiser votre mot de passe.'
      );
    });

    it('400 → email vide ou malformé', async () => {
      for (const bad of ['', 'bad@']) {
        const res = await request(app)
          .post('/api/auth/restaurant/forgot-password')
          .send({ email: bad });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toContain(
          bad === '' ? 'L’email est requis.' : 'Format d’email invalide.'
        );
      }
    });
  });

  describe('POST /api/auth/restaurant/reset-password', () => {
    let tokenRecord, rawToken, restaurant;
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      restaurant = await Restaurant.create({
        ...restaurantPayload,
        company_number: 'CPF123',
        password: await bcrypt.hash('OldPass123', 10)
      });
      rawToken     = 'random-token';
      tokenRecord  = await PasswordResetToken.create({
        restaurantId: restaurant.id,
        token:         rawToken,
        expiresAt:     new Date(Date.now() + 3600_000)
      });
    });

    it('200 → réinitialisation OK', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/reset-password')
        .send({ token: rawToken, newPassword: 'NewPass123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Mot de passe réinitialisé.');
    });

    it('400 → token ou newPassword manquant / invalide', async () => {
      const cases = [
        [{ newPassword: 'x'.repeat(8) }, 'Token requis.'],
        [{ token: rawToken },              'Le mot de passe doit contenir au moins 8 caractères.'],
        [{ token: rawToken, newPassword: 'short' }, 'Le mot de passe doit contenir au moins 8 caractères.'],
      ];
      for (const [payload, msg] of cases) {
        const res = await request(app)
          .post('/api/auth/restaurant/reset-password')
          .send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toContain(msg);
      }
    });

    it('404 → token expiré ou inexistant', async () => {
      tokenRecord.expiresAt = new Date(Date.now() - 1000);
      await tokenRecord.save();
      const res = await request(app)
        .post('/api/auth/restaurant/reset-password')
        .send({ token: rawToken, newPassword: 'NewPass123' });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Token invalide ou expiré.');
    });
  });

  describe('POST /api/auth/restaurant/change-password', () => {
    let jwtToken, rest;
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      rest = await Restaurant.create({
        ...restaurantPayload,
        password: await bcrypt.hash('OldSecret123', 10)
      });
      jwtToken = jwt.sign({ id: rest.id, type: 'restaurant' }, JWT_SECRET);
    });

    it('200 → changement de mot de passe OK', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/change-password')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ oldPassword: 'OldSecret123', newPassword: 'NewSecret123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Mot de passe changé avec succès.');
    });

    it('401 → ancien mot de passe incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/change-password')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ oldPassword: 'Wrong', newPassword: 'NewSecret123' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Ancien mot de passe incorrect.');
    });

    it('400 → validations manquantes', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/change-password')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ oldPassword: '', newPassword: 'short' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          'L’ancien mot de passe est requis.',
          'Le nouveau mot de passe doit contenir au moins 8 caractères.'
        ])
      );
    });

    // Test de sécurité supplémentaire (optionnel)
    it('403 → un restaurant ne peut pas changer le mot de passe d’un autre', async () => {
      // Crée un autre restaurant et un token pour lui
      const otherRest = await Restaurant.create({
        ...restaurantPayload,
        email: 'other@example.com',
        company_number: 'OTHER123',
        password: await bcrypt.hash('OtherPass123', 10)
      });
      const otherToken = jwt.sign({ id: otherRest.id, type: 'restaurant' }, JWT_SECRET);

      // Essaye de changer le mot de passe du premier restaurant avec le token du second
      const res = await request(app)
        .post('/api/auth/restaurant/change-password')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ oldPassword: 'OldSecret123', newPassword: 'NewSecret123' });

      // Selon ta logique métier, adapte le code et le message
      expect([401, 403, 404]).toContain(res.statusCode);
    });
  });
});