
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { useCountry } from '../../context/CountryContext';
import { formatBelgianCompanyNumber, validateBelgianCompanyNumber } from '../../utils/countries/belgiumValidation';

/**
 * CompanyNumberField autonome
 * Gère sa propre valeur, validation (format + unicité API), erreur
 * Expose via ref : validate(), getError(), getValue()
 */

const CompanyNumberField = forwardRef(({ initialValue = '', required = false, disabled = false }, ref) => {
  const [value, setValue] = useState(initialValue.replace(/^BE/, ''));
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  let countryIsoCode = 'BE';
  try {
    const ctx = useCountry();
    if (ctx && ctx.countryIsoCode) countryIsoCode = ctx.countryIsoCode;
  } catch (e) {
    // fallback BE
  }

  // Validation locale (structure)
  const localValidate = (val) => {
    const formatted = formatBelgianCompanyNumber(val);
    if (required && val.replace(/\D/g, '').length === 0) {
      return "Le numéro d'entreprise est obligatoire.";
    }
    if (required && val.replace(/\D/g, '').length !== 10) {
      return "Le numéro d'entreprise doit comporter exactement 10 chiffres.";
    }
    const { valid, message } = validateBelgianCompanyNumber(formatted, required);
    if (!valid) return message;
    return '';
  };

  // Expose pour le parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      setTouched(true);
      const err = localValidate(value);
      setError(err);
      return !err;
    },
    getError: () => error,
    getValue: () => formatBelgianCompanyNumber(value),
    setError: (msg) => { setError(msg); setTouched(true); },
    isValid: () => !localValidate(value)
  }), [value, error, required]);

  // Affiche l'erreur uniquement après blur ou si déjà touché
  const handleBlur = () => {
    setTouched(true);
    const err = localValidate(value);
    setError(err);
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue(val);
    if (touched) {
      const err = localValidate(val);
      setError(err);
    } else if (error) {
      setError('');
    }
  };


  return (
    <TextField
      label="Numéro d'entreprise (BCE)"
      fullWidth
      required={required}
      sx={{ mb: 2 }}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="0123456789"
      error={touched && !!error}
      helperText={touched ? error : '' || "Format belge: BE suivi de 10 chiffres"}
      disabled={disabled}
      InputProps={{
        startAdornment: <InputAdornment position="start">BE</InputAdornment>
      }}
    />
  );
});

export default CompanyNumberField;
