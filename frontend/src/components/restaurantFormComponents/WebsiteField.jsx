import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { isValidWebsiteUrl } from '../../utils/validation';

/**
 * WebsiteField
 * Champ de saisie pour l'URL du site web avec validation et helper
 * Props :
 *   - value : string
 *   - onChange : (event) => void
 *   - error : bool
 *   - helperText : string
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 */

/**
 * WebsiteField autonome avec validation intégrée
 * Utilise forwardRef pour exposer une méthode validate()
 */
const WebsiteField = forwardRef(({ value, onChange, required = false, disabled = false }, ref) => {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (required && value === undefined) {
        setError(true);
        setHelperText('Le site web est requis');
        return false;
      }
      if (value && !isValidWebsiteUrl(value)) {
        setError(true);
        setHelperText("Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)");
        return false;
      }
      setError(false);
      setHelperText('');
      return true;
    },
    getError: () => helperText
  }));

  return (
    <TextField
      label="Site web"
      fullWidth
      sx={{ mb: 2 }}
      value={value}
      onChange={e => {
        onChange(e);
        setError(false);
        setHelperText('');
      }}
      placeholder="https://www.monrestaurant.be"
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      InputProps={{
        startAdornment: <InputAdornment position="start">🌐</InputAdornment>
      }}
    />
  );
});

export default WebsiteField;
