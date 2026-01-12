import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

// Étape 4 - Identité
const StepIdentity = forwardRef(({
  identity,
  setIdentity,
  logo,
  logoPreview,
  handleLogoChange,
  resetLogo
}, ref) => {
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setRestaurantTypes(Array.isArray(data) ? data : []))
      .catch(() => setRestaurantTypes([]))
      .finally(() => setLoading(false));
  }, []);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      if (!identity.name.trim()) {
        return { valid: false, message: 'Le nom du restaurant est requis' };
      }
      if (!identity.company_number.trim()) {
        return { valid: false, message: 'Le numéro d\'entreprise est requis' };
      }
      const bceRegex = /^BE\s?0?\d{3}\.??\d{3}\.??\d{3}$/i;
      if (!bceRegex.test(identity.company_number.replace(/\s/g, ''))) {
        return { valid: false, message: 'Format de numéro d\'entreprise invalide (ex: BE0123456789)' };
      }
      // Vérification unicité numéro d'entreprise
      const checkCompany = await fetch(`http://localhost:5000/api/restaurants/check-company-number?company_number=${encodeURIComponent(identity.company_number)}`);
      const checkCompanyData = await checkCompany.json();
      if (checkCompanyData.exists) {
        return { valid: false, message: 'Ce numéro d\'entreprise existe déjà.' };
      }
      return { valid: true };
    }
  }), [identity]);

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
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Button>
          {logo && (
            <Button color="error" onClick={resetLogo} size="small" sx={{ ml: 1 }}>
              Supprimer
            </Button>
          )}
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
});
export default StepIdentity;