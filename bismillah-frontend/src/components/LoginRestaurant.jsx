import { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';
import LoginEmailField from './restaurantformcomponents/LoginEmailField';
import PasswordField from './restaurantformcomponents/PasswordField';

function LoginRestaurant() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'warning', text: '' }
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setRequiresVerification(false);
    setLoading(true);

    try {
      const res = await apiFetch('/auth/restaurant/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();

      // Vérifier d'abord si la requête a réussi
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        // Stocker les infos du restaurant
        if (data.restaurant) {
          localStorage.setItem('restaurant', JSON.stringify(data.restaurant));
        }
        setMessage({ type: 'success', text: 'Connexion réussie ! Redirection...' });
        // Rediriger immédiatement vers le dashboard
        navigate('/restaurant-dashboard');
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
      console.error('Erreur de connexion:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    navigate('/verify-email-pending', { state: { email } });
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8, px: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
          Connexion Restaurant
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <LoginEmailField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2, py: 1.5 }}
            disabled={loading || !email || !password}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
          </Button>
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
            disabled={loading}
          >
            Renvoyer l'email de vérification
          </Button>
        )}

        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Pas encore inscrit ?{' '}
          <Button 
            onClick={() => navigate('/register-restaurant')} 
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            Inscrire mon restaurant
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginRestaurant;