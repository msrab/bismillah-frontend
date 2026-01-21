import React from 'react';
import { TextField } from '@mui/material';

/**
 * EmailField
 * Composant autonome pour la saisie et la validation de l'adresse email.
 *
 * Props :
 *   - value : string, valeur de l'email
 *   - onChange : fonction de mise à jour (event => void)
 *   - error : bool, indique une erreur de validation
 *   - helperText : string, message d'aide ou d'erreur
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 *   - placeholder : string (optionnel)
 */
const EmailField = ({
  value,
  onChange,
  error = false,
  helperText = '',
  required = true,
  disabled = false,
  placeholder = 'restaurant@exemple.be',
}) => {
  return (
    <TextField
      label="Email"
      type="email"
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 2 }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      autoComplete="email"
    />
  );
};

export default EmailField;
