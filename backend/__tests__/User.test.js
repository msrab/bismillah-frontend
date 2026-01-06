const request = require('supertest');
const { app } = require('../server');
const { User, Street, Language, City, Country } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let user, token, street, language, city, country;

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

  // Création d'un utilisateur de test
  user = await User.create({
    login: 'user1',
    email: 'user1@example.com',
    password: await bcrypt.hash('Password123!', 10),
    address_number: '10',
    streetId: street.id,
    languageId: language.id
  });

  token = jwt.sign(
    { id: user.id, type: 'user' },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '24h' }
  );
});

describe('User API', () => {
  it('récupère le profil du user connecté', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('id', user.id);
    expect(res.body.user).toHaveProperty('login', 'user1');
    expect(res.body.user.street).toHaveProperty('id', street.id);
    expect(res.body.user.language).toHaveProperty('id', language.id);
  });

  it('modifie le profil du user', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'Jean-Pierre',
        phone: '0700000000'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('firstname', 'Jean-Pierre');
    expect(res.body.user).toHaveProperty('phone', '0700000000');
  });

  it('refuse la modification avec un login déjà pris', async () => {
    await User.create({
      login: 'takenlogin',
      email: 'other@example.com',
      password: await bcrypt.hash('Password123!', 10),
      address_number: '11',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ login: 'takenlogin' });
    expect(res.statusCode).toBe(409);
    expect(res.body.errors || res.body.error).toContain('Ce login est déjà pris.');
  });

  it('refuse la modification avec un email déjà utilisé', async () => {
    await User.create({
      login: 'otherlogin',
      email: 'takenemail@example.com',
      password: await bcrypt.hash('Password123!', 10),
      address_number: '12',
      streetId: street.id,
      languageId: language.id
    });
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'takenemail@example.com' });
    expect(res.statusCode).toBe(409);
    expect(res.body.errors || res.body.error).toContain('Cet email est déjà utilisé.');
  });

  it('change la langue du user', async () => {
    const newLang = await Language.create({ name: 'English', icon: '🇬🇧' });
    const res = await request(app)
      .patch('/api/users/me/language')
      .set('Authorization', `Bearer ${token}`)
      .send({ languageId: newLang.id });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.language).toHaveProperty('id', newLang.id);
  });

  it('supprime le compte utilisateur', async () => {
    const res = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/);
    const deleted = await User.findByPk(user.id);
    expect(deleted).toBeNull();
  });

  it('refuse l\'accès sans token', async () => {
    const res = await request(app)
      .get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });

  it('refuse la modification de la langue via PUT', async () => {
    const newLang = await Language.create({ name: 'Deutsch', icon: '🇩🇪' });
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ languageId: newLang.id });
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toContain('La langue ne peut pas être modifiée ici.');
  });
});