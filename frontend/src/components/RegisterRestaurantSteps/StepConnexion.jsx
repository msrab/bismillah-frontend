

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Typography, Alert, TextField, LinearProgress, Button } from '@mui/material';
import EmailField from '../restaurantFormComponents/EmailField';
import NewPasswordField from '../restaurantFormComponents/NewPasswordField';
import { getPasswordStrength, getStrengthLabel } from '../../utils/password';

/**
 * Composant StepConnexion
 * Étape du formulaire d'inscription restaurant : création des identifiants de connexion
 * - Saisie de l'email, mot de passe et confirmation
 * - Affiche la force du mot de passe
 * - Vérifie l'unicité de l'email et la validité des champs
 * - Expose une méthode validate() via la ref pour valider les champs
 *
 * Props :
 *   - credentials : { email, password, confirmPassword }
 *   - setCredentials : setter credentials
 *   - loading : bool, indique si l'inscription est en cours
 *   - handleSubmit : fonction appelée à la soumission du formulaire
 */


// Étape Connexion : création des identifiants
const StepConnexion = forwardRef(({ credentials, setCredentials, loading, handleSubmit }, ref) => {
  const passwordScore = getPasswordStrength(credentials.password);
  const passwordLabel = getStrengthLabel(passwordScore);
  const progressColors = ["error", "error", "warning", "info", "success", "success"];
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setSubmitted(true);
      setEmailError('');
      setFormError('');
      if (!credentials.email.trim()) {
        setEmailError("L'email est requis");
        setFormError("L'email est requis");
        return { valid: false, message: "L'email est requis" };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        setEmailError("Format d'email invalide");
        setFormError("Format d'email invalide");
        return { valid: false, message: "Format d'email invalide" };
      }
      const checkEmail = await fetch(`http://localhost:5000/api/restaurants/check-email?email=${encodeURIComponent(credentials.email)}`);
      const checkEmailData = await checkEmail.json();
      if (checkEmailData.exists) {
        setEmailError("Cet email est déjà utilisé.");
        setFormError("Cet email est déjà utilisé.");
        return { valid: false, message: "Cet email est déjà utilisé." };
      }
      setEmailError('');
      if (!credentials.password) {
        setFormError('Le mot de passe est requis');
        return { valid: false, message: 'Le mot de passe est requis' };
      }
      if (credentials.password.length < 8) {
        setFormError('Le mot de passe doit contenir au moins 8 caractères');
        return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
      }
      if (credentials.password !== credentials.confirmPassword) {
        setFormError('Les mots de passe ne correspondent pas');
        return { valid: false, message: 'Les mots de passe ne correspondent pas' };
      }
      setFormError('');
      return { valid: true };
    }
  }), [credentials]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Données de connexion
      </Typography>

      {/* Affichage de l'erreur uniquement après soumission */}
      {submitted && formError && (
        <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
      )}

      {/* Message d'information */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Cet email sera utilisé pour vous connecter et recevoir les notifications.
      </Alert>

      {/* Champ email (autonome) */}
      <EmailField
        value={credentials.email}
        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
        error={submitted && !!emailError}
        helperText={submitted ? emailError : ''}
      />

      {/* Champ mot de passe (autonome) */}
      <NewPasswordField
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
        helperText="Minimum 8 caractères, majuscule, minuscule, chiffre et caractère spécial recommandé."
      />

      {/* Baromètre de sécurité du mot de passe */}
      <Box sx={{ mb: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={passwordScore * 20} 
          color={progressColors[passwordScore]}
          sx={{ height: 8, borderRadius: 5 }}
        />
        <Typography variant="body2" sx={{ mt: 0.5, color: progressColors[passwordScore]+'.main' }}>
          Sûreté du mot de passe : <b>{passwordLabel}</b>
        </Typography>
      </Box>

      {/* Astuce sécurité */}
      <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
        Astuce : Utilisez une phrase, des majuscules, minuscules, chiffres et caractères spéciaux pour un mot de passe fort.
      </Typography>

      {/* Champ confirmation mot de passe (autonome) */}
      <NewPasswordField
        label="Confirmer le mot de passe"
        value={credentials.confirmPassword}
        onChange={e => setCredentials({ ...credentials, confirmPassword: e.target.value })}
        error={submitted && credentials.confirmPassword && credentials.password !== credentials.confirmPassword}
        helperText={
          submitted && credentials.confirmPassword && credentials.password !== credentials.confirmPassword
            ? 'Les mots de passe ne correspondent pas'
            : ''
        }
        autoComplete="new-password"
      />

      {/* Bouton de soumission */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={loading}
        sx={{ mt: 2, py: 1.5 }}
      >
        {loading ? 'Inscription en cours...' : 'Finaliser l\'inscription'}
      </Button>
    </Box>
  );
});

export default StepConnexion;