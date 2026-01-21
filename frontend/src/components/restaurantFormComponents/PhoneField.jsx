import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

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
const PhoneField = ({ value, onChange, error, helperText, required = false, disabled = false }) => (
  <TextField
    label="Téléphone"
    fullWidth
    required={required}
    sx={{ mb: 2 }}
    value={value}
    onChange={onChange}
    placeholder="4XXXXXXXX ou 2XXXXXXX"
    error={error}
    helperText={helperText}
    disabled={disabled}
    InputProps={{
      startAdornment: <InputAdornment position="start">+32</InputAdornment>
    }}
  />
);

export default PhoneField;
