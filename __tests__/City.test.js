const request = require('supertest');
const { app } = require('../server');
const { City, Country } = require('../models');
const jwt = require('jsonwebtoken');

let token, country;

beforeEach(async () => {
  // Nettoyage ciblé des tables concernées
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });

  // Création des entités nécessaires pour les tests
  country = await Country.create({ name: 'France', iso_code: 'FR' });

  token = jwt.sign(
    { id: 1, type: 'restaurant' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
});

describe('City API', () => {
  it('crée une ville', async () => {
    const res = await request(app)
      .post('/api/cities')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Paris', postal_code: '75001', countryId: country.id });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Paris');
    expect(res.body.postal_code).toBe('75001');
    expect(res.body.countryId).toBe(country.id);
  });

  it('liste toutes les villes d\'un pays', async () => {
    await City.create({ name: 'Paris', postal_code: '75001', countryId: country.id });
    await City.create({ name: 'Lyon', postal_code: '69001', countryId: country.id });
    const res = await request(app).get(`/api/cities/country/${country.id}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body.some(c => c.name === 'Paris')).toBe(true);
    expect(res.body.some(c => c.name === 'Lyon')).toBe(true);
  });

  it('récupère une ville par id', async () => {
    const city = await City.create({ name: 'Marseille', postal_code: '13000', countryId: country.id });
    const res = await request(app).get(`/api/cities/${city.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Marseille');
    expect(res.body).toHaveProperty('postal_code', '13000');
  });

  it('retourne 404 si la ville n\'existe pas', async () => {
    const res = await request(app).get('/api/cities/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('refuse la création sans nom', async () => {
    const res = await request(app)
      .post('/api/cities')
      .set('Authorization', `Bearer ${token}`)
      .send({ postal_code: '69000', countryId: country.id });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('Le nom de la ville est requis.');
  });

  it('refuse la création sans code postal', async () => {
    const res = await request(app)
      .post('/api/cities')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Lyon', countryId: country.id });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('Le code postal de la ville est requis.');
  });

  it('refuse la création sans countryId', async () => {
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
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
    const res = await request(app)
      .post('/api/cities')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Toulouse', postal_code: '31000', countryId: country.id });
    expect(res.statusCode).toBe(403);
  });
});