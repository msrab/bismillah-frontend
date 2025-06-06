/**
 * __tests__/authUser.test.js
 *
 * Scénarios testés (d’après VALIDATIONS.md) :
 *
 * 1. POST /api/auth/user/signup
 *    - 201 si OK (login, email, password, address_number valides)
 *    - 409 si login déjà pris          ⇒ “Ce login est déjà pris.”
 *    - 409 si email déjà utilisé       ⇒ “Cet email est déjà utilisé.”
 *    - 400 si login vide               ⇒ “Le login est requis.”
 *    - 400 si login non alphanumérique ⇒ “Le login ne doit contenir que lettres et chiffres.”
 *    - 400 si email vide               ⇒ “L’email est requis.”
 *    - 400 si email mal formé          ⇒ “Format d’email invalide.”
 *    - 400 si password vide            ⇒ “Le mot de passe est requis.”
 *    - 400 si password < 8 caractères  ⇒ “Le mot de passe doit contenir au moins 8 caractères.”
 *    - 400 si address_number vide      ⇒ “L’adresse (address_number) est requise.”
 *
 * 2. POST /api/auth/user/login
 *    VALIDATIONS express-validator :
 *    - 400 si ni login ni email fourni   ⇒ “Login ou email requis.”
 *    - 400 si email mal formé           ⇒ “Format d’email invalide.”
 *    - 400 si password vide             ⇒ “Le mot de passe est requis.”
 *
 * 3. Fonctionnel (login effectif contre la base)
 *    - 200 si login+password corrects   ⇒ { message: 'Connexion réussie.', token: <jwt> }
 *    - 200 si email+password corrects   ⇒ même réponse
 *    - 401 si mot de passe incorrect    ⇒ “Mot de passe incorrect.”
 *    - 404 si user non existant         ⇒ “Utilisateur non trouvé.”
 */

const request = require('supertest');
const bcrypt  = require('bcrypt');
const { app, sequelize } = require('../server');
const { User } = require('../models');

describe('Auth Utilisateur', () => {
  // Payload de base pour les tests
  const userPayload = {
    login:          'testuser',
    email:          'test@example.com',
    password:       'Password123',
    address_number: '42 Rue de la Paix'
    // si votre modèle User a d’autres champs non-null, ajoutez-les ici avec des valeurs par défaut
  };

  beforeAll(async () => {
    // On reclée toute la base de test
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/user/signup – Validation express-validator', () => {
    it('renvoie 400 si login est vide', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: '',
          email: 'ok@example.com',
          password: 'Password123',
          address_number: '1 Rue Exemple'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le login est requis.');
    });

    it('renvoie 400 si login non alphanumérique', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'inv@lid!',
          email: 'ok2@example.com',
          password: 'Password123',
          address_number: '2 Rue Exemple'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le login ne doit contenir que lettres et chiffres.');
    });

    it('renvoie 400 si email vide', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: '',
          password: 'Password123',
          address_number: '3 Rue Exemple'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain("L’email est requis.");
    });

    it('renvoie 400 si email malformé', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: 'not-an-email',
          password: 'Password123',
          address_number: '4 Rue Exemple'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Format d’email invalide.');
    });

    it('renvoie 400 si password vide', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: 'ok3@example.com',
          password: '',
          address_number: '5 Rue Exemple'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe est requis.');
    });

    it('renvoie 400 si password < 8 caractères', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: 'ok4@example.com',
          password: 'short',
          address_number: '6 Rue Exemple'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe doit contenir au moins 8 caractères.');
    });

    it('renvoie 400 si address_number vide', async () => {
      const res = await request(app)
        .post('/api/auth/user/signup')
        .send({
          login: 'nouveluser',
          email: 'ok5@example.com',
          password: 'Password123',
          address_number: ''
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('L’adresse (address_number) est requise.');
    });

    // Les tests existants “login déjà pris”, “email déjà utilisé”, “création OK” restent valides (on ne les réécrit pas ici)
  });

  describe('POST /api/auth/user/login – Validation express-validator', () => {
    it('renvoie 400 si ni login ni email fourni', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Login ou email requis.');
    });

    it('renvoie 400 si email mal formé', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ email: 'not-an-email', password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Format d’email invalide.');
    });

    it('renvoie 400 si password vide', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({ login: 'testuser',  password: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('Le mot de passe est requis.');
    });
  });

  describe('POST /api/auth/user/login – Fonctionnel', () => {
    beforeAll(async () => {
      // On crée « manuellement » un user complet avant d’appeler /login
      await User.create({
        login:          userPayload.login,
        email:          userPayload.email,
        password:       await bcrypt.hash(userPayload.password, 10),
        address_number: userPayload.address_number
        // si votre modèle a d’autres champs obligatoires, les ajouter ici
      });
    });

    it('doit connecter l’utilisateur existant via login+password (200)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login:    userPayload.login,
          password: userPayload.password
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');
    });

    it('doit connecter l’utilisateur existant via email+password (200)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email:    userPayload.email,
          password: userPayload.password
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Connexion réussie.');
      expect(res.body).toHaveProperty('token');
    });

    it('ne doit pas connecter avec un mot de passe incorrect (401)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login:    userPayload.login,
          password: 'WrongPassword!'
        });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Mot de passe incorrect.');
    });

    it('ne doit pas connecter un utilisateur non existant (404)', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          login:    'inconnu',
          password: 'AnyPass123'
        });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Utilisateur non trouvé.');
    });
  });
});
