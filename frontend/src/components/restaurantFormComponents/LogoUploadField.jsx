import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * LogoUploadField
 * Champ pour l'upload du logo du restaurant
 * Props :
 *   - logo: File|null
 *   - logoPreview: string|null
 *   - handleLogoChange: (event) => void
 *   - resetLogo: () => void
 *   - error: string (optionnel)
 */
const LogoUploadField = ({ logo, logoPreview, handleLogoChange, resetLogo, error }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
      Logo du restaurant (optionnel)
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {logoPreview && (
        <Box
          component="img"
          src={logoPreview}
          alt="Aperçu logo"
          sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2 }}
        />
      )}
      <Button variant="outlined" component="label">
        {logo ? 'Changer le logo' : 'Ajouter un logo'}
        <input
          type="file"
          hidden
          accept="image/png, image/jpeg"
          onChange={handleLogoChange}
        />
      </Button>
      {logo && (
        <Button color="error" onClick={resetLogo} size="small" sx={{ ml: 1 }}>
          Supprimer
        </Button>
      )}
    </Box>
    {error && (
      <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
        {error}
      </Typography>
    )}
  </Box>
);

export default LogoUploadField;
