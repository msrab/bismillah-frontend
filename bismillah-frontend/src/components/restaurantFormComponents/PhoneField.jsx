import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { isValidBelgianPhoneNumber } from '../../utils/countries/belgiumValidation';

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
    /**
     * Validation sans effet de bord (pour validation live)
     */
    isValid: () => {
      if (required && !value) return false;
      if (!value) return true;
      // Nettoie la valeur (enlève tout sauf chiffres)
      let cleaned = value.replace(/\D/g, '');
      // Retire le 0 initial si présent
      if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
      // Formate pour validation
      const formatted = '+32' + cleaned;
      return isValidBelgianPhoneNumber(formatted);
    },
    validate: () => {
      if (required && !value) {
        setError(true);
        setHelperText('Le numéro de téléphone est requis');
        return false;
      }
      if (!value) {
        setError(false);
        setHelperText('');
        return true;
      }
      // Nettoie la valeur (enlève tout sauf chiffres)
      let cleaned = value.replace(/\D/g, '');
      // Retire le 0 initial si présent
      if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
      // Formate pour validation
      const formatted = '+32' + cleaned;
      if (!isValidBelgianPhoneNumber(formatted)) {
        setError(true);
        setHelperText('Numéro de téléphone belge invalide (ex: 475123456 ou 21234567).');
        return false;
      }
      setError(false);
      setHelperText('');
      return true;
    },
    getFormatted: () => {
      if (!value) return '';
      let cleaned = value.replace(/\D/g, '');
      if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
      // Retire le préfixe 32 si déjà présent pour éviter le doublon
      if (cleaned.startsWith('32')) cleaned = cleaned.slice(2);
      return '+32' + cleaned;
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
