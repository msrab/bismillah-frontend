import React from "react";
import { TextField, Grid } from "@mui/material";

/**
 * AddressFields
 * Champs d'adresse réutilisables pour formulaire (création/modification)
 * Props :
 *   - address: { street, number, box }
 *   - onChange: (field, value) => void
 *   - disabled: bool (optionnel)
 */
const AddressFields = ({ address, onChange, disabled = false }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Rue"
        value={address.street || ""}
        onChange={e => onChange("street", e.target.value)}
        fullWidth
        disabled={disabled}
        required
      />
    </Grid>
    <Grid item xs={6} sm={3}>
      <TextField
        label="Numéro"
        value={address.number || ""}
        onChange={e => onChange("number", e.target.value)}
        fullWidth
        disabled={disabled}
        required
      />
    </Grid>
    <Grid item xs={6} sm={3}>
      <TextField
        label="Boîte (optionnel)"
        value={address.box || ""}
        onChange={e => onChange("box", e.target.value)}
        fullWidth
        disabled={disabled}
      />
    </Grid>
  </Grid>
);

export default AddressFields;
