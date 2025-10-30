import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  StarBorder as StarBorderIcon,
  BusinessCenter as BusinessCenterIcon,
  Diamond as DiamondIcon,
  Check,
  Star,
  Business,
  Person,
  CreditCard,
  Security,
  Support,
  Work,
  Search,
  Analytics,
  VideoLibrary,
  Message,
  TrendingUp,
  Group
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import Header from "../components/Headers/Header";
import Footer from "../components/Headers/Footer";
import { 
  getPlansAndServices, 
  createSubscription, 
  purchaseService,
  getSubscriptionStatus 
} from '@/services/api';

import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pricing-tabpanel-${index}`}
      aria-labelledby={`pricing-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PricingPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation(); // Add i18n for language detection
  const [tabValue, setTabValue] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Job Seeker Plans
const jobSeekerPlans = [
  {
    id: 'basic',
    type: 'BASIC',
    title: t('pricing.jobSeekerPlans.basic.title'),
    price: t('pricing.jobSeekerPlans.basic.price'),
    monthlyPrice: 0,
    annualPrice: 0,
    description: t('pricing.jobSeekerPlans.basic.description'),
    features: [
      t('pricing.jobSeekerPlans.basic.features.0'),
      t('pricing.jobSeekerPlans.basic.features.1'),
      t('pricing.jobSeekerPlans.basic.features.2'),
      t('pricing.jobSeekerPlans.basic.features.3'),
      t('pricing.jobSeekerPlans.basic.features.4')
    ],
    buttonText: t('pricing.jobSeekerPlans.basic.buttonText'),
    buttonVariant: "outlined",
    buttonColor: "primary",
    mostPopular: false
  },
  {
    id: 'professional',
    type: 'PROFESSIONAL',
    title: t('pricing.jobSeekerPlans.professional.title'),
    price: t('pricing.jobSeekerPlans.professional.price'),
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    period: "/month",
    description: t('pricing.jobSeekerPlans.professional.description'),
    features: [
      t('pricing.jobSeekerPlans.professional.features.0'),
      t('pricing.jobSeekerPlans.professional.features.1'),
      t('pricing.jobSeekerPlans.professional.features.2'),
      t('pricing.jobSeekerPlans.professional.features.3'),
      t('pricing.jobSeekerPlans.professional.features.4'),
      t('pricing.jobSeekerPlans.professional.features.5'),
      t('pricing.jobSeekerPlans.professional.features.6')
    ],
    buttonText: t('pricing.jobSeekerPlans.professional.buttonText'),
    buttonVariant: "contained",
    buttonColor: "primary",
    highlight: true,
    mostPopular: true
  },
  {
    id: 'premium',
    type: 'PREMIUM',
    title: t('pricing.jobSeekerPlans.premium.title'),
    price: t('pricing.jobSeekerPlans.premium.price'),
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    period: "/month",
    description: t('pricing.jobSeekerPlans.premium.description'),
    features: [
      t('pricing.jobSeekerPlans.premium.features.0'),
      t('pricing.jobSeekerPlans.premium.features.1'),
      t('pricing.jobSeekerPlans.premium.features.2'),
      t('pricing.jobSeekerPlans.premium.features.3'),
      t('pricing.jobSeekerPlans.premium.features.4'),
      t('pricing.jobSeekerPlans.premium.features.5'),
      t('pricing.jobSeekerPlans.premium.features.6'),
      t('pricing.jobSeekerPlans.premium.features.7')
    ],
    buttonText: t('pricing.jobSeekerPlans.premium.buttonText'),
    buttonVariant: "outlined",
    buttonColor: "secondary",
    mostPopular: false
  }
];

// Employer Plans
const employerPlans = [
  {
    id: 'starter',
    type: 'STARTER',
    title: t('pricing.employerPlans.starter.title'),
    price: t('pricing.employerPlans.starter.price'),
    monthlyPrice: 29.99,
    annualPrice: 299.99,
    period: "/month",
    description: t('pricing.employerPlans.starter.description'),
    features: [
      t('pricing.employerPlans.starter.features.0'),
      t('pricing.employerPlans.starter.features.1'),
      t('pricing.employerPlans.starter.features.2'),
      t('pricing.employerPlans.starter.features.3'),
      t('pricing.employerPlans.starter.features.4'),
      t('pricing.employerPlans.starter.features.5')
    ],
    buttonText: t('pricing.employerPlans.starter.buttonText'),
    buttonVariant: "outlined",
    buttonColor: "primary",
    mostPopular: false
  },
  {
    id: 'business',
    type: 'BUSINESS',
    title: t('pricing.employerPlans.business.title'),
    price: t('pricing.employerPlans.business.price'),
    monthlyPrice: 79.99,
    annualPrice: 799.99,
    period: "/month",
    description: t('pricing.employerPlans.business.description'),
    features: [
      t('pricing.employerPlans.business.features.0'),
      t('pricing.employerPlans.business.features.1'),
      t('pricing.employerPlans.business.features.2'),
      t('pricing.employerPlans.business.features.3'),
      t('pricing.employerPlans.business.features.4'),
      t('pricing.employerPlans.business.features.5'),
      t('pricing.employerPlans.business.features.6'),
      t('pricing.employerPlans.business.features.7')
    ],
    buttonText: t('pricing.employerPlans.business.buttonText'),
    buttonVariant: "contained",
    buttonColor: "primary",
    highlight: true,
    mostPopular: true
  },
  {
    id: 'enterprise',
    type: 'ENTERPRISE',
    title: t('pricing.employerPlans.enterprise.title'),
    price: t('pricing.employerPlans.enterprise.price'),
    monthlyPrice: 199.99,
    annualPrice: 1999.99,
    period: "/month",
    description: t('pricing.employerPlans.enterprise.description'),
    features: [
      t('pricing.employerPlans.enterprise.features.0'),
      t('pricing.employerPlans.enterprise.features.1'),
      t('pricing.employerPlans.enterprise.features.2'),
      t('pricing.employerPlans.enterprise.features.3'),
      t('pricing.employerPlans.enterprise.features.4'),
      t('pricing.employerPlans.enterprise.features.5'),
      t('pricing.employerPlans.enterprise.features.6'),
      t('pricing.employerPlans.enterprise.features.7'),
      t('pricing.employerPlans.enterprise.features.8')
    ],
    buttonText: t('pricing.employerPlans.enterprise.buttonText'),
    buttonVariant: "outlined",
    buttonColor: "info",
    mostPopular: false
  }
];

// Professional Services for Job Seekers
const jobSeekerServices = [
  {
    id: 'career-coaching',
    type: 'CAREER_COACHING',
    title: t('pricing.jobSeekerServices.careerCoaching.title'),
    price: t('pricing.jobSeekerServices.careerCoaching.price'),
    description: t('pricing.jobSeekerServices.careerCoaching.description'),
    icon: <BusinessCenterIcon sx={{ fontSize: 40, color: "#4caf50" }} />,
    duration: t('pricing.jobSeekerServices.careerCoaching.duration'),
    features: [
      t('pricing.jobSeekerServices.careerCoaching.features.0'),
      t('pricing.jobSeekerServices.careerCoaching.features.1'),
      t('pricing.jobSeekerServices.careerCoaching.features.2'),
      t('pricing.jobSeekerServices.careerCoaching.features.3')
    ]
  },
  {
    id: 'resume-review',
    type: 'RESUME_REVIEW',
    title: t('pricing.jobSeekerServices.resumeReview.title'),
    price: t('pricing.jobSeekerServices.resumeReview.price'),
    description: t('pricing.jobSeekerServices.resumeReview.description'),
    icon: <StarBorderIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
    duration: t('pricing.jobSeekerServices.resumeReview.duration'),
    features: [
      t('pricing.jobSeekerServices.resumeReview.features.0'),
      t('pricing.jobSeekerServices.resumeReview.features.1'),
      t('pricing.jobSeekerServices.resumeReview.features.2'),
      t('pricing.jobSeekerServices.resumeReview.features.3')
    ]
  },
  {
    id: 'interview-prep',
    type: 'INTERVIEW_PREP',
    title: t('pricing.jobSeekerServices.interviewPrep.title'),
    price: t('pricing.jobSeekerServices.interviewPrep.price'),
    description: t('pricing.jobSeekerServices.interviewPrep.description'),
    icon: <DiamondIcon sx={{ fontSize: 40, color: "#2196f3" }} />,
    duration: t('pricing.jobSeekerServices.interviewPrep.duration'),
    features: [
      t('pricing.jobSeekerServices.interviewPrep.features.0'),
      t('pricing.jobSeekerServices.interviewPrep.features.1'),
      t('pricing.jobSeekerServices.interviewPrep.features.2'),
      t('pricing.jobSeekerServices.interviewPrep.features.3')
    ]
  },
  {
    id: 'linkedin-optimization',
    type: 'LINKEDIN_OPTIMIZATION',
    title: t('pricing.jobSeekerServices.linkedinOptimization.title'),
    price: t('pricing.jobSeekerServices.linkedinOptimization.price'),
    description: t('pricing.jobSeekerServices.linkedinOptimization.description'),
    icon: <TrendingUp sx={{ fontSize: 40, color: "#0077b5" }} />,
    duration: t('pricing.jobSeekerServices.linkedinOptimization.duration'),
    features: [
      t('pricing.jobSeekerServices.linkedinOptimization.features.0'),
      t('pricing.jobSeekerServices.linkedinOptimization.features.1'),
      t('pricing.jobSeekerServices.linkedinOptimization.features.2'),
      t('pricing.jobSeekerServices.linkedinOptimization.features.3')
    ]
  }
];

// Professional Services for Employers
const employerServices = [
  {
    id: 'recruitment-consulting',
    type: 'RECRUITMENT_CONSULTING',
    title: t('pricing.employerServices.recruitmentConsulting.title'),
    price: t('pricing.employerServices.recruitmentConsulting.price'),
    description: t('pricing.employerServices.recruitmentConsulting.description'),
    icon: <Group sx={{ fontSize: 40, color: "#4caf50" }} />,
    duration: t('pricing.employerServices.recruitmentConsulting.duration'),
    features: [
      t('pricing.employerServices.recruitmentConsulting.features.0'),
      t('pricing.employerServices.recruitmentConsulting.features.1'),
      t('pricing.employerServices.recruitmentConsulting.features.2'),
      t('pricing.employerServices.recruitmentConsulting.features.3')
    ]
  },
  {
    id: 'employer-branding',
    type: 'EMPLOYER_BRANDING',
    title: t('pricing.employerServices.employerBranding.title'),
    price: t('pricing.employerServices.employerBranding.price'),
    description: t('pricing.employerServices.employerBranding.description'),
    icon: <Business sx={{ fontSize: 40, color: "#ff9800" }} />,
    duration: t('pricing.employerServices.employerBranding.duration'),
    features: [
      t('pricing.employerServices.employerBranding.features.0'),
      t('pricing.employerServices.employerBranding.features.1'),
      t('pricing.employerServices.employerBranding.features.2'),
      t('pricing.employerServices.employerBranding.features.3')
    ]
  },
  {
    id: 'team-training',
    type: 'TEAM_TRAINING',
    title: t('pricing.employerServices.teamTraining.title'),
    price: t('pricing.employerServices.teamTraining.price'),
    description: t('pricing.employerServices.teamTraining.description'),
    icon: <Support sx={{ fontSize: 40, color: "#2196f3" }} />,
    duration: t('pricing.employerServices.teamTraining.duration'),
    features: [
      t('pricing.employerServices.teamTraining.features.0'),
      t('pricing.employerServices.teamTraining.features.1'),
      t('pricing.employerServices.teamTraining.features.2'),
      t('pricing.employerServices.teamTraining.features.3')
    ]
  }
];

  useEffect(() => {
    if (user) {
      loadCurrentSubscription();
    }
  }, [user]);

  useEffect(() => {
    // Update tab labels dynamically when the language changes
    setTabValue((prevValue) => prevValue); // Trigger re-render to update labels
  }, [i18n.language]); // Listen for language changes

  const loadCurrentSubscription = async () => {
    try {
      const response = await getSubscriptionStatus(user.id);
      setCurrentSubscription(response.data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: t('errors.loginRequired'),
        severity: 'warning'
      });
      return;
    }

    setSelectedPlan(plan);
    setPaymentDialog(true);
  };

  const handleConfirmSubscription = async () => {
    setSubscribing(true);
    try {
      await createSubscription(selectedPlan.type, user.id, isAnnual);
      setSnackbar({
        open: true,
        message: t('success.subscriptionUpdated'),
        severity: 'success'
      });
      setPaymentDialog(false);
      loadCurrentSubscription();
    } catch (error) {
      console.error('Error creating subscription:', error);
      setSnackbar({
        open: true,
        message: t('errors.genericError'),
        severity: 'error'
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handlePurchaseService = async (service) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: t('errors.loginRequired'),
        severity: 'warning'
      });
      return;
    }

    try {
      await purchaseService(service.type, user.id);
      setSnackbar({
        open: true,
        message: t('success.paymentProcessed'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Error purchasing service:', error);
      setSnackbar({
        open: true,
        message: t('errors.genericError'),
        severity: 'error'
      });
    }
  };

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (!plan.annualPrice || !plan.monthlyPrice) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.annualPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const renderPricingCards = (plansList) => (
    <Grid container spacing={4} alignItems="stretch" justifyContent="center">
      {plansList.map((plan, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 3,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: plan.highlight ? theme.shadows[10] : theme.shadows[3],
              border: plan.highlight ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
              transition: "all 0.3s ease-in-out",
              position: 'relative',
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: plan.highlight ? theme.shadows[15] : theme.shadows[6],
              },
            }}
          >
            {plan.mostPopular && (
              <Chip
                label={t('pricing.mostPopular')}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            )}
            
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                sx={{ fontWeight: "bold", mb: 2, color: theme.palette.primary.dark }}
              >
                {plan.title}
              </Typography>
              <Typography
                variant="h4"
                align="center"
                sx={{ fontWeight: "bold", mb: 2, color: theme.palette.text.primary }}
              >
                {plan.monthlyPrice !== null ? 
                  `$${isAnnual ? (plan.annualPrice || plan.monthlyPrice * 12) : plan.monthlyPrice}` : 
                  plan.price
                }
                {plan.period && !isAnnual && (
                  <Typography component="span" variant="h6" color="text.secondary">
                    {plan.period}
                  </Typography>
                )}
                {plan.period && isAnnual && (
                  <Typography component="span" variant="h6" color="text.secondary">
                    /{t('pricing.year')}
                  </Typography>
                )}
              </Typography>
              
              {isAnnual && getSavings(plan) > 0 && (
                <Box textAlign="center" mb={2}>
                  <Chip
                    label={t('pricing.savePercent', { percent: getSavings(plan) })}
                    color="success"
                    size="small"
                  />
                </Box>
              )}
              
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                {plan.description}
              </Typography>
              <List>
                {plan.features.map((feature, featureIndex) => (
                  <ListItem key={featureIndex} disableGutters>
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      <CheckCircleOutlineIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant={plan.buttonVariant}
                color={plan.buttonColor}
                onClick={() => plan.type === 'ENTERPRISE' ? null : handleSubscribe(plan)}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                {plan.buttonText}
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderServiceCards = (servicesList) => (
    <Grid container spacing={4} sx={{ mt: 4 }}>
      {servicesList.map((service, index) => (
        <Grid item xs={12} md={6} lg={3} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 3,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[3],
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                {service.icon}
              </Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {service.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 1, color: theme.palette.primary.main }}
              >
                {service.price}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {service.description}
              </Typography>
              {service.duration && (
                <Chip
                  label={service.duration}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}
              {service.features && (
                <List dense>
                  {service.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} disableGutters>
                      <ListItemIcon sx={{ minWidth: 25 }}>
                        <Check color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => handlePurchaseService(service)}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                {t('pricing.purchaseService')}
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <Header />
      <Box
        sx={{
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          py: { xs: 4, md: 8 }, // Adjust padding for mobile
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: { xs: 2, md: 4 },
                color: theme.palette.primary.main,
                fontSize: { xs: "1.8rem", md: "2.5rem" }, // Adjust font size for mobile
              }}
            >
              {t('pricing.choosePlan')}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{
                mb: { xs: 3, md: 4 },
                fontSize: { xs: "0.9rem", md: "1rem" }, // Adjust font size for mobile
              }}
            >
              {t('pricing.features')}
            </Typography>
            <Paper sx={{ mb: { xs: 3, md: 4 } }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    minWidth: { xs: 100, md: 200 }, // Adjust tab width for mobile
                    py: { xs: 1, md: 2 },
                    fontSize: { xs: "0.9rem", md: "1.1rem" }, // Adjust font size for mobile
                    fontWeight: "bold",
                  },
                }}
              >
                <Tab 
                  icon={<Person />} 
                  label={t('pricing.tabs.jobSeekerPlans')}
                  iconPosition="start"
                />
                <Tab 
                  icon={<Business />} 
                  label={t('pricing.tabs.employerPlans')}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>
            <Box display="flex" justifyContent="center" alignItems="center" mt={{ xs: 2, md: 4 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {t('pricing.monthly')}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAnnual}
                    onChange={(e) => setIsAnnual(e.target.checked)}
                    color="primary"
                  />
                }
                label=""
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {t('pricing.yearly')}
              </Typography>
              <Chip
                label={t('pricing.savePercent', { percent: 20 })}
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
          </Box>

          {/* Current Subscription */}
          {currentSubscription && (
            <Card sx={{ mb: 4, bgcolor: 'primary.50' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('pricing.currentSubscription.title')}
                </Typography>
                <Typography variant="body1">
                  {t('pricing.currentSubscription.plan')}: {currentSubscription.planType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentSubscription.isActive ? t('pricing.currentSubscription.active') : t('pricing.currentSubscription.inactive')} • 
                  {t('pricing.currentSubscription.expires')}: {new Date(currentSubscription.expiresAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {/* Job Seeker Plans */}
            {renderPricingCards(jobSeekerPlans)}
            
            {/* Job Seeker Services */}
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 4, color: theme.palette.primary.main }}
              >
                {t('pricing.featureList')}
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                {t('pricing.jobAlerts')}
              </Typography>
              {renderServiceCards(jobSeekerServices)}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Employer Plans */}
            {renderPricingCards(employerPlans)}
            
            {/* Employer Services */}
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 4, color: theme.palette.primary.main }}
              >
                {t('pricing.featureList')}
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                {t('pricing.contactSales')}
              </Typography>
              {renderServiceCards(employerServices)}
            </Box>
          </TabPanel>

          {/* Trust Indicators */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t('pricing.trustedBy')}
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Security color="primary" />
                  <Typography variant="body1">{t('pricing.securePayments')}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Support color="primary" />
                  <Typography variant="body1">{t('pricing.support247')}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Star color="primary" />
                  <Typography variant="body1">{t('pricing.moneyBackGuarantee')}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('pricing.confirmSubscription.title')}</DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedPlan.title} {t('pricing.confirmSubscription.plan')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                ${isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice} 
                {isAnnual ? `/${t('pricing.year')}` : `/${t('pricing.month')}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPlan.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleConfirmSubscription} 
            variant="contained" 
            disabled={subscribing}
          >
            {subscribing ? <CircularProgress size={20} /> : t('pricing.confirmSubscription.button')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
}

