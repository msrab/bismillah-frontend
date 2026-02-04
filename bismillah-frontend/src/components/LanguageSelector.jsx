import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { useLanguage } from '../i18n';

function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (code) => {
    setLanguage(code);
    handleClose();
  };

  const currentLang = availableLanguages.find(l => l.code === language);

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{ textTransform: 'none' }}
      >
        🌐 {currentLang?.flag} {currentLang?.name}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {availableLanguages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleSelect(lang.code)}
            selected={lang.code === language}
          >
            <Typography>
              {lang.flag} {lang.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default LanguageSelector;
