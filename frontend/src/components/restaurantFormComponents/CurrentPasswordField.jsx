import React from 'react';
import { TextField } from '@mui/material';

/**
 * CurrentPasswordField
 * Composant autonome pour la saisie du mot de passe actuel (authentification ou vérification avant modification).
 *
 * Props :
 *   - value : string, valeur du mot de passe
 *   - onChange : fonction de mise à jour (event => void)
 *   - error : bool, indique une erreur de validation
 *   - helperText : string, message d'aide ou d'erreur
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 *   - autoComplete : string (optionnel, défaut "current-password")
 */
const CurrentPasswordField = ({
  value,
  onChange,
  error = false,
  helperText = '',
  required = true,
  disabled = false,
  autoComplete = 'current-password',
}) => {
  return (
    <TextField
      label="Mot de passe actuel"
      type="password"
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 2 }}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      autoComplete={autoComplete}
    />
  );
};

export default CurrentPasswordField;
