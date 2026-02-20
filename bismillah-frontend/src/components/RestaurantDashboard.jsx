import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  MenuBook as MenuIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';
import { apiFetch, apiUrl } from '../config/api';

// Composant TabPanel pour les onglets
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function RestaurantDashboard() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Vérifier l'authentification et charger les données
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRestaurant = localStorage.getItem('restaurant');

    if (!token) {
      navigate('/login-restaurant');
      return;
    }

    if (storedRestaurant) {
      try {
        const parsed = JSON.parse(storedRestaurant);
        setRestaurant(parsed);
        setEditForm({
          name: parsed.name || '',
          phone: parsed.phone || '',
          website: parsed.website || '',
          email: parsed.email || ''
        });
        setLoading(false);
      } catch (e) {
        setError('Erreur de chargement des données');
        setLoading(false);
      }
    } else {
      // Si pas de données en localStorage, rediriger vers login
      navigate('/login-restaurant');
    }
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Annuler les modifications
      setEditForm({
        name: restaurant.name || '',
        phone: restaurant.phone || '',
        website: restaurant.website || '',
        email: restaurant.email || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiFetch(`/restaurants/${restaurant.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });
      const data = await res.json();

      if (res.ok) {
        const updatedRestaurant = { ...restaurant, ...editForm };
        setRestaurant(updatedRestaurant);
        localStorage.setItem('restaurant', JSON.stringify(updatedRestaurant));
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Informations mises à jour avec succès !' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('restaurant');
    navigate('/login-restaurant');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => navigate('/login-restaurant')} sx={{ mt: 2 }}>
            Se reconnecter
          </Button>
        </Container>
      </>
    );
  }

  // Construire l'adresse complète
  const getFullAddress = () => {
    const parts = [];
    if (restaurant.address_number) parts.push(restaurant.address_number);
    if (restaurant.street?.name) parts.push(restaurant.street.name);
    if (restaurant.street?.city?.name) parts.push(restaurant.street.city.name);
    if (restaurant.street?.city?.postal_code) parts.push(`(${restaurant.street.city.postal_code})`);
    return parts.join(' ') || 'Non renseignée';
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header avec infos du restaurant */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
            {/* Logo */}
            <Avatar
              src={restaurant.logo ? apiUrl(`/uploads/${restaurant.logo}`) : undefined}
              sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}
            >
              <RestaurantIcon sx={{ fontSize: 60 }} />
            </Avatar>

            {/* Infos principales */}
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" fontWeight="bold">
                  {restaurant.name}
                </Typography>
                {restaurant.is_email_verified && (
                  <Chip label="Vérifié" color="success" size="small" />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{getFullAddress()}</Typography>
                </Box>
                {restaurant.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">{restaurant.phone}</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Chip
                  icon={<PeopleIcon />}
                  label={`${restaurant.nb_followers || 0} followers`}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Actions */}
            <Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Message de feedback */}
        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {/* Onglets */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<RestaurantIcon />} label="Profil" />
            <Tab icon={<MenuIcon />} label="Menu" />
            <Tab icon={<SettingsIcon />} label="Paramètres" />
          </Tabs>
        </Paper>

        {/* Contenu des onglets */}
        <TabPanel value={tabValue} index={0}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Informations du restaurant</Typography>
              <Box>
                {isEditing ? (
                  <>
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ mr: 1 }}
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      onClick={handleEditToggle}
                    >
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={handleEditToggle}
                  >
                    Modifier
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom du restaurant"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <RestaurantIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Site web"
                  name="website"
                  value={editForm.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <WebIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={getFullAddress()}
                  disabled
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  helperText="Pour modifier l'adresse, contactez le support"
                />
              </Grid>
            </Grid>

            {/* Infos supplémentaires */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Informations complémentaires
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Numéro BCE
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {restaurant.company_number || 'Non renseigné'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Date d'inscription
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {restaurant.createdAt
                          ? new Date(restaurant.createdAt).toLocaleDateString('fr-BE')
                          : 'Inconnue'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Statut du compte
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {restaurant.is_email_verified ? 'Actif' : 'En attente de vérification'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gestion du menu
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              La gestion du menu sera bientôt disponible. Vous pourrez ajouter des catégories et des éléments à votre carte.
            </Alert>
            {/* TODO: Ajouter la gestion des catégories et éléments de menu */}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Paramètres
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Sécurité
              </Typography>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Changer le mot de passe
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom color="error">
                Zone dangereuse
              </Typography>
              <Button variant="outlined" color="error">
                Supprimer le compte
              </Button>
            </Box>
          </Paper>
        </TabPanel>
      </Container>
      <Footer />
    </>
  );
}

export default RestaurantDashboard;
