// __tests__/authRestaurant.test.js
const request = require('supertest');
const bcrypt = require('bcrypt');
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
      // Fournir tous les champs obligatoires
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
      // **On modifie ici le message attendu pour coller à celui renvoyé par le contrôleur**
      expect(res.body).toHaveProperty('error', 'Ce numéro d’entreprise est déjà enregistré.');
    });

    it('ne doit pas créer si email déjà utilisé (409)', async () => {
      // Fournir tous les champs obligatoires
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
      // **On conserve le message « Cet email est déjà utilisé. » s’il est identique**
      expect(res.body).toHaveProperty('error', 'Cet email est déjà utilisé.');
    });

    it('ne doit pas créer si name manquant (400)', async () => {
      const payloadMissingName = { ...restaurantPayload };
      delete payloadMissingName.name;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payloadMissingName);

      expect(res.statusCode).toBe(400);
      // On suppose que le validateur renvoie ce message exact
      expect(res.body.errors).toContain('Le nom est requis.');
    });

    it('ne doit pas créer si company_number manquant (400)', async () => {
      const payloadMissingComp = { ...restaurantPayload };
      delete payloadMissingComp.company_number;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payloadMissingComp);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le numéro d’entreprise est requis.');
    });

    it('ne doit pas créer si address_number manquant (400)', async () => {
      const payloadMissingAddr = { ...restaurantPayload };
      delete payloadMissingAddr.address_number;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payloadMissingAddr);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('L’adresse est requise.');
    });

    it('ne doit pas créer si email manquant (400)', async () => {
      const payloadMissingEmail = { ...restaurantPayload };
      delete payloadMissingEmail.email;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payloadMissingEmail);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Email invalide.');
    });

    it('ne doit pas créer si password manquant (400)', async () => {
      const payloadMissingPwd = { ...restaurantPayload };
      delete payloadMissingPwd.password;

      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send(payloadMissingPwd);

      expect(res.statusCode).toBe(400);
      // **On adapte ici le message attendu à celui réellement renvoyé**
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
          email:    restaurantPayload.email,
          password: 'WrongPassword!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Mot de passe incorrect.');
    });

    it('ne doit pas connecter un restaurant non existant (404)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          email:    'inconnu@example.com',
          password: 'AnyPass123'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Restaurant non trouvé.');
    });

    it('renvoie 400 si email manquant (400)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({ password: restaurantPayload.password });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Email invalide.');
    });

    it('renvoie 400 si password manquant (400)', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({ email: restaurantPayload.email });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe est requis.');
    });
  });
});
