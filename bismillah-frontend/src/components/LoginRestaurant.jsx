import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';

function LoginRestaurant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'warning', text: '' }
  const [requiresVerification, setRequiresVerification] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setRequiresVerification(false);

    try {
      const res = await apiFetch('/auth/restaurant/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        setMessage({ type: 'success', text: 'Connexion réussie !' });
        // TODO: Rediriger vers le dashboard
      } else if (data.requiresVerification) {
        // Compte non vérifié
        setRequiresVerification(true);
        setMessage({ 
          type: 'warning', 
          text: data.message || 'Votre compte n\'est pas encore vérifié.' 
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur de connexion' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  const handleResendVerification = () => {
    navigate('/verify-email-pending', { state: { email: form.email } });
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Connexion Restaurant</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" name="email" type="email" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
          <TextField label="Mot de passe" name="password" type="password" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Se connecter</Button>
        </form>

        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}

        {requiresVerification && (
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ mt: 2 }}
            onClick={handleResendVerification}
          >
            Renvoyer l'email de vérification
          </Button>
        )}

        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Pas encore inscrit ?{' '}
          <Button onClick={() => navigate('/register-restaurant')} sx={{ textTransform: 'none' }}>
            Inscrire mon restaurant
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginRestaurant;