import React, { useState, forwardRef, useImperativeHandle } from "react";
import { TextField, Grid } from "@mui/material";
import { apiUrl } from '../../config/api';
import { isNonEmptyString } from '../../utils/validationUtils';

/**
 * AddressFields
 * Champs d'adresse réutilisables pour formulaire (création/modification)
 * Props :
 *   - address: { street, number }
 *   - onChange: (field, value) => void
 *   - disabled: bool (optionnel)
 */

/**
 * AddressFields autonome avec validation intégrée
 * Utilise forwardRef pour exposer une méthode validate()
 */
const AddressFields = forwardRef(({ addressNumber, streetName, cityId, onChange, disabled = false }, ref) => {
  const [streetError, setStreetError] = useState(false);
  const [streetHelper, setStreetHelper] = useState('');
  const [numberError, setNumberError] = useState(false);
  const [numberHelper, setNumberHelper] = useState('');
  const [uniqueError, setUniqueError] = useState('');

  // Validation locale + unicité
  useImperativeHandle(ref, () => ({
    /**
     * Validation locale synchrone (sans appel API)
     * @returns {{valid: boolean}}
     */
    validateLocal: () => {
      const streetValid = isNonEmptyString(streetName);
      const numberValid = isNonEmptyString(addressNumber);
      return { valid: streetValid && numberValid };
    },
    /**
     * Valide les champs et vérifie l'unicité de l'adresse (cityId + numéro + rue)
     * @returns {Promise<{valid: boolean, message?: string}>}
     */
    validateAndCheckUnique: async () => {
      let valid = true;
      setUniqueError('');
      if (!isNonEmptyString(streetName)) {
        setStreetError(true);
        setStreetHelper('La rue est obligatoire.');
        valid = false;
      } else {
        setStreetError(false);
        setStreetHelper('');
      }
      if (!isNonEmptyString(addressNumber)) {
        setNumberError(true);
        setNumberHelper('Le numéro est obligatoire.');
        valid = false;
      } else {
        setNumberError(false);
        setNumberHelper('');
      }
      // Vérification unicité si cityId fourni et champs valides
      if (valid && cityId && isNonEmptyString(streetName) && isNonEmptyString(addressNumber)) {
        const checkAddress = await fetch(apiUrl(`/restaurants/check-address?cityId=${encodeURIComponent(cityId)}&addressNumber=${encodeURIComponent(addressNumber)}&streetName=${encodeURIComponent(streetName)}`));
        const checkAddressData = await checkAddress.json();
        if (checkAddressData.exists) {
          setUniqueError('Un restaurant existe déjà à cette adresse.');
          return { valid: false, message: 'Un restaurant existe déjà à cette adresse.' };
        }
      }
      setUniqueError('');
      return valid ? { valid: true } : { valid: false, message: streetHelper || numberHelper };
    },
    getError: () => {
      // Retourne tous les messages d'erreur courants (rue, numéro, unicité)
      const errors = [];
      if (streetHelper) errors.push(streetHelper);
      if (numberHelper) errors.push(numberHelper);
      if (uniqueError) errors.push(uniqueError);
      return errors;
    }
  }));

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 8 }}>
        <TextField
          label="Rue"
          value={streetName || ""}
          onChange={e => {
            onChange("streetName", e.target.value);
            setStreetError(false);
            setStreetHelper('');
            setUniqueError('');
          }}
          fullWidth
          disabled={disabled}
          required
          error={streetError}
          helperText={streetHelper}
        />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField
          label="Numéro"
          value={addressNumber || ""}
          onChange={e => {
            onChange("addressNumber", e.target.value);
            setNumberError(false);
            setNumberHelper('');
            setUniqueError('');
          }}
          fullWidth
          disabled={disabled}
          required
          error={numberError}
          helperText={numberHelper}
        />
      </Grid>
      {/* Affichage de l'erreur d'unicité */}
      {uniqueError && (
        <Grid size={{ xs: 12 }}>
          <span style={{ color: 'red', fontSize: 13 }}>{uniqueError}</span>
        </Grid>
      )}
    </Grid>
  );
});

export default AddressFields;
