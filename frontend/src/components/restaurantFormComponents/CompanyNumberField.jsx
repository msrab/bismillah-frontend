import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

/**
 * CompanyNumberField
 * Champ pour le numéro d'entreprise belge (BCE)
 * Props :
 *   - value : string
 *   - onChange : (event) => void
 *   - error : bool
 *   - helperText : string
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 */
const CompanyNumberField = ({ value, onChange, error, helperText, required = false, disabled = false }) => (
  <TextField
    label="Numéro d'entreprise (BCE)"
    fullWidth
    required={required}
    sx={{ mb: 2 }}
    value={value.replace(/^BE/, '')}
    onChange={onChange}
    placeholder="0123456789"
    error={error}
    helperText={helperText || "Format belge: BE suivi de 10 chiffres"}
    disabled={disabled}
    InputProps={{
      startAdornment: <InputAdornment position="start">BE</InputAdornment>
    }}
  />
);

export default CompanyNumberField;
