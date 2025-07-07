/**
 * __tests__/restaurant.test.js
 *
 * Tests des routes publiques de consultation des restaurants.
 */

const request    = require('supertest');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const { app, sequelize } = require('../server');
const { Restaurant }      = require('../models');

describe('Routes Restaurant (paginations & détail)', () => {
  let token;

  beforeAll(async () => {
    // 1) Réinitialise la BDD
    await sequelize.sync({ force: true });

    // 2) Crée un restaurant « maître » pour générer un token
    const hash = await bcrypt.hash('Password123', 10);
    const main = await Restaurant.create({
      name:           'MainBrasserie',
      company_number: 'MAIN123',
      address_number: '1 Rue Principale',
      email:          'main@ex.com',
      password:       hash,
      phone:          null,
      logo:           null
    });

    // 3) Génère un JWT (type=restaurant) pour l’authentification
    token = jwt.sign(
      { id: main.id, type: 'restaurant' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 4) Insère 15 autres restaurants pour tester la pagination
    for (let i = 1; i <= 15; i++) {
      await Restaurant.create({
        name:           `Brasserie${i}`,
        company_number: `NUM${i}`,
        address_number: `${i} Avenue Test`,
        email:          `b${i}@ex.com`,
        password:       hash,
        phone:          null,
        logo:           null
      });
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/restaurants', () => {
    it('devrait renvoyer la première page par défaut (10 items)', async () => {
      const res = await request(app)
        .get('/api/restaurants')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total', 16);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 10);
      expect(Array.isArray(res.body.restaurants)).toBe(true);
      expect(res.body.restaurants).toHaveLength(10);
      // On ne doit jamais renvoyer le champ password
      expect(res.body.restaurants[0]).not.toHaveProperty('password');
    });

    it('devrait renvoyer la page 2 avec limit=5', async () => {
      const res = await request(app)
        .get('/api/restaurants?page=2&limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('page', 2);
      expect(res.body).toHaveProperty('pageSize', 5);
      expect(res.body.restaurants).toHaveLength(5);
    });
  });

  describe('GET /api/restaurants/:id', () => {
    it('devrait renvoyer un restaurant existant', async () => {
      const rest = await Restaurant.findOne({ where: { company_number: 'NUM1' } });
      const res = await request(app)
        .get(`/api/restaurants/${rest.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('restaurant');
      expect(res.body.restaurant).toHaveProperty('id', rest.id);
      expect(res.body.restaurant).not.toHaveProperty('password');
    });

    it('devrait renvoyer 400 si l’ID n’est pas un nombre valide', async () => {
      const res = await request(app)
        .get('/api/restaurants/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'ID invalide.');
    });

    it('devrait renvoyer 404 si aucun restaurant avec cet ID', async () => {
      const res = await request(app)
        .get('/api/restaurants/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Restaurant non trouvé.');
    });
  });
});
