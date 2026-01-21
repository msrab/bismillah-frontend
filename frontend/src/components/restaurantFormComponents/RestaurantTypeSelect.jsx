import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

/**
 * RestaurantTypeSelect
 * Sélecteur pour le type de restaurant
 * Props :
 *   - value : string|number
 *   - onChange : (event) => void
 *   - required : bool (optionnel)
 *   - disabled : bool (optionnel)
 */
const RestaurantTypeSelect = ({ value, onChange, required = false, disabled = false }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setOptions(Array.isArray(data) ? data : []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
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
};

export default RestaurantTypeSelect;
