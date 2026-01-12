import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem, TextField, Alert, CircularProgress } from '@mui/material';

// Étape 2 - Certification
const StepCertification = forwardRef(({ certification, setCertification }, ref) => {
  const [certifiers, setCertifiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/certifiers')
      .then(res => res.json())
      .then(data => setCertifiers(Array.isArray(data) ? data : []))
      .catch(() => setCertifiers([]))
      .finally(() => setLoading(false));
  }, []);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      if (!certification.hasCertification) {
        return { valid: false, message: 'Veuillez indiquer si vous avez une certification' };
      }
      if (certification.hasCertification === 'yes') {
        if (!certification.certifierId) {
          return { valid: false, message: 'Veuillez choisir un certificateur' };
        }
        if (certification.certifierId === 'other' && !certification.customCertifierName) {
          return { valid: false, message: 'Veuillez entrer le nom de votre certificateur' };
        }
        if (!certification.certificationNumber) {
          return { valid: false, message: 'Veuillez entrer votre numéro de certification' };
        }
        if (!/^[a-zA-Z0-9]{1,15}$/.test(certification.certificationNumber)) {
          return { valid: false, message: 'Le numéro de certification doit être alphanumérique (max 15 caractères)'};
        }
        // Vérification unicité numéro de certification
        const checkCertif = await fetch(`http://localhost:5000/api/restaurants/check-certification-number?certificationNumber=${encodeURIComponent(certification.certificationNumber)}`);
        const checkCertifData = await checkCertif.json();
        if (checkCertifData.exists) {
          return { valid: false, message: 'Ce numéro de certification existe déjà.' };
        }
      }
      return { valid: true };
    }
  }), [certification]);

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
});
export default StepCertification;