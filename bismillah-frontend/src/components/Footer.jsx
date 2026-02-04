import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { useLanguage } from '../i18n/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        background: '#1a1a2e',
        color: '#fff',
        borderTop: '3px solid #e63946'
      }}
    >
      <Container maxWidth="lg">
        {/* Liens du menu secondaire */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            mb: 3
          }}
        >
          <Link
            href="/"
            underline="hover"
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.95rem',
              '&:hover': { color: '#e63946' }
            }}
          >
            {t('nav.home')}
          </Link>
          <Link
            href="/restaurants"
            underline="hover"
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.95rem',
              '&:hover': { color: '#e63946' }
            }}
          >
            {t('nav.restaurants')}
          </Link>
          <Link
            href="/charte-halal"
            underline="hover"
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.95rem',
              '&:hover': { color: '#e63946' }
            }}
          >
            {t('nav.charter')}
          </Link>
          <Link
            href="/conditions-utilisation"
            underline="hover"
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.95rem',
              '&:hover': { color: '#e63946' }
            }}
          >
            {t('nav.terms')}
          </Link>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />

        {/* Informations légales */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            &copy; {currentYear} Bismillah. {t('footer.rights') || 'Tous droits réservés.'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="/charte-halal"
              underline="hover"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                '&:hover': { color: '#e63946' }
              }}
            >
              {t('footer.charter') || 'Charte Éthique Halal'}
            </Link>
            <Link
              href="/conditions-utilisation"
              underline="hover"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                '&:hover': { color: '#e63946' }
              }}
            >
              {t('footer.terms') || 'CGU'}
            </Link>
          </Box>
        </Box>

        {/* Slogan */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 3,
            color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic'
          }}
        >
          {t('footer.slogan') || 'Votre guide halal de confiance'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
