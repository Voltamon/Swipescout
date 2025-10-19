import React, { useContext } from 'react';
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
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleDownloadPDF = () => {
    // In a real app, this would download the actual PDF
    window.open('/legal/privacy-policy.pdf', '_blank');
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
              {t('legal.backToHome')}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {t('legal.privacyPolicy.title')}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadPDF}
              >
                {t('legal.downloadPDF')}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('legal.lastUpdated')}: January 20, 2024
            </Typography>
          </Box>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.introduction.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.introduction.content')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.informationWeCollect.title')}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('legal.privacyPolicy.informationWeCollect.personalInfo.title')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.personalInfo.accountInfo')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.personalInfo.professionalInfo')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.personalInfo.videoContent')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.personalInfo.communicationData')} />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('legal.privacyPolicy.informationWeCollect.automaticInfoTitle')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.usageData')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.deviceInfo')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.informationWeCollect.analyticsData')} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.howWeUseInfo.title')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.howWeUseInfo.provideService')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.howWeUseInfo.matchJobs')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.howWeUseInfo.enableCommunication')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.howWeUseInfo.improvePlatform')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.howWeUseInfo.sendUpdates')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.howWeUseInfo.ensureSecurity')} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.sharingDisclosure.title')}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('legal.privacyPolicy.sharingDisclosure.withUsers')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.sharingDisclosure.withUsersContent')}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('legal.privacyPolicy.sharingDisclosure.withProviders')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.sharingDisclosure.withProvidersContent')}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('legal.privacyPolicy.sharingDisclosure.legalRequirements')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.sharingDisclosure.legalRequirementsContent')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.dataSecurity.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.dataSecurity.content')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.yourRights.title')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.yourRights.access')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.yourRights.correction')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.yourRights.deletion')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.yourRights.portability')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('legal.privacyPolicy.yourRights.optOut')} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.cookies.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.cookies.content')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.internationalTransfers.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.internationalTransfers.content')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.childrenPrivacy.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.childrenPrivacy.content')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.changes.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.changes.content')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t('legal.privacyPolicy.contactUs.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('legal.privacyPolicy.contactUs.content')}
            </Typography>
            <Typography variant="body1">
              {t('legal.privacyPolicy.contactUs.email')}
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;



