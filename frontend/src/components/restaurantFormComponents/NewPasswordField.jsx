
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField } from '@mui/material';

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
 */
const NewPasswordField = forwardRef(({
  initialValue = '',
  required = true,
  disabled = false,
  label = 'Mot de passe',
  autoComplete = 'new-password',
  confirmWith = null,
}, ref) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
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
      type="password"
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 1 }}
      value={value}
      onChange={e => {
        setValue(e.target.value);
        if (error) setError('');
      }}
      error={!!error}
      helperText={error}
      autoComplete={autoComplete}
    />
  );
});

export default NewPasswordField;
