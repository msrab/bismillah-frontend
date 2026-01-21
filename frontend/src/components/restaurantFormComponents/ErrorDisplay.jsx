import React from "react";
import { Alert, List, ListItem, ListItemText } from "@mui/material";

/**
 * ErrorDisplay
 * Affiche une liste d'erreurs de validation ou d'API
 * Props :
 *   - errors: string[] (tableau de messages d'erreur)
 */
const ErrorDisplay = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <List dense>
        {errors.map((err, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemText primary={err} />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

export default ErrorDisplay;
