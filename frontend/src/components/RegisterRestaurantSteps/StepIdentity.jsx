import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

// Étape 4 - Identité
export default function StepIdentity({ identity, setIdentity, handleLogoChange }) {
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setRestaurantTypes(Array.isArray(data) ? data : []))
      .catch(() => setRestaurantTypes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Identité du restaurant
      </Typography>

      <TextField
        label="Nom du restaurant"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={identity.name}
        onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
        placeholder="Ex: Restaurant Le Délice"
      />

      {/* Upload logo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          Logo du restaurant (optionnel)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {identity.logoPreview && (
            <Box
              component="img"
              src={identity.logoPreview}
              alt="Aperçu logo"
              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2 }}
            />
          )}
          <Button variant="outlined" component="label">
            {identity.logo ? 'Changer le logo' : 'Ajouter un logo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Button>
        </Box>
      </Box>

      <TextField
        label="Numéro d'entreprise (BCE)"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={identity.company_number}
        onChange={(e) => setIdentity({ ...identity, company_number: e.target.value })}
        placeholder="BE0123456789"
        helperText="Format belge: BE suivi de 10 chiffres"
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type de restaurant</InputLabel>
        {loading ? (
          <Select value="" label="Type de restaurant" disabled>
            <MenuItem value=""><CircularProgress size={20} /> Chargement...</MenuItem>
          </Select>
        ) : (
          <Select
            value={identity.restaurantTypeId}
            label="Type de restaurant"
            onChange={(e) => setIdentity({ ...identity, restaurantTypeId: e.target.value })}
          >
            <MenuItem value="">
              <em>Sélectionner un type</em>
            </MenuItem>
            {restaurantTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>
                {type.icon} {type.RestaurantTypeDescriptions?.[0]?.name || `Type ${type.id}`}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    </Box>
  );
}