/**
 * __tests__/authRestaurant.test.js
 *
 * Scénarios testés (selon VALIDATIONS.md) :
 *
 * 1. POST /api/auth/restaurant/signup
 *    - 201 si ok (name, company_number, address_number, email, password valides)
 *    - 409 si company_number déjà pris            ⇒ “Ce numéro d’entreprise est déjà enregistré.”
 *    - 409 si email déjà utilisé                   ⇒ “Cet email est déjà utilisé.”
 *    - 400 si name vide                            ⇒ “Le nom est requis.”
 *    - 400 si company_number vide                  ⇒ “Le numéro d’entreprise est requis.”
 *    - 400 si company_number non alphanumérique    ⇒ “Le numéro d’entreprise ne doit contenir que lettres et chiffres.”
 *    - 400 si address_number vide                  ⇒ “L’adresse est requise.”
 *    - 400 si email vide ou mal formé               ⇒ “Email invalide.”
 *    - 400 si password vide                        ⇒ “Le mot de passe est requis.”
 *    - 400 si password < 8 caractères               ⇒ “Le mot de passe doit contenir au moins 8 caractères.”
 *
 * 2. POST /api/auth/restaurant/login
 *    - 200 si company_number+password corrects     ⇒ { message: 'Connexion réussie.', token: <jwt> }
 *    - 200 si email+password corrects              ⇒ même réponse
 *    - 401 si mot de passe incorrect               ⇒ “Mot de passe incorrect.”
 *    - 404 si restaurant non existant              ⇒ “Restaurant non trouvé.”
 *    - 400 si ni company_number ni email fourni    ⇒ “Le numéro d’entreprise est requis.”
 *    - 400 si email mal formé                      ⇒ “Email invalide.”
 *    - 400 si password vide                        ⇒ “Le mot de passe est requis.”
 */

const request = require('supertest');
const bcrypt  = require('bcrypt');
const { app, sequelize } = require('../server');
const { Restaurant } = require('../models');

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
    // Rebuild de la base test
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
      // Insérer manuellement un restaurant pour provoquer le conflit
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
      expect(res.body).toHaveProperty(
        'error',
        'Ce numéro d’entreprise est déjà enregistré.'
      );
    });

    it('ne doit pas créer si email déjà utilisé (409)', async () => {
      // Insérer un restaurant avec le même email
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
      expect(res.body.errors).toContain(
        'Le numéro d’entreprise ne doit contenir que lettres et chiffres.'
      );
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
      expect(res.body.errors).toContain(
        'Le mot de passe doit contenir au moins 8 caractères.'
      );
    });
  });

  describe('POST /api/auth/restaurant/login', () => {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      // Crée un restaurant existant pour tester la connexion
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
        // Teste connexion PAR company_number OU PAR email : ici on teste par company_number
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
      expect(res.body).toHaveProperty(
        'error',
        'Le numéro d’entreprise est requis.'
      );
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
});
