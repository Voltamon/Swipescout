import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  StarBorder as StarBorderIcon,
  BusinessCenter as BusinessCenterIcon,
  Diamond as DiamondIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Header from "../components/Headers/Header"; // Updated Header path
import Footer from "../components/Headers/Footer"; 

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    description: "Perfect for individuals starting their job search.",
    features: [
      "2 video resume",
      "Apply to 10 jobs/month",
      "Basic profile & messaging",
      "Community support",
    ],
    buttonText: "Start Free",
    buttonVariant: "outlined",
    buttonColor: "primary",
  },
  {
    title: "Professional",
    price: "$9.99",
    period: "/month",
    description: "Ideal for active job seekers and small businesses.",
    features: [
      "5 video resumes",
      "50 applications/month",
      "Advanced analytics",
      "Priority support",
      "AI job matching",
      "Video editing tools",
    ],
    buttonText: "Choose Professional",
    buttonVariant: "contained",
    buttonColor: "primary",
    highlight: true,
  },
  {
    title: "Premium",
    price: "$19.99",
    period: "/month",
    description: "For serious job seekers and growing companies.",
    features: [
      "Unlimited video resumes",
      "Unlimited applications",
      "Career coaching access",
      "Interview preparation",
      "Skill assessments",
      "Direct recruiter contact",
    ],
    buttonText: "Choose Premium",
    buttonVariant: "outlined",
    buttonColor: "secondary",
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations.",
    features: [
      "Everything in Premium",
      "Dedicated account manager",
      "Custom integrations",
      "API access",
      "White-label solutions",
      "Priority job placement",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outlined",
    buttonColor: "info",
  },
];

const professionalServices = [
  {
    title: "Career Coaching",
    price: "$99.99",
    description: "1-hour expert sessions to guide your career path.",
    icon: <BusinessCenterIcon sx={{ fontSize: 40, color: "#4caf50" }} />,
  },
  {
    title: "Resume Review",
    price: "$49.99",
    description: "Professional optimization of your resume for maximum impact.",
    icon: <StarBorderIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
  },
  {
    title: "Interview Prep",
    price: "$149.99",
    description: "Complete preparation package for your next big interview.",
    icon: <DiamondIcon sx={{ fontSize: 40, color: "#2196f3" }} />,
  },
];

export default function PricingPage() {
  const theme = useTheme();

  return (
    <><Header />
    <Box
      sx={{
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 6, color: theme.palette.primary.main }}
        >
          Flexible Plans for Every Need
        </Typography>

        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={3} key={index}>
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
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: plan.highlight ? theme.shadows[15] : theme.shadows[6],
                  },
                }}
              >
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
                    {plan.price}
                    {plan.period && (
                      <Typography component="span" variant="h6" color="text.secondary">
                        {plan.period}
                      </Typography>
                    )}
                  </Typography>
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
                    component={Link}
                    to="#" // Link to signup or a checkout page
                    sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
                  >
                    {plan.buttonText}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mt: 8, mb: 6, color: theme.palette.primary.main }}
        >
          Professional Services
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {professionalServices.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  borderRadius: theme.shape.borderRadius * 2,
                  boxShadow: theme.shadows[3],
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: "bold", mb: 1, color: theme.palette.primary.dark }}
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                    {service.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/contact" // Link to a contact or booking page for services
                    sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    <Footer/>
    </>
  );
}

