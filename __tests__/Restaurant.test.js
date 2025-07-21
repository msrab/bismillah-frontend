const request = require('supertest');
const { app } = require('../server');
const { Restaurant, Street, City, Country, Language, RestaurantLanguage } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let token, restaurant, street, city, country, lang1, lang2;

beforeEach(async () => {
  await RestaurantLanguage.destroy({ where: {} });
  await Language.destroy({ where: {} });
  await Restaurant.destroy({ where: {} });
  await Street.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });

  country = await Country.create({ name: 'France', iso_code: 'FR' });
  city = await City.create({ name: 'Paris', postal_code: '75001', countryId: country.id });
  street = await Street.create({ name: 'Rue de Rivoli', cityId: city.id });

  lang1 = await Language.create({ name: 'Français', icon: '🇫🇷' });
  lang2 = await Language.create({ name: 'English', icon: '🇬🇧' });

  restaurant = await Restaurant.create({
    name: 'Le Testeur',
    email: 'testeur@example.com',
    password: await bcrypt.hash('Password123!', 10),
    address_number: '10',
    company_number: 'FR123456789',
    phone: '0100000001',
    logo: null,
    nb_followers: 0,
    is_active: true,
    streetId: street.id
  });

  token = jwt.sign(
    { id: restaurant.id, type: 'restaurant' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
});

describe('Restaurant Routes', () => {
  it('récupère le profil du restaurant connecté avec ses langues', async () => {
    await restaurant.setLanguages([lang1.id, lang2.id]);
    await RestaurantLanguage.update({ main: true }, { where: { restaurantId: restaurant.id, languageId: lang1.id } });

    const res = await request(app)
      .get('/api/restaurants/profil')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurant).toHaveProperty('id', restaurant.id);
    expect(res.body.restaurant.languages.length).toBe(2);
    const mainLang = res.body.restaurant.languages.find(l => l.RestaurantLanguage.main);
    expect(mainLang).toHaveProperty('id', lang1.id);
  });

  it('ajoute des langues à un restaurant et définit la principale', async () => {
    const res = await request(app)
      .post(`/api/restaurants/${restaurant.id}/languages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ languageIds: [lang1.id, lang2.id], mainId: lang2.id });
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurant.languages.length).toBe(2);
    const mainLang = res.body.restaurant.languages.find(l => l.RestaurantLanguage.main);
    expect(mainLang).toHaveProperty('id', lang2.id);
  });

  it('supprime une langue du restaurant', async () => {
    await restaurant.setLanguages([lang1.id, lang2.id]);
    const res = await request(app)
      .delete(`/api/restaurants/${restaurant.id}/languages/${lang1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Langue supprimée du restaurant.');
    const langs = await restaurant.getLanguages();
    expect(langs.length).toBe(1);
    expect(langs[0].id).toBe(lang2.id);
  });

  it('modifie la langue principale du restaurant', async () => {
    await restaurant.setLanguages([lang1.id, lang2.id]);
    await RestaurantLanguage.update({ main: true }, { where: { restaurantId: restaurant.id, languageId: lang1.id } });

    const res = await request(app)
      .patch(`/api/restaurants/${restaurant.id}/languages/main`)
      .set('Authorization', `Bearer ${token}`)
      .send({ mainId: lang2.id });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Langue principale modifiée.');
    const langs = await restaurant.getLanguages({ joinTableAttributes: ['main'] });
    const mainLang = langs.find(l => l.RestaurantLanguage.main);
    expect(mainLang.id).toBe(lang2.id);
  });

  it('récupère le profil du restaurant connecté', async () => {
    const res = await request(app)
      .get('/api/restaurants/profil')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurant).toHaveProperty('id', restaurant.id);
    expect(res.body.restaurant).toHaveProperty('name', restaurant.name);
  });

  it('met à jour le profil du restaurant', async () => {
    const res = await request(app)
      .put('/api/restaurants/profil')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Le Modifié', phone: '0100000022' });
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurant).toHaveProperty('name', 'Le Modifié');
    expect(res.body.restaurant).toHaveProperty('phone', '0100000022');
  });

  it('désactive le restaurant', async () => {
    const res = await request(app)
      .put('/api/restaurants/profil/disable')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Restaurant désactivé.');
    const updated = await Restaurant.findByPk(restaurant.id);
    expect(updated.is_active).toBe(false);
  });

  it('réactive le restaurant', async () => {
    await restaurant.update({ is_active: false });
    const res = await request(app)
      .put('/api/restaurants/profil/enable')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Restaurant réactivé.');
    const updated = await Restaurant.findByPk(restaurant.id);
    expect(updated.is_active).toBe(true);
  });

  it('supprime le compte du restaurant', async () => {
    const res = await request(app)
      .delete('/api/restaurants/profil')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Compte restaurant supprimé.');
    const deleted = await Restaurant.findByPk(restaurant.id);
    expect(deleted).toBeNull();
  });

  it('liste paginée des restaurants', async () => {
    const userToken = jwt.sign(
      { id: 999, type: 'user' },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
    const res = await request(app)
      .get('/api/restaurants')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.restaurants)).toBe(true);
    expect(res.body.restaurants.length).toBeGreaterThanOrEqual(1);
  });

  it('récupère un restaurant par son ID', async () => {
    const userToken = jwt.sign(
      { id: 999, type: 'user' },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
    const res = await request(app)
      .get(`/api/restaurants/${restaurant.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurant).toHaveProperty('id', restaurant.id);
    expect(res.body.restaurant).toHaveProperty('name', restaurant.name);
  });

  it('retourne 404 si le restaurant n\'existe pas', async () => {
    const userToken = jwt.sign(
      { id: 999, type: 'user' },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
    const res = await request(app)
      .get('/api/restaurants/99999')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(404);
  });
});