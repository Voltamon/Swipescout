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

const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  }
];

export default function LanguageSelector({ variant = 'menu', showLabel = true }) {
  const { i18n, t } = useTranslation();
  const theme = useTheme();
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
        <span style={{ fontSize: '1.1em' }}>{currentLanguage.flag}</span>
        {showLabel && (
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {currentLanguage.code.toUpperCase()}
          </Typography>
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
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <span style={{ fontSize: '1.3em' }}>{language.flag}</span>
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

// Hook for easy language detection and setup
export const useLanguageSetup = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // Set initial language from localStorage or browser
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.split('-')[0];
    
    const supportedLanguages = languages.map(lang => lang.code);
    const initialLanguage = savedLanguage || 
      (supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en');

    if (i18n.language !== initialLanguage) {
      i18n.changeLanguage(initialLanguage);
    }

    // Set document direction
    const selectedLang = languages.find(lang => lang.code === initialLanguage);
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = initialLanguage;
    }
  }, [i18n]);

  return { currentLanguage: i18n.language };
};

