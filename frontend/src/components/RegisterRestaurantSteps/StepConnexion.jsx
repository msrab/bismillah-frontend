
import { forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Alert, TextField, LinearProgress, Button } from '@mui/material';
import { getPasswordStrength, getStrengthLabel } from '../../utils/password';

// Étape 6 - Connexion
const StepConnexion = forwardRef(({ credentials, setCredentials, loading, handleSubmit }, ref) => {
  const passwordScore = getPasswordStrength(credentials.password);
  const passwordLabel = getStrengthLabel(passwordScore);
  const progressColors = ["error", "error", "warning", "info", "success", "success"];

  useImperativeHandle(ref, () => ({
    validate: async () => {
      if (!credentials.email.trim()) {
        return { valid: false, message: "L'email est requis" };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return { valid: false, message: "Format d'email invalide" };
      }
      // Vérification unicité email
      const checkEmail = await fetch(`http://localhost:5000/api/restaurants/check-email?email=${encodeURIComponent(credentials.email)}`);
      const checkEmailData = await checkEmail.json();
      if (checkEmailData.exists) {
        return { valid: false, message: "Cet email est déjà utilisé." };
      }
      if (!credentials.password) {
        return { valid: false, message: 'Le mot de passe est requis' };
      }
      if (credentials.password.length < 8) {
        return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
      }
      if (credentials.password !== credentials.confirmPassword) {
        return { valid: false, message: 'Les mots de passe ne correspondent pas' };
      }
      return { valid: true };
    }
  }), [credentials]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Données de connexion
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Cet email sera utilisé pour vous connecter et recevoir les notifications.
      </Alert>

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="restaurant@exemple.be"
      />

      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        required
        sx={{ mb: 1 }}
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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

      <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
        Astuce : Utilisez une phrase, des majuscules, minuscules, chiffres et caractères spéciaux pour un mot de passe fort.
      </Typography>

      <TextField
        label="Confirmer le mot de passe"
        type="password"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={credentials.confirmPassword}
        onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
        error={credentials.confirmPassword && credentials.password !== credentials.confirmPassword}
        helperText={
          credentials.confirmPassword && credentials.password !== credentials.password
            ? 'Les mots de passe ne correspondent pas'
            : ''
        }
      />
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