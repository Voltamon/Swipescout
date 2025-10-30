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

const CommunityGuidelines = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleDownloadPDF = () => {
    window.open('/legal/community-guidelines.pdf', '_blank');
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
                Community Guidelines
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadPDF}
              >
                Download PDF
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Last updated: January 20, 2024
            </Typography>
          </Box>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.welcome.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.communityGuidelines.welcome.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.respectfulProfessional.title")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.respectfulProfessional.points.respect")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.respectfulProfessional.points.noHarassment")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.respectfulProfessional.points.noInappropriate")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.authenticityAccuracy.title")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.authenticityAccuracy.points.accurateTruthful")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.authenticityAccuracy.points.noImpersonation")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.authenticityAccuracy.points.genuineJobPostings")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.privacyConfidentiality.title")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.privacyConfidentiality.points.noSharing")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.privacyConfidentiality.points.respectPrivacy")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.noSpam.title")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.noSpam.points.noDeceptivePractices")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.noSpam.points.noIrrelevantContent")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.noSpam.points.noIllegalActivities")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.intellectualProperty.title")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.intellectualProperty.points.ownContent")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.communityGuidelines.intellectualProperty.points.respectRights")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.reportingViolations.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.communityGuidelines.reportingViolations.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.enforcement.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.communityGuidelines.enforcement.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.communityGuidelines.contactUs.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.communityGuidelines.contactUs.content")}
            </Typography>
            <Typography variant="body1">
              {t("legal.communityGuidelines.contactUs.email")}
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CommunityGuidelines;

