import { useEffect, useState } from 'react';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem, TextField, Alert, CircularProgress } from '@mui/material';

// Étape 2 - Certification
export default function StepCertification({ certification, setCertification }) {
  const [certifiers, setCertifiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/certifiers')
      .then(res => res.json())
      .then(data => setCertifiers(Array.isArray(data) ? data : []))
      .catch(() => setCertifiers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Certification Halal
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">
          Avez-vous une certification halal officielle ?
        </FormLabel>
        <RadioGroup
          value={certification.hasCertification}
          onChange={(e) => setCertification({ ...certification, hasCertification: e.target.value })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Oui" />
          <FormControlLabel value="no" control={<Radio />} label="Non, pas encore" />
        </RadioGroup>
      </FormControl>

      {certification.hasCertification === 'yes' && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Organisme certificateur</InputLabel>
            {loading ? (
              <Select value="" label="Organisme certificateur" disabled>
                <MenuItem value=""><CircularProgress size={20} /> Chargement...</MenuItem>
              </Select>
            ) : (
              <Select
                value={certification.certifierId}
                label="Organisme certificateur"
                onChange={(e) => setCertification({ ...certification, certifierId: e.target.value })}
              >
                {certifiers.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
                <MenuItem value="other">Autre (non listé)</MenuItem>
              </Select>
            )}
          </FormControl>

          {certification.certifierId === 'other' && (
            <TextField
              label="Nom du certificateur"
              fullWidth
              sx={{ mb: 2 }}
              value={certification.customCertifierName}
              onChange={(e) => setCertification({ ...certification, customCertifierName: e.target.value })}
              helperText="Ce certificateur sera soumis à vérification"
            />
          )}

          <TextField
            label="Numéro de certification"
            fullWidth
            sx={{ mb: 2 }}
            value={certification.certificationNumber}
            onChange={(e) => setCertification({ ...certification, certificationNumber: e.target.value })}
          />
        </>
      )}

      {certification.hasCertification === 'no' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Vous pourrez ajouter votre certification plus tard depuis votre profil.
          Votre restaurant sera marqué comme "non certifié" jusqu'à validation.
        </Alert>
      )}
    </Box>
  );
}