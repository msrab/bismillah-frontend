const request = require('supertest');
const app = require('../server');
const { Restaurant, Country, City, Street } = require('../models');
const jwt = require('jsonwebtoken');

let country, city, street, restaurant, token;

beforeAll(async () => {
  await Restaurant.destroy({ where: {} });
  await Street.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });

  country = await Country.create({ name: 'France', iso_code: 'FR' });
  city = await City.create({ name: 'Paris', countryId: country.id, postal_code: '75001' });
  street = await Street.create({ name: 'Rue de Rivoli', cityId: city.id });

  restaurant = await Restaurant.create({
    login: 'restotest',
    email: 'restotest@example.com',
    password: 'Password123!',
    address_number: '10',
    name: 'Le Testeur',
    company_number: 'BE123456789',
    cityId: city.id,
    streetId: street.id,
    countryId: country.id
  });

  token = jwt.sign(
    { id: restaurant.id, type: 'restaurant' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
});

describe('Auth Restaurant', () => {
  describe('POST /api/auth/restaurant/signup', () => {
    it('crée un restaurant avec succès', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send({
          login: 'newresto',
          email: 'newresto@example.com',
          password: 'Password123!',
          address_number: '12',
          name: 'Nouveau Resto',
          company_number: 'BE987654321',
          cityId: city.id,
          streetId: street.id,
          countryId: country.id
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.restaurant).toHaveProperty('id');
      expect(res.body.restaurant).toHaveProperty('login', 'newresto');
    });

    it('renvoie 409 si login déjà pris', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send({
          login: 'restotest',
          email: 'unique@example.com',
          password: 'Password123!',
          address_number: '15',
          name: 'Doublon Login',
          company_number: 'BE111111111',
          cityId: city.id,
          streetId: street.id,
          countryId: country.id
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('Ce login est déjà pris.');
    });

    it('renvoie 409 si email déjà utilisé', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/signup')
        .send({
          login: 'uniqueLogin',
          email: 'restotest@example.com',
          password: 'Password123!',
          address_number: '16',
          name: 'Doublon Email',
          company_number: 'BE222222222',
          cityId: city.id,
          streetId: street.id,
          countryId: country.id
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('Cet email est déjà utilisé.');
    });
  });

  describe('POST /api/auth/restaurant/login', () => {
    it('connecte avec login et bon mot de passe', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          login: 'restotest',
          password: 'Password123!'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.restaurant).toHaveProperty('login', 'restotest');
    });

    it('ne connecte pas avec mauvais mot de passe', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          login: 'restotest',
          password: 'WrongPassword!'
        });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Mot de passe incorrect.');
    });

    it('ne connecte pas si restaurant inexistant', async () => {
      const res = await request(app)
        .post('/api/auth/restaurant/login')
        .send({
          login: 'inconnu',
          password: 'Password123!'
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Restaurant non trouvé.');
    });
  });

  describe('Routes protégées', () => {
    it('accède à /api/restaurants/me avec token', async () => {
      const res = await request(app)
        .get('/api/restaurants/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.restaurant).toHaveProperty('id', restaurant.id);
    });

    it('refuse accès à /api/restaurants/me sans token', async () => {
      const res = await request(app)
        .get('/api/restaurants/me');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('refuse accès à /api/restaurants/me avec token invalide', async () => {
      const res = await request(app)
        .get('/api/restaurants/me')
        .set('Authorization', 'Bearer faketoken');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });