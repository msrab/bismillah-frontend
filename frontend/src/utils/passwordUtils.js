// Utilitaires pour la gestion de la sécurité des mots de passe

export function getPasswordStrength(password) {
  let score = 0;
  if (!password) return score;
  // Critères: longueur, majuscule, minuscule, chiffre, caractère spécial
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function getStrengthLabel(score) {
  switch (score) {
    case 0:
    case 1:
      return 'Très faible';
    case 2:
      return 'Faible';
    case 3:
      return 'Moyen';
    case 4:
      return 'Fort';
    case 5:
      return 'Très fort';
    default:
      return '';
  }
}
