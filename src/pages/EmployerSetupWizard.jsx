import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  Switch
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PhotoCamera as PhotoCameraIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Public as PublicIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
// Mocking external dependencies for standalone execution
// import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
// import { useNavigate } from "react-router-dom";
// import {
//   getEmployerProfile,
//   updateEmployerProfile,
//   uploadCompanyLogo,
//   getCategories,
//   addEmployerCategory,
//   calculateEmployerProfileCompleteness
// } from "../services/employerService";

// Mock useAuth hook
const useAuth = () => ({
  user: { id: 'mockUserId', email: 'mock@example.com' },
});

// Mock useNavigate hook
const useNavigate = () => {
  const navigate = (path) => console.log(`Navigating to: ${path}`);
  return navigate;
};

// Mock service functions
const getEmployerProfile = async () => {
  console.log("Mock: Fetching employer profile...");
  return { data: null }; // Simulate no existing profile
};

const updateEmployerProfile = async (data) => {
  console.log("Mock: Updating employer profile:", data);
  return { success: true };
};

const uploadCompanyLogo = async (formData) => {
  console.log("Mock: Uploading company logo...");
  return { data: { logoUrl: "https://placehold.co/120x120/000000/FFFFFF?text=Logo" } }; // Mock a logo URL
};

const getCategories = async () => {
  console.log("Mock: Getting categories...");
  return { data: [
    { id: 'tech', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'design', name: 'Design' },
  ]};
};

const addEmployerCategory = async (categoryId) => {
  console.log("Mock: Adding employer category:", categoryId);
  return { success: true };
};

const calculateEmployerProfileCompleteness = async (profileData) => {
  console.log("Mock: Calculating completeness...");
  // Simple mock calculation: 100% if companyName exists, otherwise 0%
  const completeness = profileData.companyName ? 100 : 0;
  return { data: { completeness } };
};


const WizardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: "calc(100vh - 56px)"
}));

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2)
}));

const ProgressCard = styled(Card)(({ theme }) => ({
  position: "sticky",
  top: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const EmployerSetupWizard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [profileData, setProfileData] = useState({
    // Company Basic Info
    companyName: "",
    companyDescription: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    website: "",
    companyLogo: null,

    // Contact Info
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    country: "",

    // Company Details
    companyType: "",
    culture: "",
    benefits: [],
    workEnvironment: "",

    // Categories & Specializations
    categories: [],
    specializations: [],

    // Hiring Info
    hiringVolume: "",
    averageTimeToHire: "",
    remoteWorkPolicy: "",

    // Social Media
    linkedinUrl: "",
    facebookUrl: "",
    twitterUrl: "",

    // Premium Features
    isPremium: false,
    featuredCompany: false,
    prioritySupport: false
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const steps = [
    {
      label: "Company Information",
      description: "Basic company details",
      icon: <BusinessIcon />,
      required: true
    },
    {
      label: "Contact & Location",
      description: "How candidates can reach you",
      icon: <LocationOnIcon />,
      required: true
    },
    {
      label: "Company Details",
      description: "Culture, size, and type",
      icon: <PeopleIcon />,
      required: true
    },
    {
      label: "Industry & Categories",
      description: "What your company does",
      icon: <CategoryIcon />,
      required: true
    },
    {
      label: "Hiring Information",
      description: "Your hiring process and policies",
      icon: <WorkIcon />,
      required: false
    },
    {
      label: "Social Media",
      description: "Connect your online presence",
      icon: <LinkedInIcon />,
      required: false
    },
    {
      label: "Premium Features",
      description: "Enhance your company profile",
      icon: <StarIcon />,
      required: false
    }
  ];

  const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Media & Entertainment",
    "Real Estate",
    "Transportation",
    "Energy",
    "Government",
    "Non-profit",
    "Other"
  ];

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees"
  ];

  const companyTypeOptions = [
    "Startup",
    "Small Business",
    "Mid-size Company",
    "Large Corporation",
    "Non-profit",
    "Government Agency",
    "Consulting Firm",
    "Other"
  ];

  const benefitsOptions = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "Retirement Plan",
    "Paid Time Off",
    "Flexible Hours",
    "Remote Work",
    "Professional Development",
    "Gym Membership",
    "Free Meals",
    "Stock Options",
    "Bonus Program"
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(
    () => {
      calculateCompleteness();
    },
    [profileData]
  );

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [profileResponse, categoriesResponse] = await Promise.all([
        getEmployerProfile(),
        getCategories()
      ]);

      if (profileResponse.data) {
        setProfileData(prev => ({
          ...prev,
          ...profileResponse.data
        }));
      }

      setAvailableCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      showSnackbar("Error loading profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateCompleteness = async () => {
    try {
      const response = await calculateEmployerProfileCompleteness(profileData);
      setProfileCompleteness(response.data.completeness || 0);
    } catch (error) {
      console.error("Error calculating completeness:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async event => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("logo", file);

        const response = await uploadCompanyLogo(formData);
        handleInputChange("companyLogo", response.data.logoUrl);
        showSnackbar("Company logo uploaded successfully", "success");
      } catch (error) {
        console.error("Error uploading logo:", error);
        showSnackbar("Error uploading logo", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCategoryAdd = async category => {
    try {
      await addEmployerCategory({ categoryId: category.id });
      setProfileData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    } catch (error) {
      console.error("Error adding category:", error);
      showSnackbar("Error adding category", "error");
    }
  };

  const handleCategoryRemove = categoryId => {
    setProfileData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  const validateStep = stepIndex => {
    switch (stepIndex) {
      case 0: // Company Information
        return (
          profileData.companyName &&
          profileData.companyDescription &&
          profileData.industry
        );
      case 1: // Contact & Location
        return (
          profileData.contactEmail && profileData.city && profileData.country
        );
      case 2: // Company Details
        return profileData.companySize && profileData.companyType;
      case 3: // Industry & Categories
        return profileData.categories.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setCompletedSteps(prev => new Set([...prev, activeStep]));
      setActiveStep(prev => prev + 1);
    } else {
      showSnackbar("Please complete all required fields", "warning");
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleStepClick = stepIndex => {
    setActiveStep(stepIndex);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      await updateEmployerProfile(profileData);
      showSnackbar("Company profile setup completed successfully!", "success");
      navigate("/employer-dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      showSnackbar("Error saving profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const renderStepContent = stepIndex => {
    switch (stepIndex) {
      case 0: // Company Information
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                src={profileData.companyLogo}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              >
                <BusinessIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="company-logo-upload"
                type="file"
                onChange={handleLogoUpload}
              />
              <label htmlFor="company-logo-upload">
                <IconButton color="primary" component="span">
                  <PhotoCameraIcon />
                </IconButton>
              </label>
              <Typography variant="caption" display="block">
                Upload Company Logo
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Company Name *"
              value={profileData.companyName}
              onChange={e => handleInputChange("companyName", e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Company Description *"
              multiline
              rows={4}
              value={profileData.companyDescription}
              onChange={e =>
                handleInputChange("companyDescription", e.target.value)}
              placeholder="Describe your company, mission, and what makes it unique..."
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Industry *</InputLabel>
              <Select
                value={profileData.industry}
                onChange={e => handleInputChange("industry", e.target.value)}
                label="Industry *"
              >
                {industryOptions.map(industry =>
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Founded Year"
              type="number"
              value={profileData.foundedYear}
              onChange={e => handleInputChange("foundedYear", e.target.value)}
              inputProps={{ min: 1800, max: new Date().getFullYear() }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Company Website"
              value={profileData.website}
              onChange={e => handleInputChange("website", e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </StepCard>
        );

      case 1: // Contact & Location
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Contact & Location
            </Typography>

            <TextField
              fullWidth
              label="Contact Email *"
              type="email"
              value={profileData.contactEmail}
              onChange={e => handleInputChange("contactEmail", e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Contact Phone"
              value={profileData.contactPhone}
              onChange={e => handleInputChange("contactPhone", e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Address"
              value={profileData.address}
              onChange={e => handleInputChange("address", e.target.value)}
              placeholder="Street address"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="City *"
              value={profileData.city}
              onChange={e => handleInputChange("city", e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Country *"
              value={profileData.country}
              onChange={e => handleInputChange("country", e.target.value)}
            />
          </StepCard>
        );

      case 2: // Company Details
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Company Details
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Company Size *</InputLabel>
              <Select
                value={profileData.companySize}
                onChange={e => handleInputChange("companySize", e.target.value)}
                label="Company Size *"
              >
                {companySizeOptions.map(size =>
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Company Type *</InputLabel>
              <Select
                value={profileData.companyType}
                onChange={e => handleInputChange("companyType", e.target.value)}
                label="Company Type *"
              >
                {companyTypeOptions.map(type =>
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Company Culture"
              multiline
              rows={3}
              value={profileData.culture}
              onChange={e => handleInputChange("culture", e.target.value)}
              placeholder="Describe your company culture and values..."
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Benefits & Perks</InputLabel>
              <Select
                multiple
                value={profileData.benefits}
                onChange={e => handleInputChange("benefits", e.target.value)}
                label="Benefits & Perks"
                renderValue={selected =>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map(value =>
                      <Chip key={value} label={value} size="small" />
                    )}
                  </Box>}
              >
                {benefitsOptions.map(benefit =>
                  <MenuItem key={benefit} value={benefit}>
                    {benefit}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Work Environment</InputLabel>
              <Select
                value={profileData.workEnvironment}
                onChange={e =>
                  handleInputChange("workEnvironment", e.target.value)}
                label="Work Environment"
              >
                <MenuItem value="office">Traditional Office</MenuItem>
                <MenuItem value="open">Open Office</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="remote">Fully Remote</MenuItem>
                <MenuItem value="flexible">Flexible</MenuItem>
              </Select>
            </FormControl>
          </StepCard>
        );

      case 3: // Industry & Categories
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Industry & Categories
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select categories that best describe your company's focus areas
            </Typography>

            <Autocomplete
              options={availableCategories}
              getOptionLabel={option => option.name}
              onChange={(event, value) => {
                if (
                  value &&
                  !profileData.categories.find(cat => cat.id === value.id)
                ) {
                  handleCategoryAdd(value);
                }
              }}
              renderInput={params =>
                <TextField
                  {...params}
                  label="Search and add categories"
                  placeholder="Type to search categories..."
                />}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {profileData.categories.map(category =>
                <Chip
                  key={category.id}
                  label={category.name}
                  onDelete={() => handleCategoryRemove(category.id)}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            <TextField
              fullWidth
              label="Specializations"
              multiline
              rows={3}
              value={profileData.specializations.join(", ")}
              onChange={e =>
                handleInputChange(
                  "specializations",
                  e.target.value.split(", ")
                )}
              placeholder="List your company's key specializations (comma-separated)"
            />

            {profileData.categories.length === 0 &&
              <Alert severity="info" sx={{ mt: 2 }}>
                Please add at least one category to continue
              </Alert>}
          </StepCard>
        );

      case 4: // Hiring Information
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Hiring Information
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Hiring Volume</InputLabel>
              <Select
                value={profileData.hiringVolume}
                onChange={e =>
                  handleInputChange("hiringVolume", e.target.value)}
                label="Hiring Volume"
              >
                <MenuItem value="1-5">1-5 hires per year</MenuItem>
                <MenuItem value="6-20">6-20 hires per year</MenuItem>
                <MenuItem value="21-50">21-50 hires per year</MenuItem>
                <MenuItem value="50+">50+ hires per year</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Average Time to Hire</InputLabel>
              <Select
                value={profileData.averageTimeToHire}
                onChange={e =>
                  handleInputChange("averageTimeToHire", e.target.value)}
                label="Average Time to Hire"
              >
                <MenuItem value="1-2 weeks">1-2 weeks</MenuItem>
                <MenuItem value="3-4 weeks">3-4 weeks</MenuItem>
                <MenuItem value="1-2 months">1-2 months</MenuItem>
                <MenuItem value="2+ months">2+ months</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Remote Work Policy</InputLabel>
              <Select
                value={profileData.remoteWorkPolicy}
                onChange={e =>
                  handleInputChange("remoteWorkPolicy", e.target.value)}
                label="Remote Work Policy"
              >
                <MenuItem value="no-remote">No Remote Work</MenuItem>
                <MenuItem value="hybrid">Hybrid (2-3 days remote)</MenuItem>
                <MenuItem value="flexible">Flexible Remote</MenuItem>
                <MenuItem value="fully-remote">Fully Remote</MenuItem>
                <MenuItem value="remote-first">Remote First</MenuItem>
              </Select>
            </FormControl>
          </StepCard>
        );

      case 5: // Social Media
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Social Media & Online Presence
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Connect your company's social media profiles
            </Typography>

            <TextField
              fullWidth
              label="LinkedIn Company Page"
              value={profileData.linkedinUrl}
              onChange={e => handleInputChange("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
              InputProps={{
                startAdornment: (
                  <LinkedInIcon sx={{ mr: 1, color: "action.active" }} />
                )
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Facebook Page"
              value={profileData.facebookUrl}
              onChange={e => handleInputChange("facebookUrl", e.target.value)}
              placeholder="https://facebook.com/yourcompany"
              InputProps={{
                startAdornment: (
                  <FacebookIcon sx={{ mr: 1, color: "action.active" }} />
                )
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Twitter Profile"
              value={profileData.twitterUrl}
              onChange={e => handleInputChange("twitterUrl", e.target.value)}
              placeholder="https://twitter.com/yourcompany"
              InputProps={{
                startAdornment: (
                  <TwitterIcon sx={{ mr: 1, color: "action.active" }} />
                )
              }}
            />
          </StepCard>
        );

      case 6: // Premium Features
        return (
          <StepCard>
            <Typography variant="h6" gutterBottom>
              Premium Features
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enhance your company profile with premium features
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      Premium Company Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enhanced visibility, priority in search results, and
                      advanced analytics
                    </Typography>
                  </Box>
                  <Switch
                    checked={profileData.isPremium}
                    onChange={e =>
                      handleInputChange("isPremium", e.target.checked)}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography variant="h6">Featured Company</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Appear in featured companies section and job
                      recommendations
                    </Typography>
                  </Box>
                  <Switch
                    checked={profileData.featuredCompany}
                    onChange={e =>
                      handleInputChange("featuredCompany", e.target.checked)}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography variant="h6">Priority Support</Typography>
                    <Typography variant="body2" color="text.secondary">
                      24/7 priority customer support and dedicated account
                      manager
                    </Typography>
                  </Box>
                  <Switch
                    checked={profileData.prioritySupport}
                    onChange={e =>
                      handleInputChange("prioritySupport", e.target.checked)}
                  />
                </Box>
              </CardContent>
            </Card>

            {(profileData.isPremium ||
              profileData.featuredCompany ||
              profileData.prioritySupport) &&
              <Alert severity="info" sx={{ mt: 2 }}>
                Premium features require a subscription. You can set up billing
                after completing your profile.
              </Alert>}
          </StepCard>
        );

      default:
        return null;
    }
  };

  return <WizardContainer maxWidth="lg">
      {/* Snackbar for alerts */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(
            { ...snackbar, open: false }
          )}>
        <Alert onClose={() => setSnackbar({
              ...snackbar,
              open: false
            })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Main Grid Container */}
      <Grid container spacing={3}>
        {/* Main Content (Left Side - 8 columns on desktop) */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Complete Your Company Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Set up your company profile to attract top talent
            </Typography>
          </Box>

          {renderStepContent(activeStep)}

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined">
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? <Button onClick={handleFinish} variant="contained" size="large" disabled={loading}>
                    {loading ? "Saving..." : "Complete Setup"}
                  </Button> : <Button onClick={handleNext} variant="contained" disabled={!validateStep(activeStep)}>
                    Next
                  </Button>}
            </Box>
          </Box>
        </Grid>

        {/* Progress Sidebar (Right Side - 4 columns on desktop) */}
        <Grid item xs={12} md={4}>
          <ProgressCard sx={{ mt:15}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Completion
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LinearProgress variant="determinate" value={profileCompleteness} sx={{ flex: 1, mr: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {profileCompleteness}%
                </Typography>
              </Box>

              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) =>
                  <Step
                    key={step.label}
                    completed={completedSteps.has(index)}
                  >
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      sx={{ cursor: "pointer" }}
                      icon={
                        completedSteps.has(index)
                          ? <CheckCircleIcon color="success" />
                          : step.icon
                      }
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {step.label}
                          {step.required &&
                            <span style={{ color: "red" }}> *</span>}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </StepLabel>
                  </Step>
                )}
              </Stepper>
            </CardContent>
          </ProgressCard>
        </Grid>
      </Grid>
    </WizardContainer>;
}

export default EmployerSetupWizard;
