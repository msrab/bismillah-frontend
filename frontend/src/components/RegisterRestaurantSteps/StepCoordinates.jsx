import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import AddressFields from '../common/AddressFields';
import CityAutocomplete from '../common/CityAutocomplete';
import ErrorDisplay from '../common/ErrorDisplay';
import useCitySearch from '../../hooks/useCitySearch';
import { validateAddress, isValidBelgianPhoneNumber, isValidWebsiteUrl } from '../../utils/validation';

const StepCoordinates = forwardRef(({ contact, setContact }, ref) => {
  const [errors, setErrors] = useState([]);
  const [websiteError, setWebsiteError] = useState('');
  const { cityOptions, cityLoading, setCitySearch } = useCitySearch();

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setErrors([]);
      setWebsiteError('');
      // Validation locale
      const addressErrors = validateAddress({
        street: contact.streetName,
        number: contact.addressNumber,
        city: contact.cityName,
        postalCode: contact.postalCode
      });
      if (!contact.phone || !contact.phone.trim()) {
        addressErrors.push('Le numéro de téléphone est requis');
      } else if (!isValidBelgianPhoneNumber(contact.phone.trim())) {
        addressErrors.push('Le numéro de téléphone doit être belge, commencer par +32 et être valide.');
      }
      if (contact.website && contact.website.trim()) {
        if (!isValidWebsiteUrl(contact.website.trim())) {
          setWebsiteError("Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)");
          addressErrors.push("Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)");
        }
      }
      if (addressErrors.length > 0) {
        setErrors(addressErrors);
        return { valid: false, message: addressErrors[0] };
      }
      // Recherche ou création de la ville en BD avant de vérifier l'adresse
      let cityId;
      if (
        contact.cityName && contact.cityName.trim() &&
        contact.postalCode && contact.postalCode.trim() &&
        contact.countryId
      ) {
        const searchRes = await fetch(`http://localhost:5000/api/cities/search?name=${encodeURIComponent(contact.cityName)}&postalCode=${encodeURIComponent(contact.postalCode)}&countryId=${encodeURIComponent(contact.countryId)}`);
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0 && searchData[0].id && !isNaN(Number(searchData[0].id))) {
          cityId = searchData[0].id;
        } else {
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
        setContact({ ...contact, cityId });
      }
      // Vérification unicité adresse (cityId + numéro + nom de rue)
      if (cityId && contact.addressNumber.trim() && contact.streetName.trim()) {
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
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

      <ErrorDisplay errors={errors} />

      <TextField
        label="Site web"
        fullWidth
        sx={{ mb: 2 }}
        value={contact.website}
        onChange={(e) => setContact({ ...contact, website: e.target.value })}
        placeholder="https://www.monrestaurant.be"
        error={!!websiteError}
        helperText={websiteError}
        InputProps={{
          startAdornment: <InputAdornment position="start">🌐</InputAdornment>
        }}
      />

      <TextField
        label="Téléphone"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.phone}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        placeholder="4XXXXXXXX ou 2XXXXXXX"
        InputProps={{
          startAdornment: <InputAdornment position="start">+32</InputAdornment>
        }}
      />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>
        Adresse du restaurant
      </Typography>

      <CityAutocomplete
        value={contact.cityName && contact.postalCode ? { postalCode: contact.postalCode, localityName: contact.cityName, countryId: contact.countryId } : null}
        options={cityOptions}
        onChange={(_, newValue) => {
          if (newValue) {
            setContact({
              ...contact,
              cityName: newValue.localityName || '',
              postalCode: newValue.postalCode || '',
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
        onInputChange={(_, newInputValue) => {
          setCitySearch(newInputValue);
          setContact({
            ...contact,
            cityId: null,
            cityName: newInputValue,
            postalCode: '',
            countryId: 1
          });
        }}
        loading={cityLoading}
        disabled={false}
      />

      <AddressFields
        address={{ street: contact.streetName, number: contact.addressNumber, box: contact.addressBox }}
        onChange={(field, value) => {
          if (field === 'street') setContact({ ...contact, streetName: value });
          if (field === 'number') setContact({ ...contact, addressNumber: value });
          if (field === 'box') setContact({ ...contact, addressBox: value });
        }}
      />
    </Box>
  );
});
export default StepCoordinates;