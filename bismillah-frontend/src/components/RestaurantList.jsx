import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import { Typography, Box, Paper, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaList, FaMapMarkedAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [view, setView] = useState('list');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data.restaurants));
  }, []);

  // Utilise les vraies coordonnées si présentes
  const getCoords = (r) => [r.latitude, r.longitude];

  // Centre la carte sur le premier restaurant avec coordonnées valides
  const firstWithCoords = restaurants.find(r => r.latitude && r.longitude);
  const defaultCenter = firstWithCoords
    ? [firstWithCoords.latitude, firstWithCoords.longitude]
    : [50.85, 4.35];

  if (!restaurants.length)
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 6 }}>
        Aucun restaurant trouvé.
      </Typography>
    );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f1f1 100%)',
      pb: 6
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', pt: 4, px: 2 }}>
        <Button
          startIcon={<FaArrowLeft />}
          variant="outlined"
          color="primary"
          sx={{ mb: 3, fontWeight: 600, borderRadius: 3 }}
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
        <Typography
          variant="h3"
          color="primary"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            mb: 3,
            letterSpacing: 1,
            textShadow: '0 2px 8px #e6394622',
          }}
        >
          Liste des restaurants
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            aria-label="Vue"
            sx={{
              background: '#fff',
              borderRadius: 3,
              boxShadow: 2,
              p: 0.5,
              '& .Mui-selected': {
                background: '#e63946',
                color: '#fff',
                fontWeight: 700
              }
            }}
          >
            <ToggleButton value="list" aria-label="Liste" sx={{ fontWeight: 600, px: 3 }}>
              <FaList style={{ marginRight: 8 }} /> Liste
            </ToggleButton>
            <ToggleButton value="map" aria-label="Carte" sx={{ fontWeight: 600, px: 3 }}>
              <FaMapMarkedAlt style={{ marginRight: 8 }} /> Carte
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {view === 'list' ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 5,
              justifyContent: 'center',
            }}
          >
            {restaurants.map(r => (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.04 }}
                style={{ textDecoration: 'none', height: '100%' }}
              >
                <Link
                  to={`/restaurants/${r.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      minWidth: 260,
                      maxWidth: 340,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #fff 70%, #f8fafc 100%)',
                      transition: 'box-shadow 0.18s, transform 0.18s',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: 4,
                      '&:hover': { boxShadow: 10, background: '#f1f1f1' },
                    }}
                  >
                    <RestaurantCard restaurant={r} />
                  </Paper>
                </Link>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box sx={{
            width: '100%',
            height: 500,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: 3,
            background: '#fff'
          }}>
            <MapContainer
              center={defaultCenter}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {restaurants
                .filter(r => r.latitude && r.longitude)
                .map((r) => (
                  <Marker key={r.id} position={getCoords(r)}>
                    <Popup>
                      <b>{r.name}</b><br />
                      {r.address_number}<br />
                      <Link to={`/restaurants/${r.id}`}>Voir la fiche</Link>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RestaurantList;