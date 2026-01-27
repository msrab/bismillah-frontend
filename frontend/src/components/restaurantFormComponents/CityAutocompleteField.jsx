
import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Autocomplete, TextField, Grid } from "@mui/material";
import { useCountry } from '../../context/CountryContext';


const cityFiles = {
  BE: '/data/belgium-cities-2025.json',
};

const CityAutocomplete = ({ value = null, onChange, disabled = false, countryId = 1 }, ref) => {
  const { countryIsoCode } = useCountry ? useCountry() : { countryIsoCode: 'BE' };
    const [error, setError] = useState("");
    // Expose la méthode validateAndEnsureCity au parent
    useImperativeHandle(ref, () => ({
      /**
       * Valide uniquement la saisie de la ville (pas d'appel API)
       * @returns {{valid: boolean, message?: string}}
       */
      validateFields: () => {
        if (!cityValue || !cityValue.localityName || !cityValue.postalCode) {
          setError("La ville et le code postal sont obligatoires.");
          return { valid: false, message: "La ville et le code postal sont obligatoires." };
        }
        setError("");
        return { valid: true };
      },
      /**
       * Recherche ou crée la ville sélectionnée dans la base de données et retourne son id
       * @returns {Promise<{valid: boolean, cityId?: number, message?: string}>}
       */
      ensureCityInDatabase: async () => {
        if (!cityValue || !cityValue.localityName || !cityValue.postalCode) {
          setError("La ville et le code postal sont obligatoires.");
          return { valid: false, message: "La ville et le code postal sont obligatoires." };
        }
        setError("");
        // Recherche la ville exacte
        const searchRes = await fetch(`http://localhost:5000/api/cities/search?name=${encodeURIComponent(cityValue.localityName)}&postalCode=${encodeURIComponent(cityValue.postalCode)}&countryId=${encodeURIComponent(countryId)}`);
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0 && searchData[0].id && !isNaN(Number(searchData[0].id))) {
          return { valid: true, cityId: searchData[0].id };
        } else {
          // Crée la ville si absente
          const cityPayload = {
            name: cityValue.localityName,
            postalCode: cityValue.postalCode,
            countryId: countryId
          };
          const cityRes = await fetch('http://localhost:5000/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cityPayload)
          });
          const cityData = await cityRes.json();
          if (cityRes.ok && cityData.id && !isNaN(Number(cityData.id))) {
            return { valid: true, cityId: cityData.id };
          } else {
            setError(cityData.message || "Impossible de créer la ville.");
            return { valid: false, message: cityData.message || "Impossible de créer la ville." };
          }
        }
      }
    }));
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityValue, setCityValue] = useState(value);
  const [cityInput, setCityInput] = useState("");

  // Autocomplete dynamique via backend selon le pays
  useEffect(() => {
    if (cityInput.length < 2) {
      setCityOptions([]);
      return;
    }
    setCityLoading(true);
    // Appel à l'API backend pour l'autocomplétion
    fetch(`http://localhost:5000/api/cities/autocomplete?q=${encodeURIComponent(cityInput)}&countryIsoCode=${encodeURIComponent(countryIsoCode)}`)
      .then(res => res.json())
      .then(data => {
        // Le backend doit retourner [{ postalCode, name, id }]
        setCityOptions(data.map(city => ({
          postalCode: city.postalCode,
          localityName: city.name,
          id: city.id
        })));
      })
      .catch(() => setCityOptions([]))
      .finally(() => setCityLoading(false));
  }, [cityInput, countryIsoCode]);

  // Handler pour l'input utilisateur
  const handleCityInputChange = (_, newInputValue) => {
    setCityInput(newInputValue.trimStart());
  };

  // Handler pour la sélection
  const handleChange = (_, newValue) => {
    setCityValue(newValue);
    setError("");
    if (onChange) onChange(newValue);
  };

  return (
    <Grid>
      <Autocomplete
        options={cityOptions}
        getOptionLabel={option => option ? `${option.postalCode} ${option.localityName}` : ''}
        value={cityValue}
        onChange={handleChange}
        onInputChange={handleCityInputChange}
        loading={cityLoading}
        disabled={disabled}
        isOptionEqualToValue={(option, val) => option && val && option.postalCode === val.postalCode && option.localityName === val.localityName}
        renderInput={params => (
          <TextField {...params} label="Ville / Code postal" required error={!!error} helperText={error} />
        )}
      />
    </Grid>
  );
};

export default React.forwardRef(CityAutocomplete);
