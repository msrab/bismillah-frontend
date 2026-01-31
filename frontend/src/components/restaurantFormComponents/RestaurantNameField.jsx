
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
  const [touched, setTouched] = useState(false);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!touched) {
        setError('Le nom du restaurant est requis');
        return { valid: false };
      }
      if (required && !value.trim()) {
        setError('Le nom du restaurant est requis');
        return { valid: false };
      }
      setError('');
      return { valid: true };
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
        setTouched(true);
        if (error) setError('');
      }}
      onBlur={() => setTouched(true)}
      placeholder="Ex: Restaurant Le Délice"
      error={touched && !!error}
      helperText={touched ? error : ''}
      disabled={disabled}
    />
  );
});

export default RestaurantNameField;
