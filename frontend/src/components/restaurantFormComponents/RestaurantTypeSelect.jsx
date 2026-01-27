
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText } from '@mui/material';

/**
 * RestaurantTypeSelect autonome
 * Gère sa propre valeur, validation, erreur
 * Expose via ref : validate(), getError(), getValue()
 */
const RestaurantTypeSelect = forwardRef(({ initialValue = '', required = false, disabled = false }, ref) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setOptions(Array.isArray(data) ? data : []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (required && (!value || value === '')) {
        setError('Le type de restaurant est requis.');
        return false;
      }
      setError('');
      return true;
    },
    getError: () => error,
    getValue: () => value
  }), [value, error, required]);

  return (
    <FormControl fullWidth sx={{ mb: 2 }} required={required} disabled={disabled} error={!!error}>
      <InputLabel>Type de restaurant</InputLabel>
      {loading ? (
        <Select value="" label="Type de restaurant" disabled>
          <MenuItem value=""><CircularProgress size={20} /> Chargement...</MenuItem>
        </Select>
      ) : (
        <Select
          value={value}
          label="Type de restaurant"
          onChange={e => {
            setValue(e.target.value);
            if (error) setError('');
          }}
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
      {!!error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
});

export default RestaurantTypeSelect;
