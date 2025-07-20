const request = require('supertest');
const { app } = require('../server');
const { Restaurant, Language, RestaurantLanguage } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let restaurant, token, language1, language2;

beforeAll(async () => {
  await new Promise(res => setTimeout(res, 500)); // attend 500ms

  // Ordre de suppression : enfant -> parent
  await RestaurantLanguage.destroy({ where: {} });
  await Restaurant.destroy({ where: {} });
  await Language.destroy({ where: {} });

  language1 = await Language.create({ name: 'Français' });
  language2 = await Language.create({ name: 'English' });

  const hash = await bcrypt.hash('Password123!', 10);
  restaurant = await Restaurant.create({
    name: 'Le Testeur',
    email: 'restolang@example.com',
    password: hash,
    company_number: 'BE123456789',
    address_number: '10'
  });

  token = jwt.sign(
    { id: restaurant.id, type: 'restaurant' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
});

describe('RestaurantLanguage API', () => {
  it('ajoute une langue au restaurant', async () => {
    const res = await request(app)
      .post('/api/restaurants/languages')
      .set('Authorization', `Bearer ${token}`)
      .send({ languageId: language1.id, main: true });
    expect(res.statusCode).toBe(201);
    expect(res.body.restaurantLanguage).toHaveProperty('main', true);
    expect(res.body.language).toHaveProperty('id', language1.id);
  });

  it('ajoute une seconde langue (non principale)', async () => {
    const res = await request(app)
      .post('/api/restaurants/languages')
      .set('Authorization', `Bearer ${token}`)
      .send({ languageId: language2.id });
    expect(res.statusCode).toBe(201);
    expect(res.body.restaurantLanguage).toHaveProperty('main', false);
    expect(res.body.language).toHaveProperty('id', language2.id);
  });

  it('change la langue principale', async () => {
    const res = await request(app)
      .patch('/api/restaurants/languages/main')
      .set('Authorization', `Bearer ${token}`)
      .send({ languageId: language2.id });
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurantLanguage).toHaveProperty('main', true);

    // Vérifie que l'autre langue n'est plus principale
    const rl1 = await RestaurantLanguage.findOne({ where: { restaurantId: restaurant.id, languageId: language1.id } });
    expect(rl1.main).toBe(false);
  });

  it('liste toutes les langues du restaurant', async () => {
    const res = await request(app)
      .get('/api/restaurants/languages')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    const mainLang = res.body.find(l => l.main);
    expect(mainLang.languageId).toBe(language2.id);
  });

  it('supprime une langue du restaurant', async () => {
    const res = await request(app)
      .delete(`/api/restaurants/languages/${language1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);

    const rl = await RestaurantLanguage.findOne({ where: { restaurantId: restaurant.id, languageId: language1.id } });
    expect(rl).toBeNull();
  });
});