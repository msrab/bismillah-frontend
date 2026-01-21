
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';
import CertifierSelector from '../restaurantFormComponents/CertifierSelector';

/**
 * Composant StepCertification
 * Étape du formulaire d'inscription restaurant : gestion de la certification halal
 * - Permet de déclarer une certification halal officielle
 * - Affiche la liste des certificateurs, ou un champ libre si "Autre"
 * - Vérifie la validité et l'unicité du numéro de certification
 * - Expose une méthode validate() via la ref pour valider les champs
 *
 * Props :
 *   - certification : {
 *       hasCertification: 'yes'|'no'|undefined,
 *       certifierId: string|undefined,
 *       customCertifierName: string|undefined,
 *       certificationNumber: string|undefined
 *     }
 *   - setCertification : fonction pour mettre à jour certification
 */


// Étape Certification Halal
const StepCertification = forwardRef(({ certification, setCertification }, ref) => {
  // Liste des certificateurs récupérée depuis l'API
  const [certifiers, setCertifiers] = useState([]);
  // Indique si la liste est en cours de chargement
  const [loading, setLoading] = useState(true);

  // Récupère la liste des certificateurs au montage
  useEffect(() => {
    fetch('http://localhost:5000/api/certifiers')
      .then(res => res.json())
      .then(data => setCertifiers(Array.isArray(data) ? data : []))
      .catch(() => setCertifiers([]))
      .finally(() => setLoading(false));
  }, []);

  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    /**
     * Valide les champs de certification
     * - Si "oui", vérifie tous les champs obligatoires et unicité du numéro
     * - Si "non", aucune info supplémentaire requise
     * @returns { valid: boolean, message: string }
     */
    validate: async () => {
      // L'utilisateur doit répondre à la question principale
      if (!certification.hasCertification) {
        return { valid: false, message: 'Veuillez indiquer si vous avez une certification' };
      }
      // Si certification déclarée, vérifie tous les champs
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
        // Numéro : alphanumérique, max 15 caractères
        if (!/^[a-zA-Z0-9]{1,15}$/.test(certification.certificationNumber)) {
          return { valid: false, message: 'Le numéro de certification doit être alphanumérique (max 15 caractères)'};
        }
        // Vérification unicité numéro de certification (appel API)
        const checkCertif = await fetch(`http://localhost:5000/api/restaurants/check-certification-number?certificationNumber=${encodeURIComponent(certification.certificationNumber)}`);
        const checkCertifData = await checkCertif.json();
        if (checkCertifData.exists) {
          return { valid: false, message: 'Ce numéro de certification existe déjà.' };
        }
      }
      // Tout est conforme
      return { valid: true };
    }
  }), [certification]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Certification Halal
      </Typography>

      {/* Question principale : avez-vous une certification ? */}
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

      {/* Si "oui", affiche le composant autonome de sélection et saisie */}
      {certification.hasCertification === 'yes' && (
        <CertifierSelector
          certifiers={certifiers}
          loading={loading}
          certifierId={certification.certifierId}
          setCertifierId={val => setCertification({ ...certification, certifierId: val })}
          customCertifierName={certification.customCertifierName}
          setCustomCertifierName={val => setCertification({ ...certification, customCertifierName: val })}
          certificationNumber={certification.certificationNumber}
          setCertificationNumber={val => setCertification({ ...certification, certificationNumber: val })}
        />
      )}

      {/* Si "non", affiche une alerte informative */}
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