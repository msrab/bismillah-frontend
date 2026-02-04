import React from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box, Paper } from '@mui/material';
import { FaUtensils, FaMapMarkerAlt, FaUserAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LanguageProvider } from './i18n/LanguageContext';
import Footer from './components/Footer';

function App() {
  return (
    <LanguageProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f1f1 100%)' }}>
        <AppBar position="static" color="primary" elevation={2}>
          <Toolbar>
            <FaUtensils size={28} style={{ marginRight: 14 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
              Bismillah
            </Typography>
            <Button color="inherit" href="/" sx={{ fontWeight: 500 }}>Accueil</Button>
            <Button color="inherit" href="/restaurants" sx={{ fontWeight: 500 }}>Restaurants</Button>
            <Button color="inherit" href="#" sx={{ fontWeight: 500 }}>Connexion</Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ pt: 8, pb: 6, flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 800, letterSpacing: 2 }}>
              Bienvenue sur Bismillah
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
              Trouvez et commandez dans les meilleurs restaurants halal près de chez vous.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/restaurants"
              sx={{
                mt: 2,
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 3,
                boxShadow: 2,
                textTransform: 'none'
              }}
              component={motion.a}
              whileHover={{ scale: 1.07 }}
            >
              Voir la liste des restaurants
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              href="/register-restaurant"
              sx={{ mt: 2, ml: 2, fontWeight: 700, borderRadius: 3, textTransform: 'none' }}
              component={motion.a}
              whileHover={{ scale: 1.07 }}
            >
              Inscrire un restaurant
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              href="/login-restaurant"
              sx={{ mt: 2, ml: 2, fontWeight: 700, borderRadius: 3, textTransform: 'none' }}
              component={motion.a}
              whileHover={{ scale: 1.07 }}
            >
              Connexion restaurant
            </Button>
          </motion.div>

          <Box sx={{ mt: 8, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                minWidth: 260,
                maxWidth: 320,
                textAlign: 'center',
                borderRadius: 4,
                background: '#fff',
                transition: 'transform 0.18s',
                '&:hover': { transform: 'scale(1.04)', boxShadow: 6 }
              }}
              component={motion.div}
              whileHover={{ scale: 1.04 }}
            >
              <FaMapMarkerAlt size={38} color="#e63946" style={{ marginBottom: 12 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Restaurants proches</Typography>
              <Typography variant="body1" color="text.secondary">
                Découvrez les restaurants halal autour de vous, partout en Europe.
              </Typography>
            </Paper>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                minWidth: 260,
                maxWidth: 320,
                textAlign: 'center',
                borderRadius: 4,
                background: '#fff',
                transition: 'transform 0.18s',
                '&:hover': { transform: 'scale(1.04)', boxShadow: 6 }
              }}
              component={motion.div}
              whileHover={{ scale: 1.04 }}
            >
              <FaUtensils size={38} color="#e63946" style={{ marginBottom: 12 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Commandez facilement</Typography>
              <Typography variant="body1" color="text.secondary">
                Consultez les menus, choisissez vos plats et commandez en quelques clics.
              </Typography>
            </Paper>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                minWidth: 260,
                maxWidth: 320,
                textAlign: 'center',
                borderRadius: 4,
                background: '#fff',
                transition: 'transform 0.18s',
                '&:hover': { transform: 'scale(1.04)', boxShadow: 6 }
              }}
              component={motion.div}
              whileHover={{ scale: 1.04 }}
            >
              <FaUserAlt size={38} color="#e63946" style={{ marginBottom: 12 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Communauté</Typography>
              <Typography variant="body1" color="text.secondary">
                Donnez votre avis et suivez vos restaurants préférés.
              </Typography>
            </Paper>
          </Box>
        </Container>

        <Footer />
      </Box>
    </LanguageProvider>
  );
}

export default App;
