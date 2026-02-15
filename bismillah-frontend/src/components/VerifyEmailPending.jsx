import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Email, CheckCircle, Refresh } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Page affichée après l'inscription d'un restaurant
 * Informe l'utilisateur qu'un email de vérification a été envoyé
 */
function VerifyEmailPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null);

  // Récupère l'email depuis les props de navigation (ou null)
  const email = location.state?.email || null;
  const restaurantName = location.state?.restaurantName || 'votre restaurant';

  const handleResendEmail = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Email non disponible. Veuillez vous reconnecter.' });
      return;
    }

    setResending(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/restaurant/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.alreadyVerified) {
        setMessage({ type: 'success', text: 'Votre compte est déjà vérifié ! Redirection...' });
        setTimeout(() => navigate('/login-restaurant'), 2000);
      } else {
        setMessage({ type: 'success', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
    } finally {
      setResending(false);
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
          {/* Icône email */}
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'primary.light', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <Email sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>

          {/* Titre */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Vérifiez votre email
          </Typography>

          {/* Message principal */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Félicitations ! <strong>{restaurantName}</strong> a bien été enregistré.
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Un email de vérification a été envoyé à{' '}
            <strong>{email || 'votre adresse email'}</strong>.
          </Typography>

          {/* Instructions */}
          <Paper sx={{ bgcolor: 'info.light', p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'info.contrastText' }}>
              📧 Cliquez sur le lien dans l'email pour activer votre compte.
            </Typography>
            <Typography variant="body2" sx={{ color: 'info.contrastText', mt: 1 }}>
              ⏰ Le lien expire dans <strong>24 heures</strong>.
            </Typography>
          </Paper>

          {/* Message d'alerte */}
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          {/* Boutons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={resending ? <CircularProgress size={20} /> : <Refresh />}
              onClick={handleResendEmail}
              disabled={resending}
            >
              {resending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/login-restaurant')}
            >
              Retour à la connexion
            </Button>
          </Box>

          {/* Note */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou courrier indésirable.
          </Typography>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default VerifyEmailPending;
