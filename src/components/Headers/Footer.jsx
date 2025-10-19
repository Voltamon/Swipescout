import React, { useContext } from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  CheckCircle,
  TrendingUp,
  People
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom'; // Import Router Link

const StyledFooter = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 3),
  textAlign: "center",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  margin: theme.spacing(2),
  width: `calc(100% - ${theme.spacing(4)})`,
  left: "50%",
  transform: "translateX(-50%)",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    width: `calc(100% - ${theme.spacing(2)})`,
    margin: theme.spacing(1),
  },
}));

// Update FooterLink to use RouterLink
const FooterLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.secondary.light,
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    color: theme.palette.secondary.light,
  },
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: theme.shape.borderRadius,
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center" sx={{ mb: 4 }}>
        {/* Company Column */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.secondary.light }}>
            {t('footer.company')}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FooterLink to="/about">{t('footer.aboutUs')}</FooterLink>
            <FooterLink to="/how-it-works">{t('footer.howItWorks')}</FooterLink>
            <FooterLink to="/FAQs">{t('footer.faq')}</FooterLink>
            <FooterLink to="/contact">{t('footer.contactUs')}</FooterLink>
            <FooterLink to="/customer-support">{t('footer.customerSupport')}</FooterLink>
            <FooterLink to="/credits">{t('footer.credits')}</FooterLink>
          </Box>
        </Grid>

        {/* Legal Column (Cluely-style) */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.secondary.light }}>
            {t('footer.legal')}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FooterLink to="/privacy-policy">{t('footer.privacyPolicy')}</FooterLink>
            <FooterLink to="/terms-of-service">{t('footer.termsOfService')}</FooterLink>
            <FooterLink to="/cookie-policy">{t('footer.cookiePolicy')}</FooterLink>
            <FooterLink to="/community-guidelines">{t('footer.communityGuidelines')}</FooterLink>
            <FooterLink to="/copyright-ip-terms">{t('footer.copyrightIpTerms')}</FooterLink>
            <FooterLink to="/eula">{t('footer.eula')}</FooterLink>
          </Box>
        </Grid>

        {/* Connect Column */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.secondary.light }}>
            {t('footer.connect')}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "flex-start", gap: 2, mt: 1 }}>
            <SocialButton href="#" aria-label="Facebook">
              <Facebook />
            </SocialButton>
            <SocialButton href="#" aria-label="Twitter">
              <Twitter />
            </SocialButton>
            <SocialButton href="#" aria-label="LinkedIn">
              <LinkedIn />
            </SocialButton>
            <SocialButton href="#" aria-label="Instagram">
              <Instagram />
            </SocialButton>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.primary.contrastText + "CC", mt: 3 }}
          >
            {t('footer.joinCommunity')}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 2, md: 4 },
          mb: 4,
          flexWrap: "wrap",
          borderTop: `1px solid ${theme.palette.primary.light}40`,
          pt: 4,
          mt: 4,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.contrastText + "CC",
            display: "flex",
            alignItems: "center"
          }}
        >
          <CheckCircle
            sx={{ color: theme.palette.success.main, mr: 1, fontSize: "1rem" }}
          />
          {t('footer.verifiedCompanies')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.contrastText + "CC",
            display: "flex",
            alignItems: "center"
          }}
        >
          <TrendingUp
            sx={{ color: theme.palette.info.main, mr: 1, fontSize: "1rem" }}
          />
          {t('footer.successRate')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.contrastText + "CC",
            display: "flex",
            alignItems: "center"
          }}
        >
          <People
            sx={{ color: theme.palette.warning.main, mr: 1, fontSize: "1rem" }}
          />
          {t('footer.support24_7')}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.primary.contrastText + "CC" }}
      >
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </Typography>
    </StyledFooter>
  );
};

export default Footer;