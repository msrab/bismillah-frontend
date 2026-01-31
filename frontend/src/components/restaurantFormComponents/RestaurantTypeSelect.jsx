
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText } from '@mui/material';

/**
 * RestaurantTypeSelect autonome
 * Gère sa propre valeur, validation, erreur
 * Expose via ref : validate(), getError(), getValue()
 */
const RestaurantTypeSelect = forwardRef(({ value, onChange, required = false, disabled = false }, ref) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  // value est contrôlé par le parent
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setOptions(Array.isArray(data) ? data : []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);

  // Validation automatique à chaque changement de valeur
  useEffect(() => {
    if (touched) {
      if (required && (!value || value === '')) {
        setError('Le type de restaurant est requis.');
      } else {
        setError('');
      }
    }
  }, [value, required, touched]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      // ...
      if (!touched) {
        setError('Le type de restaurant est requis.');
        return { valid: false };
      }
      if (required && (!value || value === '')) {
        setError('Le type de restaurant est requis.');
        return { valid: false };
      }
      setError('');
      return { valid: true };
    },
    getError: () => error,
    getValue: () => value
  }), [value, error, required, touched]);

  return (
    <FormControl fullWidth sx={{ mb: 2 }} required={required} disabled={disabled} error={touched && !!error}>
      <InputLabel id="restaurant-type-label">Type de restaurant</InputLabel>
      {loading ? (
        <CircularProgress size={24} sx={{ mt: 1, mb: 1 }} />
      ) : (
        <Select
          id="restaurant-type-select"
          name="restaurantTypeId"
          labelId="restaurant-type-label"
          value={value}
          label="Type de restaurant"
          onChange={e => {
            onChange && onChange(e.target.value);
            setTouched(true);
            if (error) setError('');
          }}
          onBlur={() => setTouched(true)}
          disabled={disabled}
        >
          <MenuItem value="">Sélectionner...</MenuItem>
          {options.map(opt => {
            const frenchDesc = opt.RestaurantTypeDescriptions?.find(desc => desc.languageId === 1);
            return (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.icon ? `${opt.icon} ` : ''}
                {frenchDesc ? frenchDesc.name : 'Type ' + opt.id}
              </MenuItem>
            );
          })}
        </Select>
      )}
      <FormHelperText>{touched ? error : ''}</FormHelperText>
    </FormControl>
  );
});

export default RestaurantTypeSelect;
