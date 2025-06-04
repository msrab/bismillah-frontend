// backend/__tests__/authUser.test.js
const request = require('supertest');
const { app, sequelize } = require('../server');  
const { User } = require('../models');   // paraît que l’index.js de models exporte les modèles

// Avant tout, on force le rebuild de la base de test
beforeAll(async () => {
  await sequelize.sync({ force: true });  // recrée toutes les tables sur la base test
});

// Après tous les tests, on ferme la connexion DB
afterAll(async () => {
  await sequelize.close();
});

describe('Auth Utilisateur', () => {
  const userPayload = {
    login:    'testuser1',
    email:    'test1@example.com',
    password: 'MonMotDePasse123'
  };

  it('POST /api/auth/user/signup → doit créer un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/user/signup')
      .send(userPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.login).toBe(userPayload.login);
    // Vérifie que l’utilisateur est bien en base
    const dbUser = await User.findOne({ where: { login: userPayload.login } });
    expect(dbUser).not.toBeNull();
    expect(dbUser.email).toBe(userPayload.email);
  });

  it('POST /api/auth/user/login → doit connecter l’utilisateur et renvoyer un token', async () => {
    const res = await request(app)
      .post('/api/auth/user/login')
      .send({ login: userPayload.login, password: userPayload.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Connexion réussie.');
    expect(res.body).toHaveProperty('token');
    // On peut aussi vérifier que le token est un JWT valide (facultatif)
  });

  it("POST /api/auth/user/login → ne doit pas connecter avec un mauvais mot de passe", async () => {
    const res = await request(app)
      .post('/api/auth/user/login')
      .send({ login: userPayload.login, password: 'MauvaisMDP' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Mot de passe incorrect.');
  });
});
