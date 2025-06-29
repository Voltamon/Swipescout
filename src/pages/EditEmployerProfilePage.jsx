import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Checkbox,
  FormControlLabel 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Public as PublicIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getEmployerProfile, 
  updateEmployerProfile, 
  uploadCompanyLogo,
  getEmployerCategories,
  addEmployerCategory,
  deleteEmployerCategory,
  getCategories,
  createEmployerProfile
} from '../services/api';

// Styled components
const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4)
}));

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  margin: '0 auto',
  position: 'relative',
}));

const LogoUploadButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  }
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const EditEmployerProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [categories, setCategories] = useState([]);
const [availableCategories, setAvailableCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('');

  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for employer data
  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    logo: null,
    establish_year: null,
    size: '',
    social: {
      linkedin: '',
      facebook: '',
      twitter: ''
    }
  });

  const [companyLogoPicture, setCompanyLogoPicture] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const fileInputRef = useRef(null);

  const verifyImageAvailability = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) reject(new Error('Empty URL'));

      const img = new Image();
      let timer = setTimeout(() => {
        img.onload = img.onerror = null;
        reject(new Error('Image load timeout'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timer);
        if (img.width > 0 && img.height > 0) {
          resolve();
        } else {
          reject(new Error('Zero dimensions'));
        }
      };
      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Failed to load'));
      };
      img.src = url;
    });
  };

  const handleSaveCategory = async () => {
  if (!selectedCategory) return;
  
  try {
    setSaving(true);
    console.log("selcted catg:::::");
    console.log(selectedCategory);
    await addEmployerCategory(selectedCategory);
    
    // Find the added category
    const addedCategory = availableCategories.find(cat => cat.id === selectedCategory);
    
    if (addedCategory) {
      // Update categories list
      setCategories([...categories, addedCategory]);
      
      // Remove from available categories
      setAvailableCategories(availableCategories.filter(cat => cat.id !== selectedCategory));
    }
    
    showSnackbar('Category added successfully', 'success');
    setSelectedCategory('');
    handleCloseCategoryDialog();
  } catch (error) {
    console.error('Error saving category:', error);
    showSnackbar('Error saving category', 'error');
  } finally {
    setSaving(false);
  }
};

  const handleDeleteCategory = async (categoryId) => {
  try {
    setSaving(true);
    await deleteEmployerCategory(categoryId);
    
    // Update local state
    setCategories(categories.filter(cat => cat.id !== categoryId));
    
    // Add the deleted category back to available options
    const deletedCategory = categories.find(cat => cat.id === categoryId);
    if (deletedCategory) {
      setAvailableCategories([...availableCategories, deletedCategory]);
    }
    
    showSnackbar('Category removed successfully', 'success');
  } catch (error) {
    console.error('Error deleting category:', error);
    showSnackbar('Error deleting category', 'error');
  } finally {
    setSaving(false);
  }
};

  
    const createStarterProfile = async () => {
      setSaving(true);
      setProfile({
        ...profile,
        name: ' '
      });
      await createEmployerProfile(profile);
      setSaving(false);
    }
  // Fetch employer data
// In your useEffect where you fetch data:
  useEffect(() => {
    let profileResponse;
  const fetchEmployerData = async () => {
    try {
      setLoading(true);
      
      try{
              profileResponse = await getEmployerProfile();
              } catch(error) {
              if (error.status === 404) {
                try {
                  await createStarterProfile();
                  profileResponse = await getEmployerProfile();
                  console.log('profile::::1111',profileResponse.data);
                  setProfile(profileResponse.data);
                  setSnackbar({
                    open: true,
                    message: 'Starter profile created..',
                    severity: 'success'
                  });
                } catch (error) {
                  setSnackbar({
                    open: true,
                    message: 'Failed to create starter profile ..',
                    severity: 'error'
                  });
                }
              }     
            }
      const [profileResponse, categoriesResponse, allCategoriesResponse] = await Promise.all([
        
        getEmployerCategories(),
        getCategories()
      ]);
      

      // Handle profile data
      const employerData = profileResponse.data;
      setProfile({
        name: employerData.name || '',
        industry: employerData.industry || '',
        location: employerData.location || '',
        description: employerData.description || '',
        email: employerData.email || '',
        phone: employerData.phone || '',
        website: employerData.website || '',
        logo: employerData.logo || null,
        establish_year: employerData.establish_year || null,
        size: employerData.size || '',
        social: employerData.social || {
          linkedin: '',
          facebook: '',
          twitter: ''
        }
      });

      // Handle employer categories
      // setCategories(categoriesResponse.data?.categories || []);

      // Handle all available categories
      // setAvailableCategories(allCategoriesResponse.data?.categories || []);

      const companyCategoryIds = categoriesResponse.data?.categories?.map(c => c.id) || [];
const filteredAvailableCategories = allCategoriesResponse.data?.categories?.filter(
  cat => !companyCategoryIds.includes(cat.id)
) || [];

setCategories(categoriesResponse.data?.categories || []);
setAvailableCategories(filteredAvailableCategories);

      // Handle logo
      if (employerData.logo) {
        const logoUrl = `${VITE_API_BASE_URL}${employerData.logo}?t=${Date.now()}`;
        try {
          await verifyImageAvailability(logoUrl);
          setCompanyLogoPicture(logoUrl);
        } catch (error) {
          console.error('Company logo image not available:', error);
          setCompanyLogoPicture('');
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employer data:', error);
      
      setLoading(false);
    }
  };
  
  fetchEmployerData();
}, []);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const {  ...profileToUpdate } = profile;
      console.log("profile:::::::::::");
      console.log(profile);
      const response = await updateEmployerProfile(profile);
      
      showSnackbar('Profile updated successfully', 'success');
      
      setSaving(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Error updating profile', 'error');
      setSaving(false);
    }
  };
  
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('logo', file); // Match the field name expected by the backend

      // Show instant preview
      const tempPreviewUrl = URL.createObjectURL(file);
      setCompanyLogoPicture(tempPreviewUrl);

      // Upload to server
      const response = await uploadCompanyLogo(formData);

      // Server returns the FINAL URL (must be immediately accessible)
      const serverUrl = `${VITE_API_BASE_URL}${response.data.logo_url}?t=${Date.now()}`;

      // Verify the image is truly ready (with retries)
      let loaded = false;
      for (let i = 0; i < 3; i++) {
        try {
          await verifyImageAvailability(serverUrl);
          loaded = true;
          break;
        } catch {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (loaded) {
        setProfile(prev => ({ ...prev, logo: response.data.logo_url }));
        setCompanyLogoPicture(serverUrl);
        showSnackbar("Company logo updated!", "success");
      } else {
        showSnackbar("Uploaded! Refresh to see changes.", "info");
      }

      // Clean up preview
      URL.revokeObjectURL(tempPreviewUrl);

    } catch (error) {
      console.error('Error uploading logo:', error);
      showSnackbar("Upload failed. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };
  
  const handleOpenCategoryDialog = () => {
    setCategoryDialogOpen(true);
  };
  
  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setSelectedCategory('');
  };
  

  


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ProfileContainer sx={{
      background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top right',
      padding: 0,
      minHeight: 'calc(100vh - 64px)', // Adjust for header
      mt: 0,
      pt: 2,
      pb: 4,
    }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Edit Company Profile
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            disabled={saving}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Company Logo Section */}
            <SectionPaper elevation={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative' }}>
                  <CompanyLogo 
                    src={companyLogoPicture} 
                    alt={profile.name} 
                    sx={{ '& .MuiAvatar-img': { display: companyLogoPicture ? 'block' : 'none' } }}
                    imgProps={{
                      onError: (e) => {
                        e.target.style.display = 'none';
                        if (companyLogoPicture && companyLogoPicture.startsWith(VITE_API_BASE_URL)) {
                          setTimeout(() => {
                            setCompanyLogoPicture(`${companyLogoPicture.split('?')[0]}?retry=${Date.now()}`);
                          }, 2000);
                        }
                      }
                    }}
                  >
                    {!companyLogoPicture && profile.name?.charAt(0)}
                  </CompanyLogo>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="logo"
                    type="file"
                    name="logo"
                    onChange={handleLogoUpload}
                    ref={fileInputRef}
                  />
                  <label htmlFor="logo">
                    <LogoUploadButton component="span" size="small">
                      <PhotoCameraIcon fontSize="small" />
                    </LogoUploadButton>
                  </label>
                </Box>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {profile.industry}
                </Typography>
              </Box>
            </SectionPaper>

            {/* Tabs Navigation */}
            <Paper sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                centered={!isMobile}
                sx={{ '& .MuiTab-root': { minHeight: 64, ...(isMobile ? { minWidth: 'auto', px: 1 } : {}) } }}
              >
                <Tab icon={<BusinessIcon />} label="Company Details" />
                <Tab icon={<CategoryIcon />} label="Categories" />
              </Tabs>

              {/* Company Details Tab */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="name"
                      value={profile.name || ''}
                      onChange={handleProfileChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      name="industry"
                      value={profile.industry || ''}
                      onChange={handleProfileChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={profile.location || ''}
                      onChange={handleProfileChange}
                      placeholder="City, Country"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={profile.description || ''}
                      onChange={handleProfileChange}
                      multiline
                      rows={4}
                      placeholder="Tell job seekers about your company and what you do"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={handleProfileChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleProfileChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={profile.website || ''}
                      onChange={handleProfileChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PublicIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Founded Year"
                      name="establish_year"
                      value={profile.establish_year || ''}
                      onChange={handleProfileChange}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Size"
                      name="size"
                      value={profile.size || ''}
                      onChange={handleProfileChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Social Media</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="LinkedIn URL"
                          name="social.linkedin"
                          value={profile.social?.linkedin || ''}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkedInIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Facebook URL"
                          name="social.facebook"
                          value={profile.social?.facebook || ''}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FacebookIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Twitter URL"
                          name="social.twitter"
                          value={profile.social?.twitter || ''}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TwitterIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Categories Tab */}
              <TabPanel value={tabValue} index={1}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography variant="h6">Company Categories</Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={handleOpenCategoryDialog}
      disabled={availableCategories.length === 0}
    >
      Add Category
    </Button>
  </Box>
  <Divider sx={{ mb: 2 }} />
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {categories.length > 0 ? (
      categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          onDelete={() => handleDeleteCategory(category.id)}
          color="primary"
          variant="outlined"
          deleteIcon={<CloseIcon />}
          sx={{ 
            '& .MuiChip-deleteIcon': {
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark'
              }
            }
          }}
        />
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        No categories added yet.
      </Typography>
    )}
  </Box>
</TabPanel>
            </Paper>
          </>
        )}


<Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog} fullWidth maxWidth="sm">
  <DialogTitle>Add Category to Company</DialogTitle>
  <DialogContent>
    <FormControl fullWidth margin="normal">
      <InputLabel id="select-category-label">Available Categories</InputLabel>
      <Select
        labelId="select-category-label"
        id="select-category"
        value={selectedCategory}
        label="Available Categories"
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {availableCategories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {availableCategories.length === 0 ? 
          "No more categories available to add" : 
          "Select a category to add to your company"}
      </FormHelperText>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseCategoryDialog} color="inherit">
      Cancel
    </Button>
    <Button 
      onClick={handleSaveCategory} 
      color="primary"
      disabled={saving || !selectedCategory}
    >
      {saving ? 'Adding...' : 'Add Category'}
    </Button>
  </DialogActions>
</Dialog>

        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ProfileContainer>
  );
};

export default EditEmployerProfilePage;