
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField } from '@mui/material';

/**
 * RestaurantNameField autonome
 * Gère sa propre valeur, validation et erreur
 * Expose via ref : validate(), getError(), getValue()
 */
const RestaurantNameField = forwardRef(({ initialValue = '', required = false, disabled = false }, ref) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (required && !value.trim()) {
        setError('Le nom du restaurant est requis');
        return false;
      }
      setError('');
      return true;
    },
    getError: () => error,
    getValue: () => value
  }), [value, error, required]);

  return (
    <TextField
      label="Nom du restaurant"
      fullWidth
      required={required}
      sx={{ mb: 2 }}
      value={value}
      onChange={e => {
        setValue(e.target.value);
        if (error) setError('');
      }}
      placeholder="Ex: Restaurant Le Délice"
      error={!!error}
      helperText={error}
      disabled={disabled}
    />
  );
});

export default RestaurantNameField;
