import React from 'react';
import { TextField } from '@mui/material';

/**
 * NewPasswordField
 * Composant autonome pour la saisie d'un nouveau mot de passe.
 *
 * Props :
 *   - value : string, valeur du mot de passe
 *   - onChange : fonction de mise à jour (event => void)
 *   - error : bool, indique une erreur de validation
 *   - helperText : string, message d'aide ou d'erreur
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 *   - label : string (optionnel, défaut "Mot de passe")
 *   - autoComplete : string (optionnel)
 */
const NewPasswordField = ({
  value,
  onChange,
  error = false,
  helperText = '',
  required = true,
  disabled = false,
  label = 'Mot de passe',
  autoComplete = 'new-password',
}) => {
  return (
    <TextField
      label={label}
      type="password"
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 1 }}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      autoComplete={autoComplete}
    />
  );
};

export default NewPasswordField;
