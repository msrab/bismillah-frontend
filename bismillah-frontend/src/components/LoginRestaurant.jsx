import { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';
import logger from '../utils/logger';
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

      // Log détaillé via le logger dev
      logger.api('POST', '/auth/restaurant/login', {
        status: res.status,
        data,
      });

      // Vérifier d'abord si la requête a réussi
      if (res.ok && data.token) {
        logger.log('Connexion réussie, stockage du token...');
        localStorage.setItem('token', data.token);
        // Stocker les infos du restaurant
        if (data.restaurant) {
          localStorage.setItem('restaurant', JSON.stringify(data.restaurant));
          logger.log('Restaurant stocké dans localStorage');
        }
        logger.log('Redirection vers /restaurant-dashboard');
        setMessage({ type: 'success', text: 'Connexion réussie ! Redirection...' });
        window.location.href = '/restaurant-dashboard';
        return;
      } else if (data.requiresVerification) {
        // Compte non vérifié
        setRequiresVerification(true);
        setMessage({ 
          type: 'warning', 
          text: data.message || 'Votre compte n\'est pas encore vérifié.' 
        });
      } else {
        // Le backend peut renvoyer { error: "..." } ou { message: "..." }
        const errorMsg = data.message || data.error || 'Erreur de connexion';
        logger.warn('Échec de connexion:', { status: res.status, errorMsg, data });
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (error) {
      logger.error('Erreur réseau / connexion au serveur:', error);
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