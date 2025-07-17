const request = require('supertest');
const { app } = require('../server');
const { City, Country } = require('../models');
const jwt = require('jsonwebtoken');

let token, country;

beforeAll(async () => {
  country = await Country.findOne({ where: { name: 'France' } });

  // Génère un token restaurant pour les tests POST
  token = jwt.sign(
    { id: 1, type: 'restaurant' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
});

describe('City API', () => {
  describe('POST /api/cities', () => {
    it('crée une ville avec succès', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Paris', postal_code: '75001', countryId: country.id });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Paris');
      expect(res.body).toHaveProperty('postal_code', '75001');
      expect(res.body).toHaveProperty('countryId', country.id);
    });

    it('ne crée pas une ville sans nom', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ postal_code: '69000', countryId: country.id });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors).toContain('Le nom de la ville est requis.');
    });

    it('ne crée pas une ville sans code postal', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Lyon', countryId: country.id });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors).toContain('Le code postal de la ville est requis.');
    });

    it('ne crée pas une ville sans countryId', async () => {
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Marseille', postal_code: '13000' });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors).toContain('Le pays est requis.');
    });

    it('refuse la création sans token', async () => {
      const res = await request(app)
        .post('/api/cities')
        .send({ name: 'Nice', postal_code: '06000', countryId: country.id });
      expect(res.statusCode).toBe(401);
    });

    it('refuse la création avec un mauvais rôle', async () => {
      const userToken = jwt.sign(
        { id: 2, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      const res = await request(app)
        .post('/api/cities')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Toulouse', postal_code: '31000', countryId: country.id });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/cities/country/:countryId', () => {
    it('retourne toutes les villes d\'un pays', async () => {
      await City.create({ name: 'Lille', postal_code: '59000', countryId: country.id });
      const res = await request(app)
        .get(`/api/cities/country/${country.id}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some(c => c.name === 'Paris')).toBe(true);
      expect(res.body.some(c => c.name === 'Lille')).toBe(true);
    });
  });

  describe('GET /api/cities/:id', () => {
    it('retourne une ville par ID', async () => {
      const paris = await City.findOne({ where: { name: 'Paris' } });
      const res = await request(app)
        .get(`/api/cities/${paris.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', paris.id);
      expect(res.body).toHaveProperty('name', 'Paris');
    });

    it('retourne 404 si la ville n\'existe pas', async () => {
      const res = await request(app)
        .get('/api/cities/9999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Ville non trouvée.');
    });
  });
});