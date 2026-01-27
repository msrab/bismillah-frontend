import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
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
/**
 * CityAutocomplete
 * Composant autonome pour l'autocomplétion et la validation de la ville et du code postal.
 * - Recherche les villes via une API (avec debounce)
 * - Permet la création automatique de la ville si absente
 * - Expose une méthode validateAndEnsureCity() via ref pour garantir l'existence de la ville
 *
 * Props :
 *   - value: valeur initiale (optionnel)
 *   - onChange: (newValue) => void (optionnel)
 *   - disabled: bool (optionnel)
 *   - countryId: identifiant du pays (optionnel, défaut 1)
 */
  // --- État local ---
  // cityOptions : liste des villes proposées par l'autocomplete
  // cityLoading : état de chargement de la recherche
  // cityValue : valeur sélectionnée (objet {postalCode, localityName, countryId})
  // cityInput : valeur de l'input utilisateur (string)
  // error : message d'erreur affiché sous le champ
  // --- Recherche API avec debounce sur la saisie utilisateur ---
  // --- Expose la méthode validateAndEnsureCity au parent ---
  /**
   * Recherche ou crée la ville sélectionnée et retourne son id
   * - Si la ville existe déjà, retourne son id
   * - Sinon, tente de la créer en base et retourne le nouvel id
   * - Affiche un message d'erreur si la ville est absente ou la création échoue
   * @returns {Promise<{valid: boolean, cityId?: number, message?: string}>}
   */
  // --- Handler pour la saisie utilisateur dans l'autocomplete ---
  // --- Handler pour la sélection d'une ville dans la liste ---
  // --- Rendu du champ autocomplete avec gestion des erreurs ---
const CityAutocomplete = ({ value = null, onChange, disabled = false, countryId = 1 }, ref) => {
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
       * Recherche ou crée la ville sélectionnée et retourne son id
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
      if (Array.isArray(data)) {
        setCityOptions(data);
      } else {
        setCityOptions([]);
      }
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
