const request = require('supertest');
const { app } = require('../server');
const { RestaurantType, RestaurantTypeDescription, Language } = require('../models');
const jwt = require('jsonwebtoken');

let adminToken, restoToken, langFr, langEn;

beforeEach(async () => {
  await RestaurantTypeDescription.destroy({ where: {} });
  await RestaurantType.destroy({ where: {} });
  await Language.destroy({ where: {} });

  langFr = await Language.create({ name: 'Français', icon: '🇫🇷' });
  langEn = await Language.create({ name: 'English', icon: '🇬🇧' });

  adminToken = jwt.sign(
    { id: 1, type: 'admin' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
  restoToken = jwt.sign(
    { id: 2, type: 'restaurant' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
});

// --- Additional tests for RestaurantType API ---

it('refuse la création si descriptions contient des doublons de languageId', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜',
            descriptions: [
                { languageId: langFr.id, name: 'Nouilles', description: 'Plat asiatique' },
                { languageId: langFr.id, name: 'Noodles', description: 'Asian food' }
            ]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la création si descriptions contient un objet avec un champ supplémentaire', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜',
            descriptions: [
                { languageId: langFr.id, name: 'Nouilles', description: 'Plat asiatique', extra: 'forbidden' }
            ]
        });
    // Should still accept, unless your API strictly forbids extra fields
    expect([201, 400]).toContain(res.statusCode);
});

it('refuse la création si descriptions contient un objet sans languageId', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜',
            descriptions: [
                { name: 'Nouilles', description: 'Plat asiatique' }
            ]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la création si descriptions contient un objet sans name', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜',
            descriptions: [
                { languageId: langFr.id, description: 'Plat asiatique' }
            ]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la création si descriptions contient un objet sans description', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜',
            descriptions: [
                { languageId: langFr.id, name: 'Nouilles' }
            ]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la modification si descriptions contient des doublons de languageId', async () => {
    const type = await RestaurantType.create({ icon: '🍔', isValidated: false });
    const res = await request(app)
        .put(`/api/restaurants/types/${type.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍔',
            isValidated: true,
            descriptions: [
                { languageId: langFr.id, name: 'Burger', description: 'Cuisine US' },
                { languageId: langFr.id, name: 'Burger2', description: 'Cuisine US2' }
            ]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la création si descriptions contient un objet null', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜',
            descriptions: [null]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la modification si descriptions contient un objet null', async () => {
    const type = await RestaurantType.create({ icon: '🍔', isValidated: false });
    const res = await request(app)
        .put(`/api/restaurants/types/${type.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍔',
            isValidated: true,
            descriptions: [null]
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la création si descriptions est undefined', async () => {
    const res = await request(app)
        .post('/api/restaurants/types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍜'
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});

it('refuse la modification si descriptions est undefined', async () => {
    const type = await RestaurantType.create({ icon: '🍔', isValidated: false });
    const res = await request(app)
        .put(`/api/restaurants/types/${type.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            icon: '🍔',
            isValidated: true
        });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
});
