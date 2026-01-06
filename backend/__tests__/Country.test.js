const request = require('supertest');
const { app } = require('../server');
const { Country } = require('../models');
const jwt = require('jsonwebtoken');

let token;

beforeEach(async () => {
  // Nettoyage ciblé de la table concernée
  await Country.destroy({ where: {} });

  token = jwt.sign(
    { id: 1, type: 'restaurant' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
});

describe('Country API', () => {
  it('crée un pays', async () => {
    const res = await request(app)
      .post('/api/countries')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'France', iso_code: 'FR' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('France');
    expect(res.body.iso_code).toBe('FR');
  });

  it('liste tous les pays', async () => {
    await Country.create({ name: 'France', iso_code: 'FR' });
    await Country.create({ name: 'Belgique', iso_code: 'BE' });
    const res = await request(app).get('/api/countries');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body.some(c => c.name === 'France')).toBe(true);
    expect(res.body.some(c => c.name === 'Belgique')).toBe(true);
  });

  it('récupère un pays par id', async () => {
    const country = await Country.create({ name: 'Suisse', iso_code: 'CH' });
    const res = await request(app).get(`/api/countries/${country.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Suisse');
    expect(res.body).toHaveProperty('iso_code', 'CH');
  });

  it('retourne 404 si le pays n\'existe pas', async () => {
    const res = await request(app).get('/api/countries/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('refuse la création sans nom', async () => {
    const res = await request(app)
      .post('/api/countries')
      .set('Authorization', `Bearer ${token}`)
      .send({ iso_code: 'ES' });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('Le nom du pays est requis.');
  });

  it('refuse la création sans iso_code', async () => {
    const res = await request(app)
      .post('/api/countries')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Espagne' });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('Le code ISO du pays est requis.');
  });

  it('refuse la création avec un iso_code déjà existant', async () => {
    await Country.create({ name: 'France', iso_code: 'FR' });
    const res = await request(app)
      .post('/api/countries')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Autre France', iso_code: 'FR' });
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
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
    const res = await request(app)
      .post('/api/countries')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Italie', iso_code: 'IT' });
    expect(res.statusCode).toBe(403);
  });
});