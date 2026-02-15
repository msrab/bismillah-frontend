
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, CircularProgress, InputAdornment } from '@mui/material';
import { apiUrl } from '../../config/api';

/**
 * EmailField autonome
 * Gère sa propre valeur, validation (format + unicité asynchrone), erreur
 * Transforme automatiquement en minuscules
 * Expose via ref : validate(), getError(), getValue(), isValid()
 */
const EmailField = forwardRef(({
  initialValue = '',
  required = true,
  disabled = false,
  placeholder = 'restaurant@exemple.be',
}, ref) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useImperativeHandle(ref, () => ({
    /**
     * Validation live (synchrone, sans side effects ni appel API)
     * Utilisé pour activer/désactiver le bouton Suivant
     */
    isValid: () => {
      if (required && !value.trim()) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    /**
     * Validation complète (avec affichage d'erreur et appel API)
     * Utilisé au clic sur le bouton Suivant
     */
    validate: async () => {
      const normalizedEmail = value.trim().toLowerCase();
      if (required && !normalizedEmail) {
        setError("L'email est requis");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        setError("Format d'email invalide");
        return false;
      }
      setError('');
      setChecking(true);
      try {
        const checkEmail = await fetch(apiUrl(`/restaurants/check-email?email=${encodeURIComponent(normalizedEmail)}`));
        const checkEmailData = await checkEmail.json();
        if (checkEmailData.exists) {
          setError("Cet email est déjà utilisé.");
          setChecking(false);
          return false;
        }
        setError('');
        setChecking(false);
        return true;
      } catch (err) {
        setError("Erreur réseau lors de la vérification de l'email.");
        setChecking(false);
        return false;
      }
    },
    getError: () => error,
    getValue: () => value.trim().toLowerCase()
  }), [value, error, required]);

  const handleChange = (e) => {
    // Transforme en minuscules en temps réel
    const lowerValue = e.target.value.toLowerCase();
    setValue(lowerValue);
    if (error) setError('');
  };

  return (
    <TextField
      label="Email"
      type="email"
      fullWidth
      required={required}
      disabled={disabled || checking}
      sx={{ mb: 2 }}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      autoComplete="email"
      InputProps={{
        endAdornment: checking ? <InputAdornment position="end"><CircularProgress size={18} /></InputAdornment> : null
      }}
    />
  );
});

export default EmailField;
