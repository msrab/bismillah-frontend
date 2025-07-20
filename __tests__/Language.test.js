const request = require('supertest');
const { app } = require('../server');
const { Language, sequelize } = require('../models');

describe('Language API', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let languageId;

  it('crée une langue', async () => {
    const res = await request(app)
      .post('/api/languages')
      .send({ name: 'Español', icon: '🇪🇸' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Español');
    expect(res.body.icon).toBe('🇪🇸');
    languageId = res.body.id;
  });

  it('liste toutes les langues', async () => {
    const res = await request(app)
      .get('/api/languages');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(l => l.name === 'Español')).toBe(true);
  });

  it('récupère une langue par id', async () => {
    const res = await request(app)
      .get(`/api/languages/${languageId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Español');
  });

  it('modifie une langue', async () => {
    const res = await request(app)
      .put(`/api/languages/${languageId}`)
      .send({ name: 'Espagnol', icon: '🇪🇸' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Espagnol');
  });

  it('retourne 404 si la langue n\'existe pas', async () => {
    const res = await request(app)
      .get('/api/languages/99999');
    expect(res.statusCode).toBe(404);
  });
});