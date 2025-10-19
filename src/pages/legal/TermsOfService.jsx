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

const TermsOfService = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleDownloadPDF = () => {
    window.open('/legal/terms-of-service.pdf', '_blank');
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
                {t("legal.termsOfService.title")}
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
              {t("legal.termsOfService.agreementToTerms.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.agreementToTerms.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.descriptionOfService.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.descriptionOfService.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.descriptionOfService.features.videoResume")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.descriptionOfService.features.companyVideoProfiles")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.descriptionOfService.features.matchingCommunication")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.descriptionOfService.features.analyticsInsights")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.descriptionOfService.features.premiumFeatures")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.userAccounts.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.userAccounts.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userAccounts.points.accurateInfo")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userAccounts.points.updateInfo")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userAccounts.points.secureCredentials")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userAccounts.points.responsibleForActivities")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userAccounts.points.notifyUnauthorizedUse")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.userContent.title")}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t("legal.termsOfService.userContent.contentGuidelines.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.userContent.contentGuidelines.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.contentGuidelines.points.accurateTruthful")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.contentGuidelines.points.noViolations")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.contentGuidelines.points.noInfringement")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.contentGuidelines.points.noInappropriate")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.contentGuidelines.points.relevantToRecruitment")} />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t("legal.termsOfService.userContent.prohibitedActivities.title")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.prohibitedActivities.points.harassment")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.prohibitedActivities.points.impersonation")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.prohibitedActivities.points.spamming")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.prohibitedActivities.points.dataScraping")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.userContent.prohibitedActivities.points.disruptiveActivity")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.intellectualProperty.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.intellectualProperty.content1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.intellectualProperty.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.subscriptionPayments.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.subscriptionPayments.content1")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.subscriptionPayments.points.payFees")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.subscriptionPayments.points.accurateBilling")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.subscriptionPayments.points.authorizeCharge")} />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.subscriptionPayments.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.termination.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.termination.content1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.termination.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.disclaimer.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.disclaimer.content1")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.disclaimer.points.requirements")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.disclaimer.points.uninterrupted")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.termsOfService.disclaimer.points.accurateReliable")} />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.disclaimer.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.governingLaw.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.governingLaw.content1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.governingLaw.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.changesToTerms.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.changesToTerms.content1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.changesToTerms.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.termsOfService.contactInformation.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.contactInformation.content")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.termsOfService.contactInformation.email")}<br />
              {t("legal.termsOfService.contactInformation.address")}
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default TermsOfService;