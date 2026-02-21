import React from 'react';
import { TextField } from '@mui/material';

/**
 * LoginEmailField
 * Composant simple pour la saisie d'email dans les formulaires de connexion.
 * Transforme automatiquement en minuscules.
 *
 * Props :
 *   - value : string, valeur de l'email
 *   - onChange : fonction de mise à jour (event => void)
 *   - error : bool, indique une erreur de validation
 *   - helperText : string, message d'aide ou d'erreur
 *   - label : string (optionnel, défaut "Email")
 *   - name : string (optionnel, défaut "email")
 *   - required : bool (optionnel, défaut true)
 *   - disabled : bool (optionnel, défaut false)
 *   - placeholder : string (optionnel)
 */
const LoginEmailField = ({
  value,
  onChange,
  error = false,
  helperText = '',
  label = 'Email',
  name = 'email',
  required = true,
  disabled = false,
  placeholder = 'restaurant@exemple.be',
}) => {
  const handleChange = (e) => {
    // Crée un nouvel event avec la valeur en minuscules
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: e.target.value.toLowerCase()
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <TextField
      label={label}
      name={name}
      type="email"
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 2 }}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      autoComplete="email"
      placeholder={placeholder}
    />
  );
};

export default LoginEmailField;
