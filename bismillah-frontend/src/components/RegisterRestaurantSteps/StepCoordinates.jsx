import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import PhoneField from '../restaurantFormComponents/PhoneField';
import WebsiteField from '../restaurantFormComponents/WebsiteField';
import AddressFields from '../restaurantFormComponents/AddressFields';
import CityAutocomplete from '../restaurantFormComponents/CityAutocompleteField';

/**
 * Composant StepCoordinates
 * Gère la saisie et la validation des coordonnées du restaurant (site web, téléphone, adresse)
 * Utilise des sous-composants réutilisables et un hook personnalisé pour la recherche de ville
 * @param {object} contact - L'objet contenant les valeurs du formulaire
 * @param {function} setContact - Fonction pour mettre à jour l'objet contact
 */
const StepCoordinates = forwardRef(({ contact, setContact, onStepValidChange }, ref) => {
  // Refs pour les champs autonomes
  const phoneRef = useRef();
  const websiteRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();

  // Etat local pour la validité live de la step
  const [isStepValid, setIsStepValid] = useState(false);

  // Met à jour la validité à chaque changement de champ (validation synchrone uniquement, sans affichage d'erreur)
  useEffect(() => {
    const phoneValid = phoneRef.current?.isValid ? phoneRef.current.isValid() : false;
    const websiteValid = websiteRef.current?.isValid ? websiteRef.current.isValid() : true;
    const cityValid = cityRef.current?.isValid ? cityRef.current.isValid() : false;
    const addressValid = addressRef.current?.validateLocal ? addressRef.current.validateLocal()?.valid : false;
    const valid = !!(phoneValid && websiteValid && cityValid && addressValid);
    setIsStepValid(valid);
    if (onStepValidChange) onStepValidChange(valid);
  });

  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    isStepValid,
    /**
     * Valide tous les champs du formulaire via les refs des Fields
     */
    validate: async () => {
      // 1. Validations
      const phoneValid = phoneRef.current?.validate();
      const websiteValid = websiteRef.current?.validate();
      const cityResult = cityRef.current?.validateFields();
      const addressValid = await addressRef.current?.validateAndCheckUnique();
      // Retourne un objet { valid, message }
      if (phoneValid && websiteValid && cityResult?.valid && addressValid?.valid) {
        return { valid: true };
      }
      return { valid: false };
    },
    /**
     * Retourne le numéro de téléphone formaté (pour la soumission finale)
     */
    getFormattedPhone: () => {
      return phoneRef.current?.getFormatted ? phoneRef.current.getFormatted() : '';
    },
    /**
     * Recherche ou crée la ville et retourne son ID (pour la soumission finale)
     */
    ensureCityInDatabase: async () => {
      return cityRef.current?.ensureCityInDatabase ? await cityRef.current.ensureCityInDatabase() : { valid: false, message: 'Erreur interne' };
    }
  }), [contact, setContact, isStepValid]);



  // ...existing code...
  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

      {/* Champ site web autonome */}
      <WebsiteField
        ref={websiteRef}
        value={contact.website}
        onChange={e => {
          setContact({ ...contact, website: e.target.value });
        }}
      />

      {/* Champ téléphone autonome */}
      <PhoneField
        ref={phoneRef}
        value={contact.phone}
        onChange={e => {
          setContact({ ...contact, phone: e.target.value });
        }}
        required
      />

      {/* Sous-titre pour la section adresse */}
      <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>
        Adresse du restaurant
      </Typography>

      {/* Autocomplétion ville/code postal avec recherche API */}
      <CityAutocomplete
        ref={cityRef}
        value={contact.cityName && contact.postalCode ? { postalCode: contact.postalCode, localityName: contact.cityName, countryId: contact.countryId } : null}
        onChange={newValue => {
          if (newValue) {
            setContact({
              ...contact,
              cityName: (newValue.localityName || '').trim(),
              postalCode: (newValue.postalCode || '').trim(),
              countryId: newValue.countryId || 1
            });
          } else {
            setContact({
              ...contact,
              cityName: '',
              postalCode: '',
              countryId: 1
            });
          }
        }}
      />

      {/* Champs d'adresse autonome */}
      <AddressFields
        ref={addressRef}
        streetName={contact.streetName}
        addressNumber={contact.addressNumber}
        cityId={contact.cityId}
        onChange={(field, value) => {
          if (field === 'streetName') setContact({ ...contact, streetName: value });
          if (field === 'addressNumber') setContact({ ...contact, addressNumber: value });
        }}
      />
    </Box>
  );
});
export default StepCoordinates;