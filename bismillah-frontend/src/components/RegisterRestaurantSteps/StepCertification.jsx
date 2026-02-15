
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';
import { apiUrl } from '../../config/api';
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
 *   - onStepValidChange : callback pour notifier le parent de la validité
 */


// Étape Certification Halal
const StepCertification = forwardRef(({ certification, setCertification, onStepValidChange }, ref) => {
  // Liste des certificateurs récupérée depuis l'API
  const [certifiers, setCertifiers] = useState([]);
  // Indique si la liste est en cours de chargement
  const [loading, setLoading] = useState(true);
  // Gestion de l'affichage des erreurs uniquement après soumission
  const [error, setError] = useState('');

  // Etat local pour la validité live de la step
  const [isStepValid, setIsStepValid] = useState(false);

  // Récupère la liste des certificateurs au montage
  useEffect(() => {
    fetch(apiUrl('/api/certifiers'))
      .then(res => res.json())
      .then(data => setCertifiers(Array.isArray(data) ? data : []))
      .catch(() => setCertifiers([]))
      .finally(() => setLoading(false));
  }, []);

  // Validation live à chaque changement
  useEffect(() => {
    let valid = false;
    if (certification.hasCertification === 'no') {
      valid = true;
    } else if (certification.hasCertification === 'yes') {
      const hasCertifier = !!certification.certifierId;
      const hasCustomName = certification.certifierId !== 'other' || !!certification.customCertifierName;
      const hasNumber = !!certification.certificationNumber && /^[a-zA-Z0-9]{1,15}$/.test(certification.certificationNumber);
      valid = hasCertifier && hasCustomName && hasNumber;
    }
    setIsStepValid(valid);
    if (onStepValidChange) onStepValidChange(valid);
  }, [certification, onStepValidChange]);

  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    isStepValid,
    validate: async () => {
      // On ne valide que si la question principale est cochée
      if (!certification.hasCertification) {
        return { valid: false };
      }
      // Si certification déclarée, vérifie tous les champs
      if (certification.hasCertification === 'yes') {
        if (!certification.certifierId) {
          setError('Veuillez choisir un certificateur');
          return { valid: false, message: 'Veuillez choisir un certificateur' };
        }
        if (certification.certifierId === 'other' && !certification.customCertifierName) {
          setError('Veuillez entrer le nom de votre certificateur');
          return { valid: false, message: 'Veuillez entrer le nom de votre certificateur' };
        }
        if (!certification.certificationNumber) {
          setError('Veuillez entrer votre numéro de certification');
          return { valid: false, message: 'Veuillez entrer votre numéro de certification' };
        }
        // Numéro : alphanumérique, max 15 caractères
        if (!/^[a-zA-Z0-9]{1,15}$/.test(certification.certificationNumber)) {
          setError('Le numéro de certification doit être alphanumérique (max 15 caractères)');
          return { valid: false, message: 'Le numéro de certification doit être alphanumérique (max 15 caractères)'};
        }
        // Vérification unicité numéro de certification (appel API)
        try {
          const checkCertif = await fetch(apiUrl(`/api/restaurants/check-certification-number?certificationNumber=${encodeURIComponent(certification.certificationNumber)}`));
          const checkCertifData = await checkCertif.json();
          if (checkCertifData.exists) {
            setError('Ce numéro de certification existe déjà.');
            return { valid: false, message: 'Ce numéro de certification existe déjà.' };
          }
        } catch (err) {
          console.error('Erreur vérification certification:', err);
          setError('Erreur lors de la vérification du numéro de certification.');
          return { valid: false, message: 'Erreur lors de la vérification du numéro de certification.' };
        }
      }
      setError('');
      return { valid: true };
    }
  }), [certification, isStepValid]);

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