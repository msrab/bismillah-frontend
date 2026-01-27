import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import RestaurantNameField from '../restaurantFormComponents/RestaurantNameField';
import LogoUploadField from '../restaurantFormComponents/LogoUploadField';
import CompanyNumberField from '../restaurantFormComponents/CompanyNumberField';
import RestaurantTypeSelect from '../restaurantFormComponents/RestaurantTypeSelect';

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
  logoError
}, ref) => {
  // Plus besoin de gérer restaurantTypes ni loading ici, tout est dans RestaurantTypeSelect
  // Erreur de validation du numéro d'entreprise (affichée uniquement après validation globale)

  const [companyError, setCompanyError] = useState('');
  const [companyTouched, setCompanyTouched] = useState(false);


  // (chargement des types géré dans RestaurantTypeSelect)

  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    /**
     * Valide tous les champs du formulaire identité
     * - Validation locale (nom, numéro BCE)
     * - Vérifie l'unicité du numéro BCE via l'API
     * @returns {Promise<{valid: boolean, message?: string}>}
     */
    validate: async () => {
      setCompanyError('');
   
      // 1. Validation locale du nom
      if (!identity.name.trim()) {
        const message = 'Le nom du restaurant est requis';
        return { valid: false, message: message };
      }
      // 2. Validation locale du numéro BCE
      const num = identity.company_number.replace(/\D/g, '');
      if (!num || num.length !== 10) {
        const message = "Le numéro d'entreprise doit comporter exactement 10 chiffres.";
        setCompanyError(message);
        return { valid: false, message: message };
      }
      // 3. Vérification d'unicité du numéro BCE via l'API
      const companyNumberToCheck = `BE${num}`;
      try {
        const checkCompany = await fetch(`http://localhost:5000/api/restaurants/check-company-number?company_number=${encodeURIComponent(companyNumberToCheck)}`);
        const checkCompanyData = await checkCompany.json();
        if (!checkCompany.ok) {
          const message = "Erreur lors de la vérification du numéro d'entreprise.";
          setCompanyError(checkCompanyData.error || message);
          return { valid: false, message: checkCompanyData.error || message };
        }
        if (checkCompanyData.exists) {
          const message = "Ce numéro d'entreprise existe déjà.";
          setCompanyError(message);
          return { valid: false, message: message };
        }
        setCompanyError('');
        return { valid: true };
      } catch (err) {
        const message = "Erreur réseau lors de la vérification du numéro d'entreprise.";
        setCompanyError(message);
        return { valid: false, message: message };
      }
    }
  }), [identity]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Identité du restaurant
      </Typography>

      {/* Champ nom du restaurant */}
      <RestaurantNameField
        value={identity.name}
        onChange={e => setIdentity({ ...identity, name: e.target.value })}
        error={false}
        helperText={''}
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
        value={identity.company_number}
        onChange={e => {
          setCompanyTouched(true);
          // N'accepte que des chiffres, max 10, stocke toujours avec 'BE' devant
          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
          setIdentity({ ...identity, company_number: val ? `BE${val}` : '' });
          // Validation locale immédiate : efface l'erreur si le champ redevient valide
          if (!val || val.length !== 10) {
            setCompanyError("Le numéro d'entreprise doit comporter exactement 10 chiffres.");
          } else {
            setCompanyError('');
          }
        }}
        error={companyTouched && !!companyError}
        helperText={companyTouched ? companyError : ''}
        required
      />

      {/* Sélecteur du type de restaurant */}
      <RestaurantTypeSelect
        value={identity.restaurantTypeId}
        onChange={e => setIdentity({ ...identity, restaurantTypeId: e.target.value })}
        required
      />
    </Box>
  );
});
export default StepIdentity;