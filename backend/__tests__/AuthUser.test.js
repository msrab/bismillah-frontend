const request = require('supertest');
const { app } = require('../server');
const { User, Street, Language, City, Country } = require('../models');
const bcrypt = require('bcrypt');
const { execSync } = require('child_process');

let street, language, city, country;

beforeEach(async () => {
  // Nettoyage ciblé des tables concernées
  await User.destroy({ where: {} });
  await Street.destroy({ where: {} });
  await Language.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });

  // Création des entités nécessaires pour les tests
  country = await Country.create({ name: 'France', iso_code: 'FR' });
  city = await City.create({ name: 'Paris', postal_code: '75000', countryId: country.id });
  street = await Street.create({ name: 'Rue de Rivoli', cityId: city.id });
  language = await Language.create({ name: 'Français', icon: '🇫🇷' });
});

describe('Auth User', () => {

  it('refuse un login déjà pris', async () => {
    await User.create({
      login: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('Password123!', 10),
      address_number: '11',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .post('/api/auth/user/signup')
      .send({
        login: 'user2',
        email: 'unique@example.com',
        password: 'Password123!',
        address_number: '12',
        streetId: street.id,
        languageId: language.id
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.errors || res.body.error).toContain('Ce login est déjà pris.');
  });

  it('refuse un email déjà utilisé', async () => {
    await User.create({
      login: 'uniqueuser',
      email: 'user3@example.com',
      password: await bcrypt.hash('Password123!', 10),
      address_number: '13',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .post('/api/auth/user/signup')
      .send({
        login: 'anotheruser',
        email: 'user3@example.com',
        password: 'Password123!',
        address_number: '14',
        streetId: street.id,
        languageId: language.id
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.errors || res.body.error).toContain('Cet email est déjà utilisé.');
  });

  it('refuse si champs obligatoires manquants', async () => {
    const res = await request(app)
      .post('/api/auth/user/signup')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('connecte avec login', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    await User.create({
      login: 'userlogin',
      email: 'userlogin@example.com',
      password,
      address_number: '15',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .post('/api/auth/user/login')
      .send({
        login: 'userlogin',
        password: 'Password123!'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('login', 'userlogin');
    expect(res.body.user.street).toHaveProperty('id', street.id);
    expect(res.body.user.language).toHaveProperty('id', language.id);
  });

  it('connecte avec email', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    await User.create({
      login: 'useremail',
      email: 'useremail@example.com',
      password,
      address_number: '16',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .post('/api/auth/user/login')
      .send({
        email: 'useremail@example.com',
        password: 'Password123!'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'useremail@example.com');
    expect(res.body.user.street).toHaveProperty('id', street.id);
    expect(res.body.user.language).toHaveProperty('id', language.id);
  });

  it('refuse connexion mauvais mot de passe', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    await User.create({
      login: 'userbadpass',
      email: 'userbadpass@example.com',
      password,
      address_number: '17',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .post('/api/auth/user/login')
      .send({
        login: 'userbadpass',
        password: 'WrongPassword!'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.errors || res.body.error).toContain('Mot de passe incorrect.');
  });

  it('refuse connexion user inconnu', async () => {
    const res = await request(app)
      .post('/api/auth/user/login')
      .send({
        login: 'inconnu',
        password: 'Password123!'
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.errors || res.body.error).toContain('Utilisateur non trouvé.');
  });
});