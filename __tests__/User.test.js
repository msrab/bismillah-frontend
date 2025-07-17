const request = require('supertest');
const { app } = require('../server');
const { User, Street } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let user, token, street;

beforeAll(async () => {
  await User.destroy({ where: {} }); // On garde les rues seedées
  // On récupère une rue existante (ex: Rue de Rivoli à Paris)
  street = await Street.findOne({ where: { name: 'Rue de Rivoli' } });

  const hash = await bcrypt.hash('Password123!', 10);
  user = await User.create({
    login: 'userprofil',
    email: 'userprofil@example.com',
    password: hash,
    address_number: '15',
    firstname: 'Marie',
    surname: 'Curie',
    phone: '0700000000',
    streetId: street.id
  });

  token = jwt.sign(
    { id: user.id, type: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
});

describe('User API', () => {
  describe('GET /api/users/me', () => {
    it('retourne le profil du user connecté', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('id', user.id);
      expect(res.body.user).toHaveProperty('login', 'userprofil');
      expect(res.body.user).toHaveProperty('streetId', street.id);
    });

    it('refuse l\'accès sans token', async () => {
      const res = await request(app)
        .get('/api/users/me');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/users/me', () => {
    it('met à jour le profil', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstname: 'Marie-Jeanne', phone: '0712345678' });
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('firstname', 'Marie-Jeanne');
      expect(res.body.user).toHaveProperty('phone', '0712345678');
    });

    it('refuse la mise à jour sans token', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .send({ firstname: 'Hacker' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/users/me', () => {
    it('supprime le compte utilisateur', async () => {
      // On crée un user exprès pour ce test
      const hash = await bcrypt.hash('Password123!', 10);
      const userToDelete = await User.create({
        login: 'deleteuser',
        email: 'deleteuser@example.com',
        password: hash,
        address_number: '99'
      });
      const deleteToken = jwt.sign(
        { id: userToDelete.id, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      const res = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${deleteToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Compte utilisateur supprimé.');
      const check = await User.findByPk(userToDelete.id);
      expect(check).toBeNull();
    });
});
});