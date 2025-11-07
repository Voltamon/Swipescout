import React, { useContext, useState  } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Language, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { languages } from './LanguageSelector.utils';



export default function LanguageSelector({ variant = 'menu', showLabel = true }) {
  const { i18n, t } = useTranslation();
  // const theme = useTheme(); // Removed: unused variable
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      
      // Update document direction for RTL languages
      const selectedLang = languages.find(lang => lang.code === languageCode);
      if (selectedLang) {
        document.documentElement.dir = selectedLang.dir;
        document.documentElement.lang = languageCode;
        
        // Store language preference
        localStorage.setItem('preferred-language', languageCode);
      }
      
      setAnchorEl(null);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (variant === 'select') {
    return (
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          displayEmpty
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '1.2em' }}>{language.flag}</span>
                <Typography variant="body2">
                  {showLabel ? language.nativeName : language.code.toUpperCase()}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
        aria-label={t('header.languageSelector')}
      >
        {/* Flag */}
        <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{currentLanguage.flag}</span>

        {/* Small letters badge next to the flag */}
        {showLabel && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 28,
              height: 20,
              padding: '0 6px',
              marginLeft: 6,
              borderRadius: 9999,
              background: 'rgba(0,0,0,0.06)',
              fontSize: 12,
              fontWeight: 600,
            }}
            aria-hidden
          >
            {currentLanguage.code.toUpperCase()}
          </span>
        )}

        <ExpandMore sx={{ fontSize: '1rem' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1
            }
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === i18n.language}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.25em', lineHeight: 1 }}>{language.flag}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 28,
                  height: 20,
                  padding: '0 6px',
                  borderRadius: 9999,
                  background: language.code === i18n.language ? 'rgba(0,0,0,0.12)' : 'transparent',
                  fontSize: 12,
                  fontWeight: language.code === i18n.language ? 700 : 500,
                }}
                aria-hidden
              >
                {language.code.toUpperCase()}
              </span>
            </ListItemIcon>
            <ListItemText
              primary={language.nativeName}
              secondary={language.name !== language.nativeName ? language.name : null}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: language.code === i18n.language ? 600 : 400
              }}
              secondaryTypographyProps={{
                variant: 'caption',
                color: 'text.secondary'
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// NOTE: useLanguageSetup moved to `LanguageSelector.utils.js` to avoid exporting helpers alongside components

