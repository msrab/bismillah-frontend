import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { isValidBelgianPhoneNumber } from '../../utils/validation';

/**
 * PhoneField
 * Champ de saisie pour le numéro de téléphone belge avec préfixe +32
 * Props :
 *   - value : string
 *   - onChange : (event) => void
 *   - error : bool
 *   - helperText : string
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 */


/**
 * PhoneField autonome avec validation intégrée
 * Utilise forwardRef pour exposer une méthode validate()
 */
const PhoneField = forwardRef(({ value, onChange, required = false, disabled = false }, ref) => {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (required && !value) {
        setError(true);
        setHelperText('Le numéro de téléphone est requis');
        return false;
      }
      if (value && !/^\d{8,9}$/.test(value)) {
        setError(true);
        setHelperText('Le numéro doit comporter 8 ou 9 chiffres (sans le 0 initial, ni +32).');
        return false;
      }
      setError(false);
      setHelperText('');
      return true;
    },
    getFormatted: () => {
      if (!value) return '';
      if (value.startsWith('32') || value.startsWith('+32')) return value.replace(/^\+/, '');
      return `32${value}`;
    },
    getError: () => helperText
  }));

  return (
    <TextField
      label="Téléphone"
      fullWidth
      required={required}
      sx={{ mb: 2 }}
      value={value}
      onChange={e => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('0')) val = val.slice(1);
        onChange({ target: { value: val } });
        setError(false);
        setHelperText('');
      }}
      placeholder="4XXXXXXXX ou 2XXXXXXX"
      error={error}
      helperText={helperText}
      disabled={disabled}
      InputProps={{
        startAdornment: <InputAdornment position="start">+32</InputAdornment>
      }}
    />
  );
});

export default PhoneField;
