/**
 * __tests__/street.test.js
 *
 * Tests des routes Street (création, liste, détail).
 */

const request    = require('supertest');
const jwt        = require('jsonwebtoken');
const { app, sequelize } = require('../server');
const { Street, City, Country, Restaurant } = require('../models');

describe('Routes Street', () => {
  let token, country, city;

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

    // Crée un pays et une ville pour les tests de rue
    country = await Country.create({ name: 'France' });
    city    = await City.create({ name: 'Paris', countryId: country.id });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/streets', () => {
    beforeEach(async () => {
      await Street.destroy({ where: {} });
    });

    it('devrait créer une rue (201)', async () => {
      const res = await request(app)
        .post('/api/streets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Rue de Rivoli', cityId: city.id });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Rue de Rivoli');
      expect(res.body).toHaveProperty('cityId', city.id);
    });

    it('ne doit pas créer si name manquant (400)', async () => {
      const res = await request(app)
        .post('/api/streets')
        .set('Authorization', `Bearer ${token}`)
        .send({ cityId: city.id });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le nom de la rue est requis.');
    });

    it('ne doit pas créer si cityId manquant (400)', async () => {
      const res = await request(app)
        .post('/api/streets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Rue de Rivoli' });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('cityId doit être un entier.');
    });

    it('ne doit pas créer si rue déjà existante (200)', async () => {
      await Street.create({ name: 'Rue de Rivoli', cityId: city.id });
      const res = await request(app)
        .post('/api/streets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Rue de Rivoli', cityId: city.id });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Rue de Rivoli');
    });

    it('devrait renvoyer 401 si pas de token', async () => {
      const res = await request(app)
        .post('/api/streets')
        .send({ name: 'Rue de Rivoli', cityId: city.id });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/streets', () => {
    beforeAll(async () => {
      await Street.destroy({ where: {} });
      await Street.bulkCreate([
        { name: 'Rue de Rivoli', cityId: city.id },
        { name: 'Boulevard Saint-Michel', cityId: city.id },
        { name: 'Avenue des Champs-Élysées', cityId: city.id }
      ]);
    });

    it('devrait renvoyer la liste des rues', async () => {
      const res = await request(app)
        .get('/api/streets');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('cityId', city.id);
    });
  });

  describe('GET /api/streets/:id', () => {
    let rivoli;
    beforeAll(async () => {
      rivoli = await Street.create({ name: 'Rue de Rivoli', cityId: city.id });
    });

    it('devrait renvoyer une rue existante', async () => {
      const res = await request(app)
        .get(`/api/streets/${rivoli.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', rivoli.id);
      expect(res.body).toHaveProperty('name', 'Rue de Rivoli');
      expect(res.body).toHaveProperty('cityId', city.id);
    });

    it('devrait renvoyer 404 si aucune rue avec cet ID', async () => {
      const res = await request(app)
        .get('/api/streets/9999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Rue non trouvée.');
    });
  });
});