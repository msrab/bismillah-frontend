import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => (
  <AppBar position="static" color="primary" elevation={1}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Bismillah App
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
