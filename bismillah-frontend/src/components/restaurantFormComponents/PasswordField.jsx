import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * PasswordField
 * Composant autonome pour la saisie d'un mot de passe avec toggle visibilité.
 * Utilisé pour les formulaires de connexion.
 *
 * Props :
 *   - value : string, valeur du mot de passe
 *   - onChange : fonction de mise à jour (event => void)
 *   - error : bool, indique une erreur de validation
 *   - helperText : string, message d'aide ou d'erreur
 *   - label : string (optionnel, défaut "Mot de passe")
 *   - name : string (optionnel, défaut "password")
 *   - required : bool (optionnel, défaut true)
 *   - disabled : bool (optionnel, défaut false)
 *   - autoComplete : string (optionnel, défaut "current-password")
 *   - placeholder : string (optionnel)
 */
const PasswordField = ({
  value,
  onChange,
  error = false,
  helperText = '',
  label = 'Mot de passe',
  name = 'password',
  required = true,
  disabled = false,
  autoComplete = 'current-password',
  placeholder = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 2 }}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      autoComplete={autoComplete}
      placeholder={placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              onClick={handleToggleVisibility}
              onMouseDown={handleMouseDown}
              edge="end"
              disabled={disabled}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
