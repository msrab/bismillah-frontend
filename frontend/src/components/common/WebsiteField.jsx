import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

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
const WebsiteField = ({ value, onChange, error, helperText, required = false, disabled = false }) => (
  <TextField
    label="Site web"
    fullWidth
    sx={{ mb: 2 }}
    value={value}
    onChange={onChange}
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

export default WebsiteField;
