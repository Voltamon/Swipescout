import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../../components/Headers/Header';
import Footer from '../../components/Headers/Footer';
import { Download, ArrowBack } from '@mui/icons-material';

const CookiePolicy = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleDownloadPDF = () => {
    window.open('/legal/cookie-policy.pdf', '_blank');
  };

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Back to Home
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {t("legal.cookiePolicy.title")}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadPDF}
              >
                {t("legal.downloadPDF")}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t("legal.lastUpdated")}: January 20, 2024
            </Typography>
          </Box>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t("legal.cookiePolicy.whatAreCookies.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.cookiePolicy.whatAreCookies.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.cookiePolicy.howWeUseCookies.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.cookiePolicy.howWeUseCookies.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.cookiePolicy.howWeUseCookies.points.essential")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.cookiePolicy.howWeUseCookies.points.performanceAnalytics")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.cookiePolicy.howWeUseCookies.points.functionality")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.cookiePolicy.howWeUseCookies.points.advertisingTargeting")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.cookiePolicy.thirdPartyCookies.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.cookiePolicy.thirdPartyCookies.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.cookiePolicy.yourChoices.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.cookiePolicy.yourChoices.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.cookiePolicy.yourChoices.points.browserSettings")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.cookiePolicy.yourChoices.points.cookieConsentTool")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.cookiePolicy.changesToPolicy.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.cookiePolicy.changesToPolicy.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.cookiePolicy.contactUs.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.cookiePolicy.contactUs.content")}
            </Typography>
            <Typography variant="body1">
              {t("legal.cookiePolicy.contactUs.email")}
            </Typography>
            <Divider sx={{ my: 3 }} />
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CookiePolicy;

