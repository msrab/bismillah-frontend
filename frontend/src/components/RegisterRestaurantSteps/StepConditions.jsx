import { Box, Typography, Paper, Link, Checkbox, FormControlLabel } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function StepConditions({ acceptedTerms, setAcceptedTerms, acceptedCharter, setAcceptedCharter }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Conditions d'utilisation et Charte Halal
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Veuillez lire attentivement les documents suivants avant de continuer.
      </Typography>

      {/* Lien vers les conditions */}
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

      {/* Lien vers la charte */}
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
}