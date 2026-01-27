import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Typography, Paper, Link, Checkbox, FormControlLabel } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Composant StepConditions
 * Étape du formulaire d'inscription restaurant : acceptation des conditions d'utilisation et de la charte halal
 * - Affiche les liens vers les documents à lire
 * - Propose deux cases à cocher pour acceptation
 * - Expose une méthode validate() via la ref pour valider l'acceptation
 *
 * Props :
 *   - acceptedTerms : boolean, indique si l'utilisateur a accepté les conditions d'utilisation
 *   - setAcceptedTerms : fonction pour mettre à jour acceptedTerms
 *   - acceptedCharter : boolean, indique si l'utilisateur a accepté la charte halal
 *   - setAcceptedCharter : fonction pour mettre à jour acceptedCharter
 */


const StepConditions = forwardRef(({ acceptedTerms, setAcceptedTerms, acceptedCharter, setAcceptedCharter }, ref) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    validate: () => {
      setSubmitted(true);
      if (!acceptedTerms || !acceptedCharter) {
        return { valid: false };
      }
      setError('');
      return { valid: true };
    }
  }), [acceptedTerms, acceptedCharter]);

  return (
    <Box>
      {/* Titre principal */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Conditions d'utilisation et Charte Halal
      </Typography>

      {/* Plus d'affichage d'erreur ici, le bouton suivant doit être désactivé tant que les deux cases ne sont pas cochées */}

      {/* Message d'instruction */}
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Veuillez lire attentivement les documents suivants avant de continuer.
      </Typography>

      {/* Bloc : Lien vers les conditions d'utilisation */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          📄 Conditions d'utilisation
        </Typography>
        <Link 
          component={RouterLink} 
          to="/conditions-utilisation" 
          target="_blank"
          sx={{ fontSize: '0.9rem' }}
        >
          Lire les conditions d'utilisation →
        </Link>
      </Paper>

      {/* Case à cocher : acceptation des conditions */}
      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            J'ai lu et j'accepte les conditions d'utilisation de la plateforme Bismillah.
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      {/* Bloc : Lien vers la charte halal */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          🕌 Charte Éthique Halal
        </Typography>
        <Link 
          component={RouterLink} 
          to="/charte-halal" 
          target="_blank"
          sx={{ fontSize: '0.9rem' }}
        >
          Lire la charte halal →
        </Link>
      </Paper>

      {/* Case à cocher : acceptation de la charte halal */}
      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedCharter}
            onChange={(e) => setAcceptedCharter(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            Je m'engage à respecter la charte éthique halal de Bismillah.
          </Typography>
        }
      />
    </Box>
  );
});

export default StepConditions;