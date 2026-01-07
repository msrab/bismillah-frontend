import { Box, Typography, Paper, Button, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import LanguageSelector from './LanguageSelector';

function TermsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const renderList = (items) => (
    <List dense>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Typography color="primary">✓</Typography>
          </ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <LanguageSelector />
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, textAlign: 'center', color: 'primary.main' }}>
          {t('terms.title')}
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
          {t('terms.subtitle')}
        </Typography>

        {/* Section 1 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section1_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('terms.section1_content')}
        </Typography>

        {/* Section 2 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section2_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {t('terms.section2_intro')}
        </Typography>
        {renderList(t('terms.section2_list'))}

        {/* Section 3 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section3_title')}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          {t('terms.section3_recognized_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify' }}>
          {t('terms.section3_recognized_content')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('terms.section3_uncertified_content')}
        </Typography>

        {/* Section 4 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section4_title')}
        </Typography>
        {renderList(t('terms.section4_list'))}

        {/* Section 5 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section5_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify' }}>
          <strong>Restaurant :</strong> {t('terms.section5_restaurant')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          <strong>Plateforme :</strong> {t('terms.section5_platform')}
        </Typography>

        {/* Section 6 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section6_title')}
        </Typography>
        {renderList(t('terms.section6_list'))}

        {/* Section 7 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section7_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('terms.section7_content')}
        </Typography>

        {/* Section 8 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section8_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }}>
          {t('terms.section8_content')}
        </Typography>

        {/* Section 9 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          {t('terms.section9_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t('terms.section9_content')}
        </Typography>

        <Typography variant="caption" sx={{ display: 'block', mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          {t('terms.version')}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button variant="contained" onClick={() => navigate('/charte-halal')}>
            {t('nav.charter')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default TermsPage;
