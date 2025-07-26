const request = require('supertest');
const { app } = require('../server');
const { Street, City, Country } = require('../models');
const jwt = require('jsonwebtoken');

let token, country, city;

beforeEach(async () => {
  // Nettoyage ciblé des tables concernées
  await Street.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });

  // Création des entités nécessaires pour les tests
  country = await Country.create({ name: 'France', iso_code: 'FR' });
  city = await City.create({ name: 'Paris', postal_code: '75000', countryId: country.id });

  token = jwt.sign(
    { id: 1, type: 'restaurant' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
});

describe('Street API', () => {
  it('crée une rue avec succès', async () => {
    const res = await request(app)
      .post('/api/streets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Rue de Rivoli', cityId: city.id });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Rue de Rivoli');
    expect(res.body).toHaveProperty('cityId', city.id);
  });

  it('liste toutes les rues d\'une ville', async () => {
    await Street.create({ name: 'Rue de Rivoli', cityId: city.id });
    await Street.create({ name: 'Avenue de l\'Opéra', cityId: city.id });
    const res = await request(app).get(`/api/streets/city/${city.id}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body.some(s => s.name === 'Rue de Rivoli')).toBe(true);
    expect(res.body.some(s => s.name === 'Avenue de l\'Opéra')).toBe(true);
  });

  it('récupère une rue par id', async () => {
    const street = await Street.create({ name: 'Boulevard Saint-Germain', cityId: city.id });
    const res = await request(app).get(`/api/streets/${street.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Boulevard Saint-Germain');
    expect(res.body).toHaveProperty('cityId', city.id);
  });

  it('retourne 404 si la rue n\'existe pas', async () => {
    const res = await request(app).get('/api/streets/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('refuse la création sans nom', async () => {
    const res = await request(app)
      .post('/api/streets')
      .set('Authorization', `Bearer ${token}`)
      .send({ cityId: city.id });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('Le nom de la rue est requis.');
  });

  it('refuse la création sans cityId', async () => {
    const res = await request(app)
      .post('/api/streets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Avenue des Champs-Élysées' });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('cityId doit être un entier.');
  });

  it('refuse la création sans token', async () => {
    const res = await request(app)
      .post('/api/streets')
      .send({ name: 'Boulevard Saint-Germain', cityId: city.id });
    expect(res.statusCode).toBe(401);
  });

  it('refuse la création avec un mauvais rôle', async () => {
    const userToken = jwt.sign(
      { id: 2, type: 'user' },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
    const res = await request(app)
      .post('/api/streets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Rue de la Paix', cityId: city.id });
    expect(res.statusCode).toBe(403);
  });
});