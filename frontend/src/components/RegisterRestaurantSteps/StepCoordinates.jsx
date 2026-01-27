import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import PhoneField from '../restaurantFormComponents/PhoneField';
import WebsiteField from '../restaurantFormComponents/WebsiteField';
import AddressFields from '../restaurantFormComponents/AddressFields';
import CityAutocomplete from '../restaurantFormComponents/CityAutocompleteField';
import ErrorDisplay from '../restaurantFormComponents/ErrorDisplay';

/**
 * Composant StepCoordinates
 * Gère la saisie et la validation des coordonnées du restaurant (site web, téléphone, adresse)
 * Utilise des sous-composants réutilisables et un hook personnalisé pour la recherche de ville
 * @param {object} contact - L'objet contenant les valeurs du formulaire
 * @param {function} setContact - Fonction pour mettre à jour l'objet contact
 */
const StepCoordinates = forwardRef(({ contact, setContact }, ref) => {
  // Refs pour les champs autonomes
  const phoneRef = useRef();
  const websiteRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();

  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    /**
     * Valide tous les champs du formulaire via les refs des Fields
     */
    validate: async () => {
      // 1. ValidationS
      const phoneValid = phoneRef.current?.validate();
      const websiteValid = websiteRef.current?.validate();
      const cityResult = cityRef.current?.validateFields();
      const addressValid = await addressRef.current?.validateAndCheckUnique();
      // 4. Récupération du numéro formaté via PhoneField autonome
      setContact({ ...contact, phone: phoneRef.current.getFormatted() });
      // La gestion des erreurs et leur affichage sont déléguées aux champs et à ErrorDisplay
      // Cette fonction peut simplement retourner true si tout est valide
      return phoneValid && websiteValid && cityResult?.valid && addressValid?.valid;
    }
  }), [contact, setContact]);

  // Regroupe tous les messages d'erreur des champs autonomes
  const getAllFieldErrors = () => {
    const errors = [];
    if (phoneRef.current?.getError) {
      const err = phoneRef.current.getError();
      if (err) errors.push(err);
    }
    if (websiteRef.current?.getError) {
      const err = websiteRef.current.getError();
      if (err) errors.push(err);
    }
    if (addressRef.current?.getError) {
      const errs = addressRef.current.getError();
      if (errs && Array.isArray(errs)) errors.push(...errs);
      else if (errs) errors.push(errs);
    }
    return errors;
  };

  // ...existing code...
  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

      {/* Affichage des erreurs de validation */}
      {/* Affichage des erreurs uniquement après soumission (clic sur Suivant) */}
      <ErrorDisplay errors={getAllFieldErrors()} />

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