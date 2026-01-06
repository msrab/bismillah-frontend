const request = require('supertest');
const { app } = require('../server');
const { Language } = require('../models');

beforeEach(async () => {
  // Nettoyage ciblé de la table concernée
  await Language.destroy({ where: {} });
});

describe('Language API', () => {
  it('crée une langue', async () => {
    const res = await request(app)
      .post('/api/languages')
      .send({ name: 'Français', icon: '🇫🇷' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Français');
    expect(res.body.icon).toBe('🇫🇷');
  });

  it('liste toutes les langues', async () => {
    await Language.create({ name: 'Français', icon: '🇫🇷' });
    await Language.create({ name: 'English', icon: '🇬🇧' });
    const res = await request(app).get('/api/languages');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('récupère une langue par id', async () => {
    const lang = await Language.create({ name: 'Español', icon: '🇪🇸' });
    const res = await request(app).get(`/api/languages/${lang.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Español');
  });

  it('modifie une langue', async () => {
    const lang = await Language.create({ name: 'Deutsch', icon: '🇩🇪' });
    const res = await request(app)
      .put(`/api/languages/${lang.id}`)
      .send({ name: 'Allemand', icon: '🇩🇪' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Allemand');
  });

  it('retourne 404 si la langue n\'existe pas', async () => {
    const res = await request(app).get('/api/languages/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

