import React, { useState, useCallback, useEffect } from "react";
import { Autocomplete, TextField, Grid } from "@mui/material";


/**
 * CityAutocomplete
 * Composant autonome pour l'autocomplétion de la ville et du code postal
 * Gère la logique de recherche, l'état sélectionné et l'affichage
 * Props :
 *   - value: valeur initiale (optionnel)
 *   - onChange: (newValue) => void (optionnel)
 *   - disabled: bool (optionnel)
 */
const CityAutocomplete = ({ value = null, onChange, disabled = false }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityValue, setCityValue] = useState(value);
  const [cityInput, setCityInput] = useState("");

  // Recherche API avec debounce
  const searchCities = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setCityOptions([]);
      return;
    }
    setCityLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cities/autocomplete?q=${encodeURIComponent(query)}`);
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
      if (cityInput.length >= 2) {
        searchCities(cityInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [cityInput, searchCities]);

  // Handler pour l'input utilisateur
  const handleCityInputChange = (_, newInputValue) => {
    setCityInput(newInputValue.trimStart());
  };

  // Handler pour la sélection
  const handleChange = (_, newValue) => {
    setCityValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Grid item xs={12} sm={6}>
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
          <TextField {...params} label="Ville / Code postal" required />
        )}
      />
    </Grid>
  );
};

export default CityAutocomplete;
