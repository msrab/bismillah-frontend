/**
 * __tests__/country.test.js
 *
 * Tests des routes Country (création, liste, détail).
 */

const request    = require('supertest');
const jwt        = require('jsonwebtoken');
const { app, sequelize } = require('../server');
const { Country, Restaurant } = require('../models');

describe('Routes Country', () => {
  let token;

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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/countries', () => {
    beforeEach(async () => {
      await Country.destroy({ where: {} });
    });

    it('devrait créer un pays (201)', async () => {
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'France' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'France');
    });

    it('ne doit pas créer si name manquant (400)', async () => {
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le nom du pays est requis.');
    });

    it('ne doit pas créer si pays déjà existant (200)', async () => {
      await Country.create({ name: 'France' });
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'France' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'France');
    });

    it('devrait renvoyer 401 si pas de token', async () => {
      const res = await request(app)
        .post('/api/countries')
        .send({ name: 'France' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/countries', () => {
    beforeAll(async () => {
      await Country.destroy({ where: {} });
      await Country.bulkCreate([
        { name: 'France' },
        { name: 'Belgique' },
        { name: 'Allemagne' }
      ]);
    });

    it('devrait renvoyer la liste des pays', async () => {
      const res = await request(app)
        .get('/api/countries');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      expect(res.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/countries/:id', () => {
    let france;
    beforeAll(async () => {
      france = await Country.create({ name: 'France' });
    });

    it('devrait renvoyer un pays existant', async () => {
      const res = await request(app)
        .get(`/api/countries/${france.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', france.id);
      expect(res.body).toHaveProperty('name', 'France');
    });

    it('devrait renvoyer 404 si aucun pays avec cet ID', async () => {
      const res = await request(app)
        .get('/api/countries/9999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Pays non trouvé.');
    });
  });
});