import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Error, Email } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Page de callback pour la vérification de l'email
 * Appelée quand l'utilisateur clique sur le lien dans l'email
 */
function VerifyEmailCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'already-verified'
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Token de vérification manquant.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/restaurant/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setErrorMessage(data.message || 'Erreur lors de la vérification.');
          return;
        }

        if (data.alreadyVerified) {
          setStatus('already-verified');
        } else {
          setStatus('success');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('Erreur de connexion au serveur. Veuillez réessayer.');
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Vérification en cours...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Veuillez patienter pendant que nous vérifions votre compte.
            </Typography>
          </>
        );

      case 'success':
        return (
          <>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'success.light', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <CheckCircle sx={{ fontSize: 50, color: 'success.main' }} />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
              Compte vérifié !
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Votre adresse email a été vérifiée avec succès. 
              Vous pouvez maintenant vous connecter à votre espace restaurant.
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => navigate('/login-restaurant')}
              sx={{ px: 4 }}
            >
              Se connecter
            </Button>
          </>
        );

      case 'already-verified':
        return (
          <>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'info.light', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <CheckCircle sx={{ fontSize: 50, color: 'info.main' }} />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'info.main' }}>
              Déjà vérifié
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Votre compte est déjà vérifié. Vous pouvez vous connecter directement.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login-restaurant')}
              sx={{ px: 4 }}
            >
              Se connecter
            </Button>
          </>
        );

      case 'error':
        return (
          <>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'error.light', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <Error sx={{ fontSize: 50, color: 'error.main' }} />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'error.main' }}>
              Vérification échouée
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {errorMessage}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Le lien peut avoir expiré ou être invalide. 
              Vous pouvez demander un nouveau lien de vérification.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Email />}
                onClick={() => navigate('/verify-email-pending')}
              >
                Renvoyer l'email
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/login-restaurant')}
              >
                Retour à la connexion
              </Button>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 
        minHeight: 'calc(100vh - 200px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        py: 4
      }}>
        <Paper sx={{ 
          maxWidth: 500, 
          mx: 2, 
          p: 4, 
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 3
        }}>
          {renderContent()}
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default VerifyEmailCallback;
