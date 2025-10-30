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

const EULA = () => {
  const theme = useTheme();
  const { t } = useTranslation('legal');
  
  const handleDownloadPDF = () => {
    window.open('/legal/eula.pdf', '_blank');
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
                {t("legal.eula.title")}
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
              {t("legal.eula.importantReadCarefully.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.importantReadCarefully.content1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.importantReadCarefully.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.grantOfLicense.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.grantOfLicense.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.restrictions.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.restrictions.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.eula.restrictions.points.reverseEngineer")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.eula.restrictions.points.modifyAdapt")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.eula.restrictions.points.rentLease")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.eula.restrictions.points.illegalUnauthorized")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.eula.restrictions.points.removeNotices")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.intellectualProperty.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.intellectualProperty.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.termination.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.termination.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.disclaimerOfWarranties.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.disclaimerOfWarranties.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.limitationOfLiability.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.limitationOfLiability.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.governingLaw.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.governingLaw.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.entireAgreement.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.entireAgreement.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.eula.contactInformation.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.eula.contactInformation.content")}
            </Typography>
            <Typography variant="body1">
              {t("legal.eula.contactInformation.email")}
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default EULA;

