const request = require('supertest');
const app = require('../app');
const { sequelize, CategoryMenu, CategoryMenuDescription } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('CategoryMenu API', () => {
  const descriptions = [
    { languageId: 1, name: 'Entrées', description: 'Entrées froides ou chaudes' },
    { languageId: 2, name: 'Starters', description: 'Hot or cold starters' }
  ];

  let createdId;

  it('crée une catégorie menu avec traductions', async () => {
    const res = await request(app)
      .post('/api/category-menus')
      .send({ icon: '🥗', isValidated: true, descriptions });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.descriptions.length).toBe(2);
    createdId = res.body.id;
  });

  it('refuse la création si icon est manquant', async () => {
    const res = await request(app)
      .post('/api/category-menus')
      .send({ descriptions });
    expect(res.statusCode).toBe(400);
  });

  it('récupère toutes les catégories menu', async () => {
    const res = await request(app)
      .get('/api/category-menus');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('récupère une catégorie menu par id', async () => {
    const res = await request(app)
      .get(`/api/category-menus/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('met à jour une catégorie menu', async () => {
    const newDescriptions = [
      { languageId: 1, name: 'Entrées modifiées', description: 'Entrées MAJ' },
      { languageId: 2, name: 'Starters updated', description: 'Starters updated' }
    ];
    const res = await request(app)
      .put(`/api/category-menus/${createdId}`)
      .send({ icon: '🍽️', isValidated: false, descriptions: newDescriptions });
    expect(res.statusCode).toBe(200);
    expect(res.body.icon).toBe('🍽️');
    expect(res.body.descriptions[0].name).toMatch(/Entrées modifiées|Starters updated/);
  });

  it('supprime une catégorie menu', async () => {
    const res = await request(app)
      .delete(`/api/category-menus/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('retourne 404 si la catégorie menu n\'existe pas', async () => {
    const res = await request(app)
      .get('/api/category-menus/999999');
    expect(res.statusCode).toBe(404);
  });
});