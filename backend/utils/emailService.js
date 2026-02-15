/**
 * Service d'envoi d'emails
 * Utilise Ethereal en développement (emails de test visibles sur ethereal.email)
 * Configurable pour production avec SMTP réel
 */

const nodemailer = require('nodemailer');

let transporter = null;
let testAccount = null;

/**
 * Initialise le transporteur email
 * En développement : utilise Ethereal (emails de test)
 * En production : utilise les credentials SMTP configurés
 */
const initTransporter = async () => {
  if (transporter) return transporter;

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && process.env.SMTP_HOST) {
    // Production : SMTP réel
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('📧 Email transporter configuré pour production');
  } else {
    // Développement : Ethereal (emails de test)
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('📧 Email transporter configuré avec Ethereal (test)');
    console.log(`   👤 User: ${testAccount.user}`);
    console.log(`   🔗 Voir les emails sur: https://ethereal.email/login`);
  }

  return transporter;
};

/**
 * Envoie un email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.text - Contenu texte (fallback)
 * @param {string} options.html - Contenu HTML
 * @returns {Object} - Infos sur l'envoi (inclut previewUrl en dev)
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const transport = await initTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Bismillah App" <noreply@bismillah-app.com>',
    to,
    subject,
    text,
    html
  };

  const info = await transport.sendMail(mailOptions);

  // En développement, afficher le lien pour voir l'email
  if (testAccount) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 Email envoyé ! Voir: ${previewUrl}`);
    return { ...info, previewUrl };
  }

  console.log(`📧 Email envoyé à ${to}`);
  return info;
};

/**
 * Envoie l'email de vérification de compte
 * @param {string} email - Email du destinataire
 * @param {string} restaurantName - Nom du restaurant
 * @param {string} verificationToken - Token de vérification
 */
const sendVerificationEmail = async (email, restaurantName, verificationToken) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2e7d32; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕌 Bismillah App</h1>
        </div>
        <div class="content">
          <h2>Bienvenue ${restaurantName} !</h2>
          <p>Merci de vous être inscrit sur Bismillah App, la plateforme des restaurants halal.</p>
          <p>Pour activer votre compte et commencer à gérer votre restaurant, veuillez cliquer sur le bouton ci-dessous :</p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">✅ Activer mon compte</a>
          </div>
          
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
            ${verificationLink}
          </p>
          
          <div class="warning">
            ⚠️ Ce lien expire dans <strong>24 heures</strong>. 
            Si vous n'avez pas demandé cette inscription, ignorez cet email.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Bismillah App - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Bienvenue ${restaurantName} !
    
    Merci de vous être inscrit sur Bismillah App.
    
    Pour activer votre compte, cliquez sur ce lien :
    ${verificationLink}
    
    Ce lien expire dans 24 heures.
    
    Si vous n'avez pas demandé cette inscription, ignorez cet email.
  `;

  return sendEmail({
    to: email,
    subject: '✅ Activez votre compte Bismillah App',
    text,
    html
  });
};

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {string} email - Email du destinataire
 * @param {string} restaurantName - Nom du restaurant
 * @param {string} resetToken - Token de réinitialisation
 */
const sendPasswordResetEmail = async (email, restaurantName, resetToken) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Réinitialisation du mot de passe</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${restaurantName},</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">🔑 Réinitialiser mon mot de passe</a>
          </div>
          
          <div class="warning">
            ⚠️ Ce lien expire dans <strong>1 heure</strong>. 
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Bismillah App - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Bonjour ${restaurantName},
    
    Vous avez demandé la réinitialisation de votre mot de passe.
    
    Cliquez sur ce lien pour définir un nouveau mot de passe :
    ${resetLink}
    
    Ce lien expire dans 1 heure.
    
    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Réinitialisation de votre mot de passe - Bismillah App',
    text,
    html
  });
};

module.exports = {
  initTransporter,
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};
