import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, InputAdornment, Autocomplete, CircularProgress } from '@mui/material';

const StepCoordinates = forwardRef(({ contact, setContact }, ref) => {
  const [citySearch, setCitySearch] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
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

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(citySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, searchCities]);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setAddressError('');
      setWebsiteError('');
      if (!contact.phone.trim()) {
        return { valid: false, message: 'Le numéro de téléphone est requis' };
      }
      if (contact.website && contact.website.trim()) {
        // Validation du format d'URL (domaine + extension, sous-domaines autorisés, chemin autorisé)
        const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(:[0-9]{2,5})?(\/.*)?$/;
        if (!urlRegex.test(contact.website.trim())) {
          setWebsiteError("Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)");
          return { valid: false, message: "Format d'URL invalide (ex: monrestaurant.be, www.monrestaurant.be, https://monrestaurant.be)" };
        }
      }
      if (!contact.cityName || !contact.postalCode) {
        return { valid: false, message: 'Veuillez sélectionner une ville' };
      }
      if (!contact.streetName.trim()) {
        return { valid: false, message: 'Le nom de rue est requis' };
      }
      if (!contact.address_number.trim()) {
        setAddressError("Le numéro d'adresse est requis");
        return { valid: false, message: "Le numéro d'adresse est requis" };
      }
      // Recherche ou création de la ville en BD avant de vérifier l'adresse
      let cityId = contact.cityId;
      if (!cityId && contact.cityName && contact.postalCode && contact.countryId) {
        // 1. Chercher la ville exacte en BD
        const searchRes = await fetch(`http://localhost:5000/api/cities/search?name=${encodeURIComponent(contact.cityName)}&postalCode=${encodeURIComponent(contact.postalCode)}&countryId=${encodeURIComponent(contact.countryId)}`);
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0 && searchData[0].id) {
          cityId = searchData[0].id;
        } else {
          // 2. Créer la ville si absente
          const cityPayload = {
            name: contact.cityName,
            postal_code: contact.postalCode,
            countryId: contact.countryId
          };
          const cityRes = await fetch('http://localhost:5000/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cityPayload)
          });
          const cityData = await cityRes.json();
          if (cityRes.ok && cityData.id) {
            cityId = cityData.id;
          } else {
            setAddressError(cityData.message || "Impossible de créer la ville.");
            return { valid: false, message: cityData.message || "Impossible de créer la ville." };
          }
        }
        // Met à jour le state contact avec le vrai cityId
        setContact({ ...contact, cityId });
      }
      // Vérification unicité adresse (cityId + numéro)
      if (cityId && contact.address_number.trim()) {
        const checkAddress = await fetch(`http://localhost:5000/api/restaurants/check-address?cityId=${encodeURIComponent(cityId)}&address_number=${encodeURIComponent(contact.address_number)}`);
        const checkAddressData = await checkAddress.json();
        if (checkAddressData.exists) {
          setAddressError("Un restaurant existe déjà à cette adresse.");
          return { valid: false, message: "Un restaurant existe déjà à cette adresse." };
        }
      }
      setAddressError('');
      setWebsiteError('');
      return { valid: true };
    }
  }), [contact]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

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

      {/* Autocomplétion ville */}
      <Autocomplete
        options={cityOptions}
        getOptionLabel={(option) => `${option.postal_code} - ${option.name}`}
        loading={cityLoading}
        value={contact.cityId ? { id: contact.cityId, name: contact.cityName, postal_code: contact.postalCode, country_id: contact.countryId } : null}
        onChange={(_, newValue) => {
          if (newValue) {
            setContact({
              ...contact,
              cityId: newValue.id,
              cityName: newValue.name,
              postalCode: newValue.postal_code,
              countryId: newValue.country_id || 1
            });
          } else {
            setContact({
              ...contact,
              cityId: null,
              cityName: '',
              postalCode: '',
              countryId: 1
            });
          }
        }}
        onInputChange={(_, newInputValue) => {
          setCitySearch(newInputValue);
          // Si l'utilisateur modifie le champ, on reset la sélection
          setContact({
            ...contact,
            cityId: null,
            cityName: newInputValue,
            postalCode: '',
            countryId: 1
          });
        }}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Ville ou code postal"
            required
            sx={{ mb: 2 }}
            placeholder="Tapez un nom de ville ou code postal..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        noOptionsText="Aucune ville trouvée"
        loadingText="Recherche..."
      />

      <TextField
        label="Nom de la rue"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.streetName}
        onChange={(e) => setContact({ ...contact, streetName: e.target.value })}
        placeholder="Rue de Flandre"
      />

      <TextField
        label="Numéro"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.address_number}
        onChange={(e) => setContact({ ...contact, address_number: e.target.value })}
        placeholder="123A"
        error={!!addressError}
        helperText={addressError}
      />
    </Box>
  );
});
export default StepCoordinates;