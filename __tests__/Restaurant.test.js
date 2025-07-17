const request = require('supertest');
const { app } = require('../server');
const { Restaurant, Country, City, Street } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let country, city, street, restaurant, token, userToken;

// Masque les erreurs console.error pour les tests (évite le bruit dans la sortie)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
  await Restaurant.destroy({ where: {} });

  country = await Country.findOne({ where: { name: 'France' } });
  city = await City.findOne({ where: { name: 'Paris' } });
  street = await Street.findOne({ where: { name: 'Rue de Rivoli' } });

  const hash = await bcrypt.hash('Password123!', 10);
  restaurant = await Restaurant.create({
    name: 'Le Testeur',
    email: 'restotest@example.com',
    password: hash,
    company_number: 'BE123456789',
    address_number: '10',
    phone: '0123456789',
    streetId: street.id,
    cityId: city.id,
    countryId: country.id
  });

  token = jwt.sign(
    { id: restaurant.id, type: 'restaurant' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  userToken = jwt.sign(
    { id: 999, type: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
});

describe('Restaurant API', () => {
  describe('GET /api/restaurants/profil', () => {
    it('retourne le profil du restaurant connecté', async () => {
      const res = await request(app)
        .get('/api/restaurants/profil')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.restaurant).toHaveProperty('id', restaurant.id);
      expect(res.body.restaurant).toHaveProperty('name', 'Le Testeur');
      expect(res.body.restaurant).toHaveProperty('email', 'restotest@example.com');
    });

    it('refuse l\'accès sans token', async () => {
      const res = await request(app)
        .get('/api/restaurants/profil');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('refuse l\'accès avec un token user', async () => {
      const res = await request(app)
        .get('/api/restaurants/profil')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/restaurants/profil', () => {
    it('met à jour le profil du restaurant connecté', async () => {
      const res = await request(app)
        .put('/api/restaurants/profil')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Le Testeur Modifié', phone: '0612345678' });
      expect(res.statusCode).toBe(200);
      expect(res.body.restaurant).toHaveProperty('name', 'Le Testeur Modifié');
      expect(res.body.restaurant).toHaveProperty('phone', '0612345678');
    });

    it('refuse la mise à jour sans token', async () => {
      const res = await request(app)
        .put('/api/restaurants/profil')
        .send({ name: 'Resto Sans Token' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('refuse la mise à jour avec un token user', async () => {
      const res = await request(app)
        .put('/api/restaurants/profil')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Resto User' });
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/restaurants/profil/disable', () => {
    it('désactive le restaurant connecté', async () => {
      const res = await request(app)
        .put('/api/restaurants/profil/disable')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Restaurant désactivé.');
    });
  });

  describe('PUT /api/restaurants/profil/enable', () => {
    it('réactive le restaurant connecté', async () => {
      const res = await request(app)
        .put('/api/restaurants/profil/enable')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Restaurant réactivé.');
    });
  });

  describe('DELETE /api/restaurants/profil', () => {
    it('supprime le compte du restaurant connecté', async () => {
      // On recrée le restaurant pour ce test
      const hash = await bcrypt.hash('Password123!', 10);
      const restoToDelete = await Restaurant.create({
        name: 'Resto à Supprimer',
        email: 'delete@example.com',
        password: hash,
        company_number: 'BE000000001',
        address_number: '99',
        phone: '0600000000',
        streetId: street.id,
        cityId: city.id,
        countryId: country.id
      });
      const deleteToken = jwt.sign(
        { id: restoToDelete.id, type: 'restaurant' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      const res = await request(app)
        .delete('/api/restaurants/profil')
        .set('Authorization', `Bearer ${deleteToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Compte restaurant supprimé.');
      // Vérifie que le restaurant n'existe plus
      const check = await Restaurant.findByPk(restoToDelete.id);
      expect(check).toBeNull();
    });
  });

  describe('GET /api/restaurants', () => {
    it('liste paginée des restaurants (accès user uniquement)', async () => {
      const res = await request(app)
        .get('/api/restaurants')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.restaurants)).toBe(true);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
    });

    it('refuse l\'accès sans token', async () => {
      const res = await request(app)
        .get('/api/restaurants');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('refuse l\'accès avec un token restaurant', async () => {
      const res = await request(app)
        .get('/api/restaurants')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/restaurants/:id', () => {
    it('retourne un restaurant par ID (accès user uniquement)', async () => {
      // On s'assure que le restaurant existe et est actif
      const rest = await Restaurant.findOne({ where: { email: 'restotest@example.com' } });
      expect(rest).not.toBeNull();
      rest.is_active = true;
      await rest.save();

      const res = await request(app)
        .get(`/api/restaurants/${rest.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.restaurant).toHaveProperty('id', rest.id);
      expect(res.body.restaurant).toHaveProperty('name', rest.name);
    });

    it('retourne 404 si le restaurant n\'existe pas', async () => {
      const res = await request(app)
        .get('/api/restaurants/99999')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Restaurant non trouvé.');
    });

    it('refuse l\'accès sans token', async () => {
      const rest = await Restaurant.findOne();
      const res = await request(app)
        .get(`/api/restaurants/${rest.id}`);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('refuse l\'accès avec un token restaurant', async () => {
      const rest = await Restaurant.findOne();
      const res = await request(app)
        .get(`/api/restaurants/${rest.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('error');
    });
  });
});