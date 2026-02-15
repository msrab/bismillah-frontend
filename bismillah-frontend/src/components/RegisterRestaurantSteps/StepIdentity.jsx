import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import { apiUrl } from '../../config/api';
import RestaurantNameField from '../restaurantFormComponents/RestaurantNameField';
import LogoUploadField from '../restaurantFormComponents/LogoUploadField';
import CompanyNumberField from '../restaurantFormComponents/CompanyNumberField';
import RestaurantTypeAutocomplete from '../restaurantFormComponents/RestaurantTypeAutocomplete';

/**
 * Composant StepIdentity
 * Gère la saisie et la validation de l'identité du restaurant (nom, logo, numéro BCE, type)
 * Utilise des sous-composants réutilisables pour chaque champ
 * @param {object} identity - L'objet contenant les valeurs du formulaire identité
 * @param {function} setIdentity - Fonction pour mettre à jour l'objet identity
 * @param {File|null} logo - Fichier logo sélectionné
 * @param {string|null} logoPreview - URL d'aperçu du logo
 * @param {function} handleLogoChange - Handler pour le changement de logo
 * @param {function} resetLogo - Handler pour réinitialiser le logo
 * @param {string} logoError - Message d'erreur pour le logo
 */
const StepIdentity = forwardRef(({
  identity,
  setIdentity,
  logo,
  logoPreview,
  handleLogoChange,
  resetLogo,
  logoError,
  onStepValidChange
}, ref) => {

  const nameRef = useRef();
  const companyRef = useRef();
  const typeRef = useRef();

  // Etat local pour la validité live de la step
  const [isStepValid, setIsStepValid] = useState(false);
  // Debug : log chaque changement d'identity
  useEffect(() => {}, [identity]);
  useEffect(() => {}, [isStepValid]);

  // Met à jour la validité à chaque changement de champ (utilise isValid, pas validate)
  useEffect(() => {
    const nameValid = nameRef.current?.isValid?.() ?? false;
    const companyValid = companyRef.current?.isValid?.() ?? false;
    const typeValid = typeRef.current?.isValid?.() ?? false;
    const valid = nameValid && companyValid && typeValid;
    setIsStepValid(valid);
    if (onStepValidChange) onStepValidChange(valid);
  });

  // Expose la méthode validate (API) et le booléen isStepValid
  useImperativeHandle(ref, () => ({
    isStepValid,
    validate: async () => {
      const nameResult = nameRef.current?.validate && nameRef.current.validate();
      const companyResult = companyRef.current?.validate && companyRef.current.validate();
      const typeResult = typeRef.current?.validate && typeRef.current.validate();
      console.log('[DEBUG StepIdentity validate] nameResult:', nameResult, 'companyResult:', companyResult, 'typeResult:', typeResult);
      if (!nameResult?.valid || !companyResult?.valid || !typeResult?.valid) {
        return { valid: false };
      }
      // Uniqueness check for company number (Belgium)
      const companyNumber = companyRef.current?.getValue() || '';
      if (companyNumber.startsWith('BE') && companyNumber.length === 12) {
        try {
          const checkCompany = await fetch(apiUrl(`/restaurants/check-company-number?company_number=${encodeURIComponent(companyNumber)}`));
          const checkCompanyData = await checkCompany.json();
          if (!checkCompany.ok) {
            companyRef.current?.setError && companyRef.current.setError(checkCompanyData.error || "Erreur lors de la vérification du numéro d'entreprise.");
            // ...
            return { valid: false, message: checkCompanyData.error || "Erreur lors de la vérification du numéro d'entreprise." };
          }
          if (checkCompanyData.exists) {
            companyRef.current?.setError && companyRef.current.setError("Ce numéro d'entreprise existe déjà.");
            // ...
            return { valid: false, message: "Ce numéro d'entreprise existe déjà." };
          }
        } catch (err) {
          companyRef.current?.setError && companyRef.current.setError("Erreur réseau lors de la vérification du numéro d'entreprise.");
          // ...
          return { valid: false, message: "Erreur réseau lors de la vérification du numéro d'entreprise." };
        }
      }
      // ...
      return { valid: true };
    },
    getAllFieldErrors: () => {
      const errors = [];
      if (nameRef.current?.getError) {
        const err = nameRef.current.getError();
        if (err) errors.push(err);
      }
      if (companyRef.current?.getError) {
        const err = companyRef.current.getError();
        if (err) errors.push(err);
      }
      if (typeRef.current?.getError) {
        const err = typeRef.current.getError();
        if (err) errors.push(err);
      }
      return errors;
    },
    getFormData: () => {
      const typeValue = typeRef.current?.getValue() || {};
      return {
        name: nameRef.current?.getValue() || '',
        company_number: companyRef.current?.getValue() || '',
        restaurantTypeId: typeValue.restaurantTypeId || null,
        newTypeName: typeValue.newTypeName || null
      };
    }
  }), [isStepValid]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Identité du restaurant
      </Typography>

      {/* Champ nom du restaurant */}
      <RestaurantNameField
        ref={nameRef}
        value={identity.name}
        onChange={val => setIdentity(prev => ({ ...prev, name: val }))}
        required
      />

      {/* Upload du logo du restaurant (optionnel) */}
      <LogoUploadField
        logo={logo}
        logoPreview={logoPreview}
        handleLogoChange={handleLogoChange}
        resetLogo={resetLogo}
        error={logoError}
      />

      {/* Champ numéro d'entreprise (BCE) */}
      {/* Champ numéro d'entreprise (BCE) - l'erreur ne s'affiche que lors de la validation globale */}
      <CompanyNumberField
        ref={companyRef}
        value={identity.company_number}
        onChange={val => setIdentity(prev => ({ ...prev, company_number: val }))}
        required
        resetTrigger={identity}
      />

      {/* Sélecteur du type de restaurant (autocomplete) */}
      <RestaurantTypeAutocomplete
        ref={typeRef}
        value={identity.restaurantType}
        onChange={val => setIdentity(prev => ({ ...prev, restaurantType: val }))}
        required
      />
    </Box>
  );
});
export default StepIdentity;