import React, { useContext, useState  } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { jobseekerTabCategories } from '../config/jobseekerTabsConfig';
import localize from '../utils/localize';
import { getEmployerTabCategories } from '../config/employerTabsConfig';

const TranslationTest = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'ط§ظ„ط¹ط±ط¨ظٹط©' },
    { code: 'zh', name: 'ن¸­و–‡' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  const jobseekerCategories = jobseekerTabCategories();
  const employerCategories = getEmployerTabCategories(t);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Translation Test Page
      </Typography>
      
      <Typography variant="h6" gutterBottom align="center">
        Current Language: {currentLanguage}
      </Typography>

      {/* Language Switcher */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage === language.code ? 'contained' : 'outlined'}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </Button>
        ))}
      </Box>

      {/* Common Translations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Common Translations
        </Typography>
        <Typography>Home: {t('common.home', 'Home')}</Typography>
        <Typography>Dashboard: {t('common.dashboard', 'Dashboard')}</Typography>
        <Typography>Settings: {t('common.settings', 'Settings')}</Typography>
        <Typography>Search: {t('common.search', 'Search')}</Typography>
        <Typography>Profile: {t('common.profile', 'Profile')}</Typography>
      </Paper>

      {/* Jobseeker Tabs */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Jobseeker Tab Categories
        </Typography>
        <List>
          {jobseekerCategories.map((category) => (
            <div key={category.key}>
              <ListItem>
                <ListItemText 
                  primary={localize(category.label)}
                  secondary={`Key: ${category.key}`}
                />
              </ListItem>
              <Box sx={{ pl: 4 }}>
                {category.tabs.map((tab) => (
                  <ListItem key={tab.path}>
                    <ListItemText 
                      primary={localize(tab.label)}
                      secondary={localize(tab.description)}
                    />
                  </ListItem>
                ))}
              </Box>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>

      {/* Employer Tabs */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Employer Tab Categories
        </Typography>
        <List>
          {employerCategories.map((category) => (
            <div key={category.key}>
              <ListItem>
                <ListItemText 
                  primary={localize(category.label)}
                  secondary={`Key: ${category.key}`}
                />
              </ListItem>
              <Box sx={{ pl: 4 }}>
                {category.tabs.map((tab) => (
                  <ListItem key={tab.path}>
                    <ListItemText 
                      primary={localize(tab.label)}
                      secondary={localize(tab.description)}
                    />
                  </ListItem>
                ))}
              </Box>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TranslationTest;

