import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress } from '@mui/material';

/**
 * CertifierSelector
 * Composant autonome pour :
 *  - Sélectionner un certificateur dans une liste
 *  - Ajouter un certificateur non reconnu ("Autre")
 *  - Saisir le numéro de certification
 *
 * Props :
 *   - certifiers: array [{id, name}] Liste des certificateurs
 *   - loading: boolean, indique si la liste charge
 *   - certifierId: valeur sélectionnée
 *   - setCertifierId: setter certifierId
 *   - customCertifierName: string, valeur du champ "autre"
 *   - setCustomCertifierName: setter customCertifierName
 *   - certificationNumber: string, numéro de certification
 *   - setCertificationNumber: setter certificationNumber
 */
const CertifierSelector = ({
  certifiers = [],
  loading = false,
  certifierId,
  setCertifierId,
  customCertifierName,
  setCustomCertifierName,
  certificationNumber,
  setCertificationNumber
}) => {
  const [certificationNumberError, setCertificationNumberError] = useState('');

  // Validation du numéro de certification (alphanumérique uniquement, max 15 caractères)
  const validateCertificationNumber = (value) => {
    if (!value) {
      setCertificationNumberError('');
      return;
    }
    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      setCertificationNumberError('Le numéro doit être alphanumérique (lettres et chiffres uniquement)');
    } else if (value.length > 15) {
      setCertificationNumberError('Maximum 15 caractères');
    } else {
      setCertificationNumberError('');
    }
  };

  const handleCertificationNumberChange = (e) => {
    const value = e.target.value;
    setCertificationNumber(value);
    validateCertificationNumber(value);
  };

  return (
    <>
      {/* Sélection du certificateur */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Organisme certificateur</InputLabel>
        {loading ? (
          <Select value="" label="Organisme certificateur" disabled>
            <MenuItem value=""><CircularProgress size={20} /> Chargement...</MenuItem>
          </Select>
        ) : (
          <Select
            value={certifierId || ''}
            label="Organisme certificateur"
            onChange={e => setCertifierId(e.target.value)}
          >
            {certifiers.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
            <MenuItem value="other">Autre (non listé)</MenuItem>
          </Select>
        )}
      </FormControl>

      {/* Champ libre si "Autre" sélectionné */}
      {certifierId === 'other' && (
        <TextField
          label="Nom du certificateur"
          fullWidth
          sx={{ mb: 2 }}
          value={customCertifierName || ''}
          onChange={e => setCustomCertifierName(e.target.value)}
          helperText="Ce certificateur sera soumis à vérification"
        />
      )}

      {/* Champ numéro de certification */}
      <TextField
        label="Numéro de certification"
        fullWidth
        sx={{ mb: 2 }}
        value={certificationNumber || ''}
        onChange={handleCertificationNumberChange}
        error={!!certificationNumberError}
        helperText={certificationNumberError || 'Alphanumérique, max 15 caractères'}
        inputProps={{ maxLength: 15 }}
      />
    </>
  );
};

export default CertifierSelector;
