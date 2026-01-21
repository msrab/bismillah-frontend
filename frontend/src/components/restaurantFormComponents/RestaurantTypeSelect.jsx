import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

/**
 * RestaurantTypeSelect
 * Sélecteur pour le type de restaurant
 * Props :
 *   - value : string|number
 *   - onChange : (event) => void
 *   - options : array (liste des types)
 *   - loading : bool
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 */
const RestaurantTypeSelect = ({ value, onChange, options, loading, required = false, disabled = false }) => (
  <FormControl fullWidth sx={{ mb: 2 }} required={required} disabled={disabled}>
    <InputLabel>Type de restaurant</InputLabel>
    {loading ? (
      <Select value="" label="Type de restaurant" disabled>
        <MenuItem value=""><CircularProgress size={20} /> Chargement...</MenuItem>
      </Select>
    ) : (
      <Select
        value={value}
        label="Type de restaurant"
        onChange={onChange}
      >
        <MenuItem value="">
          <em>Sélectionner un type</em>
        </MenuItem>
        {options.map(type => (
          <MenuItem key={type.id} value={type.id}>
            {type.icon} {type.RestaurantTypeDescriptions?.[0]?.name || `Type ${type.id}`}
          </MenuItem>
        ))}
      </Select>
    )}
  </FormControl>
);

export default RestaurantTypeSelect;
