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

const CopyrightAndIPTerms = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const handleDownloadPDF = () => {
    window.open('/legal/copyright-ip-terms.pdf', '_blank');
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
                {t("legal.copyrightAndIPTerms.title")}
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
              {t("legal.copyrightAndIPTerms.ownershipOfContent.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.ownershipOfContent.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.copyrightAndIPTerms.userGeneratedContent.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.userGeneratedContent.content1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.userGeneratedContent.content2")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.copyrightAndIPTerms.reportingInfringement.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.reportingInfringement.content")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t("legal.copyrightAndIPTerms.reportingInfringement.points.signature")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.copyrightAndIPTerms.reportingInfringement.points.identification")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.copyrightAndIPTerms.reportingInfringement.points.materialIdentification")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.copyrightAndIPTerms.reportingInfringement.points.contactInfo")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.copyrightAndIPTerms.reportingInfringement.points.goodFaith")} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t("legal.copyrightAndIPTerms.reportingInfringement.points.accuracy")} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.copyrightAndIPTerms.trademarks.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.trademarks.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.copyrightAndIPTerms.changesToTerms.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.changesToTerms.content")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              {t("legal.copyrightAndIPTerms.contactUs.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("legal.copyrightAndIPTerms.contactUs.content")}
            </Typography>
            <Typography variant="body1">
              {t("legal.copyrightAndIPTerms.contactUs.email")}
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CopyrightAndIPTerms;

