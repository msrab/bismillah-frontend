
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { TextField } from '@mui/material';

/**
 * RestaurantNameField autonome
 * Gère sa propre valeur, validation et erreur
 * Expose via ref : validate(), getError(), getValue()
 */
const RestaurantNameField = forwardRef(({ value, onChange, required = false, disabled = false }, ref) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Validation automatique dès que le champ atteint 3 caractères
  useEffect(() => {
    if (value && value.trim().length >= 3) {
      setTouched(true);
      if (required && !value.trim()) {
        setError('Le nom du restaurant est requis');
      } else {
        setError('');
      }
    }
  }, [value, required]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      console.log('[DEBUG][RestaurantNameField] validate() called, value:', value);
      if (!touched) {
        setError('Le nom du restaurant est requis');
        return { valid: false };
      }
      if (required && (!value.trim() || value.trim().length < 3)) {
        setError('Le nom du restaurant doit faire au moins 3 caractères');
        return { valid: false };
      }
      setError('');
      return { valid: true };
    },
    getError: () => error,
    getValue: () => value
  }), [value, error, required, touched]);

  return (
    <TextField
      label="Nom du restaurant"
      fullWidth
      required={required}
      sx={{ mb: 2 }}
      value={value}
      onChange={e => {
        onChange && onChange(e.target.value);
        setTouched(true);
        if (error) setError('');
        // Validation live dès 3 caractères
        if (e.target.value.trim().length >= 3) {
          // Appel de validate pour retour immédiat
          const valid = required ? e.target.value.trim().length >= 3 : true;
          if (valid) {
            setError('');
          }
        }
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
