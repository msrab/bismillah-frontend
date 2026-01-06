import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RegisterRestaurant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_number: '',
    phone: '',
    address_number: '',
    streetId: 1
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (form.password.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/restaurant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          company_number: form.company_number,
          phone: form.phone,
          address_number: form.address_number,
          streetId: parseInt(form.streetId)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Inscription réussie ! Redirection...' });
        setTimeout(() => navigate('/login-restaurant'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'inscription' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, px: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
          Inscription Restaurant
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom du restaurant"
            name="name"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.password}
            onChange={handleChange}
            helperText="Minimum 8 caractères"
          />

          <TextField
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <TextField
            label="Numéro d'entreprise (BCE)"
            name="company_number"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.company_number}
            onChange={handleChange}
            placeholder="BE0123456789"
          />

          <TextField
            label="Téléphone"
            name="phone"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.phone}
            onChange={handleChange}
            placeholder="0471234567"
          />

          <TextField
            label="Numéro d'adresse"
            name="address_number"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.address_number}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </form>

        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Déjà inscrit ?{' '}
          <Button onClick={() => navigate('/login-restaurant')} sx={{ textTransform: 'none' }}>
            Se connecter
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterRestaurant;
