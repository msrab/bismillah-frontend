import React from "react";
import { Autocomplete, TextField, Grid } from "@mui/material";

/**
 * CityAutocomplete
 * Composant réutilisable pour l'autocomplétion de la ville et du code postal
 * Props :
 *   - value: { postalCode, localityName }
 *   - options: tableau d'options { postalCode, localityName }
 *   - onChange: (event, newValue) => void
 *   - loading: bool (optionnel)
 *   - disabled: bool (optionnel)
 */
const CityAutocomplete = ({ value, options, onChange, loading = false, disabled = false }) => (
  <Grid item xs={12} sm={6}>
    <Autocomplete
      options={options}
      getOptionLabel={option => option ? `${option.postalCode} ${option.localityName}` : ''}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      isOptionEqualToValue={(option, val) => option && val && option.postalCode === val.postalCode && option.localityName === val.localityName}
      renderInput={params => (
        <TextField {...params} label="Ville / Code postal" required />
      )}
    />
  </Grid>
);

export default CityAutocomplete;
