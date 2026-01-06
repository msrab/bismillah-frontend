const request = require('supertest');
const { app } = require('../server');
const { Restaurant, Street, City, Country, RestaurantType, RestaurantTypeDescription, Language } = require('../models');
const bcrypt = require('bcrypt');

let street, city, country, typeValide;

beforeEach(async () => {
  // Nettoyage ciblé des tables concernées
  await Restaurant.destroy({ where: {} });
  await RestaurantTypeDescription.destroy({ where: {} });
  await RestaurantType.destroy({ where: {} });
  await Street.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });
  await Language.destroy({ where: {} });

  // Création des entités nécessaires pour les tests
  country = await Country.create({ name: 'France', iso_code: 'FR' });
  city = await City.create({ name: 'Paris', postal_code: '75000', countryId: country.id });
  street = await Street.create({ name: 'Rue de Rivoli', cityId: city.id });
  await Language.create({ id: 1, name: 'Français', icon: '🇫🇷' });

  // Type validé pour les tests
  typeValide = await RestaurantType.create({ icon: '🍔', isValidated: true });
  await RestaurantTypeDescription.create({
    restaurantTypeId: typeValide.id,
    languageId: 1,
    name: 'Fast Food',
    description: 'Restauration rapide'
  });
});

describe('Auth Restaurant', () => {
  it('crée un restaurant avec un type existant validé', async () => {
    const res = await request(app)
      .post('/api/auth/restaurant/signup')
      .send({
        name: 'Le Gourmet',
        email: 'gourmet@example.com',
        password: 'Password123!',
        address_number: '5',
        company_number: '123456789',
        phone: '0102030405',
        streetId: street.id,
        restaurantTypeId: typeValide.id
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.restaurant).toHaveProperty('id');
    expect(res.body.restaurant).toHaveProperty('name', 'Le Gourmet');
    expect(res.body.restaurant.street).toHaveProperty('id', street.id);
    expect(res.body.restaurant).toHaveProperty('restaurantTypeId', typeValide.id);
  });

  it('crée un restaurant avec un nouveau type (non validé)', async () => {
    const res = await request(app)
      .post('/api/auth/restaurant/signup')
      .send({
        name: 'Le Créatif',
        email: 'creatif@example.com',
        password: 'Password123!',
        address_number: '10',
        company_number: '222333444',
        phone: '0102030406',
        streetId: street.id,
        restaurantType: {
          icon: '🍜',
          descriptions: [
            { languageId: 1, name: 'Nouvelle Catégorie', description: 'Type proposé par le resto' }
          ]
        }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.restaurant).toHaveProperty('id');
    expect(res.body.restaurant).toHaveProperty('name', 'Le Créatif');
    expect(res.body.restaurant.street).toHaveProperty('id', street.id);

    // Vérifie que le type a bien été créé et n'est pas validé
    const resto = await Restaurant.findByPk(res.body.restaurant.id);
    const typeCree = await RestaurantType.findByPk(resto.restaurantTypeId);
    expect(typeCree).not.toBeNull();
    expect(typeCree.isValidated).toBe(false);

    // Vérifie la description associée
    const desc = await RestaurantTypeDescription.findOne({ where: { restaurantTypeId: typeCree.id, languageId: 1 } });
    expect(desc).not.toBeNull();
    expect(desc.name).toBe('Nouvelle Catégorie');
  });

  it('refuse un email déjà utilisé', async () => {
    await Restaurant.create({
      name: 'Le Test',
      email: 'resto@example.com',
      password: await bcrypt.hash('Password123!', 10),
      address_number: '6',
      company_number: '987654321',
      streetId: street.id,
      restaurantTypeId: typeValide.id
    });
    const res = await request(app)
      .post('/api/auth/restaurant/signup')
      .send({
        name: 'Autre Resto',
        email: 'resto@example.com',
        password: 'Password123!',
        address_number: '7',
        company_number: '987654321',
        streetId: street.id,
        restaurantTypeId: typeValide.id
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
      streetId: street.id,
      restaurantTypeId: typeValide.id
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
    expect(res.body.restaurant).toHaveProperty('restaurantTypeId', typeValide.id);
  });

  it('refuse connexion mauvais mot de passe', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    await Restaurant.create({
      name: 'Le Faux',
      email: 'faux@example.com',
      password,
      address_number: '9',
      company_number: '444555666',
      streetId: street.id,
      restaurantTypeId: typeValide.id
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