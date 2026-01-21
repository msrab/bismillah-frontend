import React from 'react';
import { TextField } from '@mui/material';

/**
 * RestaurantNameField
 * Champ pour le nom du restaurant
 * Props :
 *   - value : string
 *   - onChange : (event) => void
 *   - error : bool
 *   - helperText : string
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 */
const RestaurantNameField = ({ value, onChange, error, helperText, required = false, disabled = false }) => (
  <TextField
    label="Nom du restaurant"
    fullWidth
    required={required}
    sx={{ mb: 2 }}
    value={value}
    onChange={onChange}
    placeholder="Ex: Restaurant Le Délice"
    error={error}
    helperText={helperText}
    disabled={disabled}
  />
);

export default RestaurantNameField;
