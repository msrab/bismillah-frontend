const request = require('supertest');
const { app } = require('../server');
const { Restaurant, Street, City, Country } = require('../models');
const bcrypt = require('bcrypt');

let street, city, country;

beforeEach(async () => {
  await Restaurant.destroy({ where: {} });
  await Street.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });

  country = await Country.create({ name: 'France', iso_code: 'FR' });
  city = await City.create({ name: 'Paris', postal_code: '75001', countryId: country.id });
  street = await Street.create({ name: 'Rue de Rivoli', cityId: city.id });
});

describe('Auth Restaurant', () => {
  it('crée un restaurant avec succès', async () => {
    const res = await request(app)
      .post('/api/auth/restaurant/signup')
      .send({
        name: 'Le Gourmet',
        email: 'gourmet@example.com',
        password: 'Password123!',
        address_number: '5',
        company_number: '123456789',
        phone: '0102030405',
        streetId: street.id
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.restaurant).toHaveProperty('id');
    expect(res.body.restaurant).toHaveProperty('name', 'Le Gourmet');
    expect(res.body.restaurant.street).toHaveProperty('id', street.id);
  });

  it('refuse un email déjà utilisé', async () => {
    await Restaurant.create({
      name: 'Le Test',
      email: 'resto@example.com',
      password: await bcrypt.hash('Password123!', 10),
      address_number: '6',
      company_number: '987654321',
      streetId: street.id
    });
    const res = await request(app)
      .post('/api/auth/restaurant/signup')
      .send({
        name: 'Autre Resto',
        email: 'resto@example.com',
        password: 'Password123!',
        address_number: '7',
        company_number: '987654321',
        streetId: street.id
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.errors || res.body.error).toContain('Cet email est déjà utilisé.');
  });

  it('refuse si champs obligatoires manquants', async () => {
    const res = await request(app)
      .post('/api/auth/restaurant/signup')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('connecte avec email', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    await Restaurant.create({
      name: 'Le Connect',
      email: 'connect@example.com',
      password,
      address_number: '8',
      company_number: '111222333',
      streetId: street.id
    });
    const res = await request(app)
      .post('/api/auth/restaurant/login')
      .send({
        email: 'connect@example.com',
        password: 'Password123!'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.restaurant).toHaveProperty('email', 'connect@example.com');
    expect(res.body.restaurant.street).toHaveProperty('id', street.id);
  });

  it('refuse connexion mauvais mot de passe', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    await Restaurant.create({
      name: 'Le Faux',
      email: 'faux@example.com',
      password,
      address_number: '9',
      company_number: '444555666',
      streetId: street.id
    });
    const res = await request(app)
      .post('/api/auth/restaurant/login')
      .send({
        email: 'faux@example.com',
        password: 'WrongPassword!'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.errors || res.body.error).toContain('Mot de passe incorrect.');
  });

  it('refuse connexion restaurant inconnu', async () => {
    const res = await request(app)
      .post('/api/auth/restaurant/login')
      .send({
        email: 'inconnu@example.com',
        password: 'Password123!'
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.errors || res.body.error).toContain('Restaurant non trouvé.');
  });
});