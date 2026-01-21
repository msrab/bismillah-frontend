import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, InputAdornment, CircularProgress } from '@mui/material';
import AddressFields from '../common/AddressFields';
import CityAutocomplete from '../common/CityAutocomplete';
import ErrorDisplay from '../common/ErrorDisplay';
import { validateAddress } from '../../utils/validation';

const StepCoordinates = forwardRef(({ contact, setContact }, ref) => {
  const [citySearch, setCitySearch] = useState('');
  const [cityOptions, setCityOptions] = useState([]);

  // Debug: log cityOptions whenever it changes
  useEffect(() => {
    console.log('cityOptions:', cityOptions);
  }, [cityOptions]);
  const [cityLoading, setCityLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [websiteError, setWebsiteError] = useState('');

  // Recherche de villes avec debounce
  const searchCities = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setCityOptions([]);
      return;
    }
    setCityLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cities/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setCityOptions(data);
    } catch (error) {
      setCityOptions([]);
    } finally {
      setCityLoading(false);
    }
  }, []);

  // Lance la recherche à chaque saisie (dès 2 caractères), mais pas lors de la sélection d'une ville
  useEffect(() => {
    const timer = setTimeout(() => {
      if (citySearch.length >= 2) {
        searchCities(citySearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, searchCities]);

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
      }
      if (contact.website && contact.website.trim()) {
        const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(:[0-9]{2,5})?(\/.*)?$/;
        if (!urlRegex.test(contact.website.trim())) {
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
        placeholder="+32 2 123 45 67"
        InputProps={{
          startAdornment: <InputAdornment position="start">📞</InputAdornment>
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