# Renforcement de la sécurité de l'authentification

Ce document récapitule toutes les mesures et bonnes pratiques à appliquer pour durcir l’authentification (users et restaurants) dans notre API Node/Express/Sequelize.

---
## 0. Sécuriser toutes les routes selon les types d’utilisateurs

Chaque route de l’API doit être protégée par des middlewares d’authentification et d’autorisation adaptés au rôle de l’utilisateur (admin, restaurateur, utilisateur simple, etc.).  
Aucune route sensible ne doit être accessible sans contrôle strict du type d’utilisateur autorisé.

## 1. Force HTTPS en production.

## 2. Renforcer la politique de mot de passe (≥ 12 caractères, majuscules, minuscules, chiffres, caractères spéciaux).

## 3. Helmet + CORS strict pour durcir les headers et limiter l’origine.

## 4. Rate limiting (express-rate-limit) sur /login.

## 5. Lockout côté utilisateur après 5 tentatives échouées.

## 6. Confirmation d’email à l’inscription + réinitialisation sécurisée du mot de passe (token dédié).

## 7. Rotation/invalidation des JWT (tokenVersion ou refresh-token).

## 8. Stockage sécurisé des secrets (variables d’environnement exclues du dépôt).

## 9. Logs d’authentification (IP, timestamp) sans données sensibles.

## 10. Uniformiser les messages d’erreur pour ne pas aider l’attaquant.

## 11. (Optionnel) Cookie HttpOnly SameSite pour stocker le JWT et se protéger contre XSS/CSRF.
