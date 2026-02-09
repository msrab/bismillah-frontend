import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Autocomplete, TextField, Typography, Box, Chip } from '@mui/material';

/**
 * RestaurantTypeAutocomplete
 * - Recherche les types de restaurant validés par nom
 * - Permet de créer un nouveau type si aucun résultat
 * - Validation: alphabétique uniquement, max 30 caractères
 */
const RestaurantTypeAutocomplete = forwardRef(({ value = null, onChange, required = false, disabled = false }, ref) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(value);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Regex pour validation: lettres uniquement (avec accents et espaces)
  const isValidInput = (text) => /^[a-zA-ZàâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇœŒæÆ\s]*$/.test(text);

  // Recherche des types validés
  useEffect(() => {
    if (inputValue.length < 1) {
      setOptions([]);
      setNoResults(false);
      return;
    }

    // Validation du format
    if (!isValidInput(inputValue)) {
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/api/restaurant-types/search?q=${encodeURIComponent(inputValue)}&languageId=1`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOptions(data);
          setNoResults(data.length === 0 && inputValue.length >= 2);
        } else {
          setOptions([]);
          setNoResults(inputValue.length >= 2);
        }
      })
      .catch(() => {
        setOptions([]);
        setNoResults(inputValue.length >= 2);
      })
      .finally(() => setLoading(false));
  }, [inputValue]);

  // Validation automatique
  useEffect(() => {
    if (touched) {
      if (required && !selectedValue && !inputValue.trim()) {
        setError('Le type de restaurant est requis.');
      } else {
        setError('');
      }
    }
  }, [selectedValue, inputValue, required, touched]);

  // Expose les méthodes au parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      setTouched(true);
      
      // Cas 1: Un type existant est sélectionné
      if (selectedValue && selectedValue.id) {
        setError('');
        return { valid: true };
      }
      
      // Cas 2: Nouveau type à créer (texte saisi mais pas de sélection)
      if (inputValue.trim() && !selectedValue) {
        if (!isValidInput(inputValue)) {
          setError('Uniquement des lettres sont autorisées.');
          return { valid: false };
        }
        if (inputValue.trim().length < 2) {
          setError('Le type doit contenir au moins 2 caractères.');
          return { valid: false };
        }
        if (inputValue.trim().length > 30) {
          setError('Le type ne peut pas dépasser 30 caractères.');
          return { valid: false };
        }
        setError('');
        return { valid: true, isNewType: true };
      }
      
      // Cas 3: Champ requis mais vide
      if (required) {
        setError('Le type de restaurant est requis.');
        return { valid: false };
      }
      
      setError('');
      return { valid: true };
    },
    getError: () => error,
    getValue: () => {
      // Retourne l'id si type existant, sinon le nom du nouveau type
      if (selectedValue && selectedValue.id) {
        return { restaurantTypeId: selectedValue.id, newTypeName: null };
      }
      if (inputValue.trim()) {
        return { restaurantTypeId: null, newTypeName: inputValue.trim() };
      }
      return { restaurantTypeId: null, newTypeName: null };
    },
    isValid: () => {
      if (selectedValue && selectedValue.id) return true;
      if (inputValue.trim() && isValidInput(inputValue) && inputValue.trim().length >= 2 && inputValue.trim().length <= 30) return true;
      return !required;
    }
  }), [selectedValue, inputValue, error, required]);

  // Handler pour le changement d'input
  const handleInputChange = (_, newInputValue) => {
    // Filtrer les caractères non autorisés
    const filtered = newInputValue.replace(/[^a-zA-ZàâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇœŒæÆ\s]/g, '');
    // Limiter à 30 caractères
    const limited = filtered.slice(0, 30);
    setInputValue(limited);
    
    // Si l'input change, on réinitialise la sélection (sauf si c'est le nom du type sélectionné)
    if (selectedValue && limited !== selectedValue.name) {
      setSelectedValue(null);
      if (onChange) onChange(null);
    }
  };

  // Handler pour la sélection
  const handleChange = (_, newValue) => {
    setSelectedValue(newValue);
    setTouched(true);
    setError('');
    if (onChange) onChange(newValue);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.name || '';
        }}
        value={selectedValue}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onBlur={() => setTouched(true)}
        loading={loading}
        disabled={disabled}
        isOptionEqualToValue={(option, val) => option && val && option.id === val.id}
        filterOptions={(x) => x} // Désactiver le filtrage client, on utilise le serveur
        noOptionsText={
          inputValue.length < 2 
            ? "Tapez au moins 2 caractères..." 
            : "Aucun résultat trouvé"
        }
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{option.icon || '🍽️'}</span>
                <span>{option.name}</span>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Type de restaurant"
            required={required}
            error={touched && !!error}
            helperText={touched ? error : ''}
            placeholder="Ex: Pizzeria, Kebab, Snack..."
            inputProps={{
              ...params.inputProps,
              maxLength: 30
            }}
          />
        )}
      />
      
      {/* Message pour nouveau type */}
      {noResults && inputValue.trim().length >= 2 && (
        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            Le type "<strong>{inputValue.trim()}</strong>" n'existe pas encore.
          </Typography>
          <Typography variant="body2" color="info.contrastText" sx={{ mt: 0.5 }}>
            Il sera créé et soumis à validation par l'administration.
          </Typography>
        </Box>
      )}
      
      {/* Indicateur de type sélectionné */}
      {selectedValue && selectedValue.id && (
        <Chip
          label={`${selectedValue.icon || '🍽️'} ${selectedValue.name}`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
          onDelete={() => {
            setSelectedValue(null);
            setInputValue('');
            if (onChange) onChange(null);
          }}
        />
      )}
    </Box>
  );
});

export default RestaurantTypeAutocomplete;
