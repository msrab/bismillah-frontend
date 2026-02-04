
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * NewPasswordField autonome
 * Gère sa propre valeur, validation (longueur, confirmation), erreur
 * Expose via ref : validate(), getError(), getValue()
 * Props :
 *   - initialValue : string (optionnel)
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 *   - label : string (optionnel, défaut "Mot de passe")
 *   - autoComplete : string (optionnel)
 *   - confirmWith : string (optionnel, valeur à comparer pour la confirmation)
 *   - onValueChange : callback appelé à chaque changement de valeur
 */
const NewPasswordField = forwardRef(({
  initialValue = '',
  required = true,
  disabled = false,
  label = 'Mot de passe',
  autoComplete = 'new-password',
  confirmWith = null,
  onValueChange = null,
}, ref) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  useImperativeHandle(ref, () => ({
    /**
     * Validation live (synchrone, sans side effects)
     * Utilisé pour activer/désactiver le bouton Suivant
     */
    isValid: () => {
      if (required && !value) return false;
      if (value.length < 8) return false;
      if (confirmWith !== null && value !== confirmWith) return false;
      return true;
    },
    /**
     * Validation complète (avec affichage d'erreur)
     * Utilisé au clic sur le bouton Suivant
     */
    validate: () => {
      if (required && !value) {
        setError('Le mot de passe est requis');
        return false;
      }
      if (value.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return false;
      }
      if (confirmWith !== null && value !== confirmWith) {
        setError('Les mots de passe ne correspondent pas');
        return false;
      }
      setError('');
      return true;
    },
    getError: () => error,
    getValue: () => value
  }), [value, error, required, confirmWith]);

  return (
    <TextField
      label={label}
      type={showPassword ? 'text' : 'password'}
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 1 }}
      value={value}
      onChange={e => {
        const newValue = e.target.value;
        setValue(newValue);
        if (error) setError('');
        if (onValueChange) onValueChange(newValue);
      }}
      error={!!error}
      helperText={error}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              onClick={handleTogglePassword}
              edge="end"
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
});

export default NewPasswordField;
