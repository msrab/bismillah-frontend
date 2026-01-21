import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import PhoneField from '../common/PhoneField';
import WebsiteField from '../common/WebsiteField';
import AddressFields from '../common/AddressFields';
import CityAutocomplete from '../common/CityAutocomplete';
import ErrorDisplay from '../common/ErrorDisplay';
import { validateAddress, isValidBelgianPhoneNumber, isValidWebsiteUrl } from '../../utils/validation';

/**
 * Composant StepCoordinates
 * Gère la saisie et la validation des coordonnées du restaurant (site web, téléphone, adresse)
 * Utilise des sous-composants réutilisables et un hook personnalisé pour la recherche de ville
 * @param {object} contact - L'objet contenant les valeurs du formulaire
 * @param {function} setContact - Fonction pour mettre à jour l'objet contact
 */
const StepCoordinates = forwardRef(({ contact, setContact }, ref) => {
  // État pour les erreurs de validation générales
  const [errors, setErrors] = useState([]);
  // État pour l'erreur spécifique au site web
  const [websiteError, setWebsiteError] = useState('');

  // Expose la méthode validate au parent via la ref
  useImperativeHandle(ref, () => ({
    /**
     * Valide tous les champs du formulaire
     * - Validation locale (adresse, téléphone, site web)
     * - Recherche ou création de la ville en base
     * - Vérifie l'unicité de l'adresse
     * @returns {Promise<{valid: boolean, message?: string}>}
     */
    validate: async () => {
      setErrors([]);
      setWebsiteError('');
      // 1. Validation locale des champs principaux
      const addressErrors = validateAddress({
        street: contact.streetName,
        number: contact.addressNumber,
        city: contact.cityName,
        postalCode: contact.postalCode
      });
      // Validation du téléphone belge
      if (!contact.phone) {
        addressErrors.push('Le numéro de téléphone est requis');
      } else if (!isValidBelgianPhoneNumber(contact.phone)) {
        addressErrors.push('Le numéro de téléphone doit être belge, commencer par +32 et être valide.');
      }
      // Validation du site web si renseigné
      if (contact.website) {
        if (!isValidWebsiteUrl(contact.website)) {
          setWebsiteError("Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)");
          addressErrors.push("Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)");
        }
      }
      // Si erreurs locales, on les affiche et on arrête
      if (addressErrors.length > 0) {
        setErrors(addressErrors);
        return { valid: false, message: addressErrors[0] };
      }
      // 2. Recherche ou création de la ville en base de données
      let cityId;
      if ( contact.cityName && contact.postalCode && contact.countryId) {
        // Recherche la ville exacte
        const searchRes = await fetch(`http://localhost:5000/api/cities/search?name=${encodeURIComponent(contact.cityName)}&postalCode=${encodeURIComponent(contact.postalCode)}&countryId=${encodeURIComponent(contact.countryId)}`);
        const searchData = await searchRes.json();
        
        if (Array.isArray(searchData) && searchData.length > 0 && searchData[0].id && !isNaN(Number(searchData[0].id))) {
          cityId = searchData[0].id;
        } else {
          // Crée la ville si absente
          const cityPayload = {
            name: contact.cityName,
            postalCode: contact.postalCode,
            countryId: contact.countryId
          };
          const cityRes = await fetch('http://localhost:5000/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cityPayload)
          });
          const cityData = await cityRes.json();
          if (cityRes.ok && cityData.id && !isNaN(Number(cityData.id))) {
            cityId = cityData.id;
          } else {
            setErrors([cityData.message || "Impossible de créer la ville."]);
            return { valid: false, message: cityData.message || "Impossible de créer la ville." };
          }
        }
        // Met à jour le contact avec l'id de la ville
        setContact({ ...contact, cityId });
      }
      // 3. Vérifie l'unicité de l'adresse (cityId + numéro + rue)
      if (cityId && contact.addressNumber && contact.streetName) {
        const checkAddress = await fetch(`http://localhost:5000/api/restaurants/check-address?cityId=${encodeURIComponent(cityId)}&addressNumber=${encodeURIComponent(contact.addressNumber)}&streetName=${encodeURIComponent(contact.streetName)}`);
        const checkAddressData = await checkAddress.json();
        if (checkAddressData.exists) {
          setErrors(["Un restaurant existe déjà à cette adresse."]);
          return { valid: false, message: "Un restaurant existe déjà à cette adresse." };
        }
      }
      setErrors([]);
      setWebsiteError('');
      return { valid: true };
    }
  }), [contact, setContact]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

      {/* Affichage des erreurs de validation */}
      <ErrorDisplay errors={errors} />

      {/* Champ site web avec validation (composant réutilisable) */}
      <WebsiteField
        value={contact.website}
        onChange={e => setContact({ ...contact, website: e.target.value })}
        error={!!websiteError}
        helperText={websiteError}
      />

      {/* Champ téléphone belge avec préfixe +32 (composant réutilisable) */}
      <PhoneField
        value={contact.phone}
        onChange={e => setContact({ ...contact, phone: e.target.value.trimStart() })}
        error={false}
        helperText={''}
        required
      />

      {/* Sous-titre pour la section adresse */}
      <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>
        Adresse du restaurant
      </Typography>

      {/* Autocomplétion ville/code postal avec recherche API */}
      <CityAutocomplete
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

      {/* Champs d'adresse (rue, numéro) */}
      <AddressFields
        streetName={contact.streetName}
        addressNumber={contact.addressNumber}
        onChange={(field, value) => {
          if (field === 'streetName') setContact({ ...contact, streetName: value });
          if (field === 'addressNumber') setContact({ ...contact, addressNumber: value });
        }}
      />
    </Box>
  );
});
export default StepCoordinates;