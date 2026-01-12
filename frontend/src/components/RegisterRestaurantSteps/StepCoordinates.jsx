import { Box, Typography, TextField, InputAdornment, Autocomplete, CircularProgress } from '@mui/material';

export default function StepCoordinates({
  contact, setContact,
  cityOptions, cityLoading, selectedCity, setSelectedCity, citySearch, setCitySearch
}) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Coordonnées
      </Typography>

      <TextField
        label="Site web"
        fullWidth
        sx={{ mb: 2 }}
        value={contact.website}
        onChange={(e) => setContact({ ...contact, website: e.target.value })}
        placeholder="https://www.monrestaurant.be"
        InputProps={{
          startAdornment: <InputAdornment position="start">🌐</InputAdornment>
        }}
      />

      <TextField
        label="Téléphone"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.phone}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        placeholder="+32 2 123 45 67"
        InputProps={{
          startAdornment: <InputAdornment position="start">📞</InputAdornment>
        }}
      />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>
        Adresse du restaurant
      </Typography>

      {/* Autocomplétion ville */}
      <Autocomplete
        options={cityOptions}
        getOptionLabel={(option) => `${option.postal_code} - ${option.name}`}
        loading={cityLoading}
        value={selectedCity}
        onChange={(_, newValue) => setSelectedCity(newValue)}
        onInputChange={(_, newInputValue) => setCitySearch(newInputValue)}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Ville ou code postal"
            required
            sx={{ mb: 2 }}
            placeholder="Tapez un nom de ville ou code postal..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        noOptionsText="Aucune ville trouvée"
        loadingText="Recherche..."
      />

      <TextField
        label="Nom de la rue"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.streetName}
        onChange={(e) => setContact({ ...contact, streetName: e.target.value })}
        placeholder="Rue de Flandre"
      />

      <TextField
        label="Numéro"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={contact.address_number}
        onChange={(e) => setContact({ ...contact, address_number: e.target.value })}
        placeholder="123A"
      />
    </Box>
  );
}