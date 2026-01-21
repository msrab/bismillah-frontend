import React from "react";
import { TextField, Grid } from "@mui/material";

/**
 * AddressFields
 * Champs d'adresse réutilisables pour formulaire (création/modification)
 * Props :
 *   - address: { street, number }
 *   - onChange: (field, value) => void
 *   - disabled: bool (optionnel)
 */
const AddressFields = ({ addressNumber, streetName, onChange, disabled = false }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Rue"
        value={streetName || ""}
        onChange={e => onChange("streetName", e.target.value)}
        fullWidth
        disabled={disabled}
        required
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Numéro et boîte (ex: 12A, 12/5)"
        value={addressNumber || ""}
        onChange={e => onChange("addressNumber", e.target.value)}
        fullWidth
        disabled={disabled}
        required
      />
    </Grid>
  </Grid>
);

export default AddressFields;
