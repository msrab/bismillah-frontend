const request = require('supertest');
const { app } = require('../server');
const { Country } = require('../models');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
  token = jwt.sign(
    { id: 1, type: 'restaurant' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
});

describe('Country API', () => {
  describe('POST /api/countries', () => {
    it('crée un pays avec succès', async () => {
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Luxembourg', iso_code: 'LU' });
      expect(res.body).toHaveProperty('name', 'Luxembourg');
      expect(res.body).toHaveProperty('iso_code', 'LU');
    });

    it('ne crée pas un pays sans nom', async () => {
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({ iso_code: 'BE' });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors).toContain('Le nom du pays est requis.');
    });

    it('ne crée pas un pays sans iso_code', async () => {
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Belgique' });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors).toContain('Le code ISO du pays est requis.');
    });

    it('ne crée pas un pays avec un iso_code déjà existant', async () => {
      
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Confédération Suisse', iso_code: 'CH' });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.some(e => e.includes('déjà utilisé'))).toBe(true);
    });

    it('refuse la création sans token', async () => {
      const res = await request(app)
        .post('/api/countries')
        .send({ name: 'Espagne', iso_code: 'ES' });
      expect(res.statusCode).toBe(401);
    });

    it('refuse la création avec un mauvais rôle', async () => {
      const userToken = jwt.sign(
        { id: 2, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      const res = await request(app)
        .post('/api/countries')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Italie', iso_code: 'IT' });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/countries', () => {
    it('retourne tous les pays', async () => {
      const res = await request(app)
        .get('/api/countries');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Vérifie que les pays créés existent dans la liste
      expect(res.body.some(c => c.name === 'France')).toBe(true);
      expect(res.body.some(c => c.name === 'Belgique')).toBe(true);
      expect(res.body.some(c => c.iso_code === 'FR')).toBe(true);
      expect(res.body.some(c => c.iso_code === 'BE')).toBe(true);
    });
  });

  describe('GET /api/countries/:id', () => {
    it('retourne un pays par ID', async () => {
      const france = await Country.findOne({ where: { name: 'France' } });
      const res = await request(app)
        .get(`/api/countries/${france.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', france.id);
      expect(res.body).toHaveProperty('name', 'France');
      expect(res.body).toHaveProperty('iso_code', 'FR');
    });

    it('retourne 404 si le pays n\'existe pas', async () => {
      const res = await request(app)
        .get('/api/countries/9999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Pays non trouvé.');
    });
  });
});