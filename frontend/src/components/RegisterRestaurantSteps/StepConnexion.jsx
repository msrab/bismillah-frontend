

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Box, Typography, Alert, LinearProgress, Button } from '@mui/material';
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
const StepConnexion = forwardRef(({ loading, handleSubmit }, ref) => {
  // Refs pour les champs autonomes
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [submitted, setSubmitted] = useState(false);

  // Pour le baromètre de sécurité
  const passwordValue = passwordRef.current?.getValue?.() || '';
  const passwordScore = getPasswordStrength(passwordValue);
  const passwordLabel = getStrengthLabel(passwordScore);
  const progressColors = ["error", "error", "warning", "info", "success", "success"];

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setSubmitted(true);
      const emailValid = await emailRef.current?.validate();
      const passwordValid = passwordRef.current?.validate();
      // Pour la confirmation, on passe la valeur du champ password comme confirmWith
      const confirmValid = confirmRef.current?.validate();
      return emailValid && passwordValid && confirmValid;
    },
    getAllFieldErrors: () => {
      const errors = [];
      if (emailRef.current?.getError) {
        const err = emailRef.current.getError();
        if (err) errors.push(err);
      }
      if (passwordRef.current?.getError) {
        const err = passwordRef.current.getError();
        if (err) errors.push(err);
      }
      if (confirmRef.current?.getError) {
        const err = confirmRef.current.getError();
        if (err) errors.push(err);
      }
      return errors;
    },
    getFormData: () => ({
      email: emailRef.current?.getValue() || '',
      password: passwordRef.current?.getValue() || '',
      confirmPassword: confirmRef.current?.getValue() || ''
    })
  }), []);

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
        ref={emailRef}
        required
      />

      {/* Champ mot de passe (autonome) */}
      <NewPasswordField
        ref={passwordRef}
        required
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
        ref={confirmRef}
        label="Confirmer le mot de passe"
        required
        autoComplete="new-password"
        confirmWith={passwordValue}
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