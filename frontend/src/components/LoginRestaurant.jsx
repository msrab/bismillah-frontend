import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

function LoginRestaurant() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('http://localhost:5000/api/auth/restaurant/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setMessage("Connexion réussie !");
    } else {
      setMessage(data.message || "Erreur de connexion");
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Connexion Restaurant</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" name="email" type="email" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
          <TextField label="Mot de passe" name="password" type="password" fullWidth required sx={{ mb: 2 }} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Se connecter</Button>
        </form>
        {message && <Typography sx={{ mt: 2, color: data?.token ? 'green' : 'red' }}>{message}</Typography>}
      </Paper>
    </Box>
  );
}

export default LoginRestaurant;