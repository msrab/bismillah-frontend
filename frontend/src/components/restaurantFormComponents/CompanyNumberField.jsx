
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, InputAdornment } from '@mui/material';

/**
 * CompanyNumberField autonome
 * Gère sa propre valeur, validation (format + unicité API), erreur
 * Expose via ref : validate(), getError(), getValue()
 */
const CompanyNumberField = forwardRef(({ initialValue = '', required = false, disabled = false }, ref) => {
  const [value, setValue] = useState(initialValue.replace(/^BE/, ''));
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const num = value.replace(/\D/g, '');
      if (required && (!num || num.length !== 10)) {
        setError("Le numéro d'entreprise doit comporter exactement 10 chiffres.");
        return false;
      }
      setError('');
      // Vérification unicité via API
      setChecking(true);
      try {
        const companyNumberToCheck = `BE${num}`;
        const checkCompany = await fetch(`http://localhost:5000/api/restaurants/check-company-number?company_number=${encodeURIComponent(companyNumberToCheck)}`);
        const checkCompanyData = await checkCompany.json();
        if (!checkCompany.ok) {
          setError(checkCompanyData.error || "Erreur lors de la vérification du numéro d'entreprise.");
          setChecking(false);
          return false;
        }
        if (checkCompanyData.exists) {
          setError("Ce numéro d'entreprise existe déjà.");
          setChecking(false);
          return false;
        }
        setError('');
        setChecking(false);
        return true;
      } catch (err) {
        setError("Erreur réseau lors de la vérification du numéro d'entreprise.");
        setChecking(false);
        return false;
      }
    },
    getError: () => error,
    getValue: () => value ? `BE${value.replace(/\D/g, '').slice(0, 10)}` : ''
  }), [value, error, required]);

  return (
    <TextField
      label="Numéro d'entreprise (BCE)"
      fullWidth
      required={required}
      sx={{ mb: 2 }}
      value={value}
      onChange={e => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setValue(val);
        if (error) setError('');
      }}
      placeholder="0123456789"
      error={!!error}
      helperText={error || "Format belge: BE suivi de 10 chiffres"}
      disabled={disabled || checking}
      InputProps={{
        startAdornment: <InputAdornment position="start">BE</InputAdornment>
      }}
    />
  );
});

export default CompanyNumberField;
