/**
 * __tests__/city.test.js
 *
 * Tests des routes City (création, liste, détail).
 */

const request    = require('supertest');
const jwt        = require('jsonwebtoken');
const { app, sequelize } = require('../server');
const { City, Country, Restaurant } = require('../models');

describe('Routes City', () => {
  let token, country;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Crée un restaurant pour générer un token
    const rest = await Restaurant.create({
      name:           'MainBrasserie',
      company_number: 'MAIN123',
      address_number: '1 Rue Principale',
      email:          'main@ex.com',
      password:       'Password123',
      phone:          null,
      logo:           null
    });

    token = jwt.sign(
      { id: rest.id, type: 'restaurant' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Crée un pays pour les tests de ville
    country = await Country.create({ name: 'France' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/cities', () => {
    beforeEach(async () => {
      await City.destroy({ where: {} });
    });

    it('devrait créer une ville (201)', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Paris', countryId: country.id });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Paris');
      expect(res.body).toHaveProperty('countryId', country.id);
    });

    it('ne doit pas créer si name manquant (400)', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ countryId: country.id });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le nom de la ville est requis.');
    });

    it('ne doit pas créer si countryId manquant (400)', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Paris' });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('countryId doit être un entier.');
    });

    it('ne doit pas créer si ville déjà existante (200)', async () => {
      await City.create({ name: 'Paris', countryId: country.id });
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Paris', countryId: country.id });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Paris');
    });

    it('devrait renvoyer 401 si pas de token', async () => {
      const res = await request(app)
        .post('/api/cities')
        .send({ name: 'Paris', countryId: country.id });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/cities', () => {
    beforeAll(async () => {
      await City.destroy({ where: {} });
      await City.bulkCreate([
        { name: 'Paris', countryId: country.id },
        { name: 'Lyon', countryId: country.id },
        { name: 'Marseille', countryId: country.id }
      ]);
    });

    it('devrait renvoyer la liste des villes', async () => {
      const res = await request(app)
        .get('/api/cities');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('countryId', country.id);
    });
  });

  describe('GET /api/cities/:id', () => {
    let paris;
    beforeAll(async () => {
      paris = await City.create({ name: 'Paris', countryId: country.id });
    });

    it('devrait renvoyer une ville existante', async () => {
      const res = await request(app)
        .get(`/api/cities/${paris.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', paris.id);
      expect(res.body).toHaveProperty('name', 'Paris');
      expect(res.body).toHaveProperty('countryId', country.id);
    });

    it('devrait renvoyer 404 si aucune ville avec cet ID', async () => {
      const res = await request(app)
        .get('/api/cities/9999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Ville non trouvée.');
    });
  });
});