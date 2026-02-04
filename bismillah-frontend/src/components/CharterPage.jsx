import { Box, Typography, Paper, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import LanguageSelector from './LanguageSelector';

function CharterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <LanguageSelector />
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, textAlign: 'center', color: 'primary.main' }}>
          {t('charter.title')}
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
          {t('charter.subtitle')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, textAlign: 'justify', fontStyle: 'italic' }}>
          {t('charter.intro')}
        </Typography>

        {/* Section 1 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('charter.section1_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('charter.section1_content')}
        </Typography>

        {/* Section 2 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('charter.section2_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('charter.section2_content')}
        </Typography>

        {/* Section 3 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('charter.section3_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('charter.section3_content')}
        </Typography>

        {/* Section 4 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('charter.section4_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('charter.section4_content')}
        </Typography>

        {/* Section 5 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('charter.section5_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('charter.section5_content')}
        </Typography>

        {/* Section 6 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('charter.section6_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('charter.section6_content')}
        </Typography>

        {/* Conclusion */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 500, color: 'primary.contrastText' }}>
            {t('charter.conclusion')}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          {t('charter.version')}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button variant="contained" onClick={() => navigate('/conditions-utilisation')}>
            {t('nav.terms')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CharterPage;
