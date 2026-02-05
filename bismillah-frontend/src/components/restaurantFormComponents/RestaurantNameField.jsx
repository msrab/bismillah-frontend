
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { TextField } from '@mui/material';

/**
 * RestaurantNameField autonome
 * Gère sa propre valeur, validation et erreur
 * Transforme automatiquement en MAJUSCULES
 * Expose via ref : validate(), getError(), getValue(), isValid()
 */
const RestaurantNameField = forwardRef(({ value, onChange, required = false, disabled = false }, ref) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Validation : min 2 caractères, max 15, pas de 2 caractères spéciaux consécutifs
  const validateName = (val) => {
    const trimmed = val ? val.trim() : '';
    if (required && !trimmed) {
      return 'Le nom du restaurant est requis';
    }
    if (trimmed.length > 0 && trimmed.length < 2) {
      return 'Le nom doit contenir au moins 2 caractères';
    }
    if (trimmed.length > 15) {
      return 'Le nom ne peut pas dépasser 15 caractères';
    }
    // Interdit 2 caractères spéciaux consécutifs
    const specialCharsRegex = /[^a-zA-Z0-9àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇœŒæÆ\s]{2,}/;
    if (specialCharsRegex.test(trimmed)) {
      return 'Le nom ne peut pas contenir deux caractères spéciaux consécutifs';
    }
    return '';
  };

  // Validation automatique dès que le champ atteint 2 caractères
  useEffect(() => {
    if (value && value.trim().length >= 2) {
      setTouched(true);
      setError(validateName(value));
    }
  }, [value, required]);

  useImperativeHandle(ref, () => ({
    isValid: () => !validateName(value),
    validate: () => {
      setTouched(true);
      const err = validateName(value);
      setError(err);
      return { valid: !err };
    },
    getError: () => error,
    getValue: () => value ? value.trim().toUpperCase() : ''
  }), [value, error, required, touched]);

  const handleChange = (e) => {
    // Transforme en majuscules en temps réel
    const upperValue = e.target.value.toUpperCase();
    onChange && onChange(upperValue);
    setTouched(true);
    if (error) {
      const newError = validateName(upperValue);
      setError(newError);
    }
  };

  return (
    <TextField
      label="Nom du restaurant"
      fullWidth
      required={required}
      sx={{ mb: 2 }}
      value={value}
      onChange={handleChange}
      onBlur={() => {
        setTouched(true);
        setError(validateName(value));
      }}
      placeholder="Ex: O'TACOS"
      error={touched && !!error}
      helperText={touched && error ? error : 'Max 15 caractères'}
      disabled={disabled}
      inputProps={{ maxLength: 15 }}
    />
  );
});

export default RestaurantNameField;
