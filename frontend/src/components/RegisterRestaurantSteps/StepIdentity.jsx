import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

// Étape 4 - Identité
const StepIdentity = forwardRef(({
  identity,
  setIdentity,
  logo,
  logoPreview,
  handleLogoChange,
  resetLogo,
  logoError
}, ref) => {
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyError, setCompanyError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurant-types')
      .then(res => res.json())
      .then(data => setRestaurantTypes(Array.isArray(data) ? data : []))
      .catch(() => setRestaurantTypes([]))
      .finally(() => setLoading(false));
  }, []);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setCompanyError('');
      if (!identity.name.trim()) {
        return { valid: false, message: 'Le nom du restaurant est requis' };
      }
      const num = identity.company_number.replace(/\D/g, '');
      if (!num || num.length !== 10) {
        setCompanyError("Le numéro d'entreprise doit comporter exactement 10 chiffres.");
        return { valid: false, message: "Le numéro d'entreprise doit comporter exactement 10 chiffres." };
      }
      // Ajoute le préfixe BE avant l'appel API
      const companyNumberToCheck = `BE${num}`;
      try {
        const checkCompany = await fetch(`http://localhost:5000/api/restaurants/check-company-number?company_number=${encodeURIComponent(companyNumberToCheck)}`);
        const checkCompanyData = await checkCompany.json();
        if (!checkCompany.ok) {
          setCompanyError(checkCompanyData.error || "Erreur lors de la vérification du numéro d'entreprise.");
          return { valid: false, message: checkCompanyData.error || "Erreur lors de la vérification du numéro d'entreprise." };
        }
        if (checkCompanyData.exists) {
          setCompanyError("Ce numéro d'entreprise existe déjà.");
          return { valid: false, message: "Ce numéro d'entreprise existe déjà." };
        }
        setCompanyError('');
        return { valid: true };
      } catch (err) {
        setCompanyError("Erreur réseau lors de la vérification du numéro d'entreprise.");
        return { valid: false, message: "Erreur réseau lors de la vérification du numéro d'entreprise." };
      }
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
        {logoError && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {logoError}
          </Typography>
        )}
      </Box>

      <TextField
        label="Numéro d'entreprise (BCE)"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={identity.company_number.replace(/^BE/, '')}
        onChange={(e) => {
          // N'accepte que des chiffres, max 10, stocke toujours avec 'BE' devant
          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
          setIdentity({ ...identity, company_number: val ? `BE${val}` : '' });
        }}
        placeholder="0123456789"
        error={!!companyError}
        helperText={companyError || "Format belge: BE suivi de 10 chiffres"}
        InputProps={{
          startAdornment: <span style={{ fontWeight: 600, marginRight: 4 }}>BE</span>
        }}
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