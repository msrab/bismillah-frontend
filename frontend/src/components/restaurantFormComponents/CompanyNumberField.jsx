import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { useCountry } from '../../context/CountryContext';
import { formatBelgianCompanyNumber, validateBelgianCompanyNumber } from '../../utils/countries/belgiumValidation';

// Ajout de la prop resetTrigger pour reset lors d'un changement de step
const CompanyNumberField = forwardRef(({ value, onChange, required = false, disabled = false, resetTrigger }, ref) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  // Reset touched et error à chaque changement de step (resetTrigger)
  useEffect(() => {
    setTouched(false);
    setError('');
  }, [resetTrigger]);

  let countryIsoCode = 'BE';
  try {
    const ctx = useCountry();
    if (ctx?.countryIsoCode) countryIsoCode = ctx.countryIsoCode;
  } catch {}

  const localValidate = (val) => {
    const formatted = formatBelgianCompanyNumber(val);
    if (required && val.replace(/\D/g, '').length === 0)
      return "Le numéro d'entreprise est obligatoire.";
    if (required && val.replace(/\D/g, '').length !== 10)
      return "Le numéro d'entreprise doit comporter exactement 10 chiffres.";
    const { valid, message } = validateBelgianCompanyNumber(formatted, required);
    return valid ? '' : message;
  };

  // Validation automatique dès que le champ atteint 10 chiffres ou lors du blur
  useEffect(() => {
    if (value.length === 10) {
      setTouched(true);
      const err = localValidate(value);
      setError(err);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      // ...
      if (!touched) {
        setError("Le numéro d'entreprise est obligatoire.");
        return { valid: false };
      }
      setTouched(true);
      const err = localValidate(value);
      setError(err);
      return { valid: !err };
    },
    getError: () => error,
    getValue: () => formatBelgianCompanyNumber(value),
    setError: (msg) => { setError(msg); setTouched(true); },
    isValid: () => !localValidate(value)
  }), [value, error, required, touched]);

  const handleBlur = () => {
    setTouched(true);
    const err = localValidate(value);
    setError(err);
  };
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange && onChange(val);
    if (touched) setError(localValidate(val));
    else if (error) setError('');
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
      helperText={touched && error ? error : "Format belge: BE suivi de 10 chiffres"}
      disabled={disabled}
      InputProps={{ startAdornment: <InputAdornment position="start">BE</InputAdornment> }}
    />
  );
});

export default CompanyNumberField;