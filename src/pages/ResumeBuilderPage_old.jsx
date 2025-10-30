import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  LinearProgress,
  Alert,
  useTheme,
  Paper,
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  CircularProgress,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import {
  Upload,
  Download,
  Preview,
  Add,
  Delete,
  Edit,
  Save,
  Print,
  PictureAsPdf,
  Description,
  Work,
  School,
  Star,
  Language,
  EmojiEvents,
  ExpandMore,
  CloudUpload,
  Visibility,
  GetApp
} from "@mui/icons-material";
import { 
  extractCVData, 
  generateResume, 
  previewResume, 
  saveResume, 
  getUserResumes 
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

export default function ResumeBuilderPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [previewDialog, setPreviewDialog] = useState({ open: false, html: "" });
  const [savedResumes, setSavedResumes] = useState([]);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [uploadedFile, setUploadedFile] = useState(null);

  const steps = [
    'Personal Information',
    'Experience',
    'Education',
    'Skills & Languages',
    'Additional Information',
    'Preview & Download'
  ];

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional design' },
    { id: 'classic', name: 'Classic', description: 'Traditional and formal layout' }
  ];

  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = async () => {
    try {
      const response = await getUserResumes();
      // response.data might be an array or an object { resumes: [...] }
      const data = response?.data;
      if (Array.isArray(data)) setSavedResumes(data);
      else if (data && Array.isArray(data.resumes)) setSavedResumes(data.resumes);
      else setSavedResumes([]);
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setExtracting(true);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await extractCVData(formData);
      setResumeData(response.data);
      setSnackbar({
        open: true,
        message: "CV data extracted successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error('Error extracting CV data:', error);
      setSnackbar({
        open: true,
        message: "Failed to extract CV data. Please try again.",
        severity: "error"
      });
    } finally {
      setExtracting(false);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          gpa: '',
          description: '',
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { name: '', level: 'Intermediate' }
      ]
    }));
  };

  const updateSkill = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    setResumeData(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { name: '', level: 'Intermediate' }
      ]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (index) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handlePreview = async () => {
    try {
      const response = await previewResume({
        data: resumeData,
        template: selectedTemplate
      });
      setPreviewDialog({ open: true, html: response.data.html });
    } catch (error) {
      console.error('Error generating preview:', error);
      setSnackbar({
        open: true,
        message: "Failed to generate preview. Please try again.",
        severity: "error"
      });
    }
  };

  const handleDownload = async (format = 'pdf') => {
    setGenerating(true);
    try {
      const response = await generateResume({
        data: resumeData,
        template: selectedTemplate,
        format: format
      });

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/html' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: `Resume downloaded successfully as ${format.toUpperCase()}!`,
        severity: "success"
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      setSnackbar({
        open: true,
        message: "Failed to generate resume. Please try again.",
        severity: "error"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveResume({
        data: resumeData,
        template: selectedTemplate
      });
      setSnackbar({
        open: true,
        message: "Resume saved successfully!",
        severity: "success"
      });
      loadSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      setSnackbar({
        open: true,
        message: "Failed to save resume. Please try again.",
        severity: "error"
      });
    }
  };

  const PersonalInfoStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={resumeData.personalInfo.fullName}
          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={resumeData.personalInfo.email}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone"
          value={resumeData.personalInfo.phone}
          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Address"
          value={resumeData.personalInfo.address}
          onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="LinkedIn"
          value={resumeData.personalInfo.linkedin}
          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website"
          value={resumeData.personalInfo.website}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Professional Summary"
          value={resumeData.personalInfo.summary}
          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
          placeholder="Write a brief summary of your professional background and career objectives..."
        />
      </Grid>
    </Grid>
  );

  const ExperienceStep = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Work Experience</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addExperience}
        >
          Add Experience
        </Button>
      </Box>
      
      {resumeData.experience.map((exp, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Experience #{index + 1}</Typography>
              <IconButton onClick={() => removeExperience(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Job Description"
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const EducationStep = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Education</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addEducation}
        >
          Add Education
        </Button>
      </Box>
      
      {resumeData.education.map((edu, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Education #{index + 1}</Typography>
              <IconButton onClick={() => removeEducation(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  value={edu.location}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Graduation Date"
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="GPA (Optional)"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const SkillsStep = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Skills</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addSkill}
            >
              Add Skill
            </Button>
          </Box>
          
          {resumeData.skills.map((skill, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Skill"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={skill.level}
                        onChange={(e) => updateSkill(index, 'level', e.target.value)}
                        label="Level"
                      >
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                        <MenuItem value="Expert">Expert</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeSkill(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Languages</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addLanguage}
            >
              Add Language
            </Button>
          </Box>
          
          {resumeData.languages.map((language, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Language"
                      value={language.name}
                      onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={language.level}
                        onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                        label="Level"
                      >
                        <MenuItem value="Basic">Basic</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                        <MenuItem value="Native">Native</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeLanguage(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const PreviewStep = () => (
    <Box>
      <Typography variant="h6" mb={3}>Choose Template</Typography>
      <Grid container spacing={3} mb={4}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedTemplate === template.id ? 2 : 1,
                borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider'
              }}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" gap={2} mb={4}>
        <Button
          variant="outlined"
          startIcon={<Visibility />}
          onClick={handlePreview}
        >
          Preview Resume
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save Resume
        </Button>
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={() => handleDownload('pdf')}
          disabled={generating}
        >
          {generating ? <CircularProgress size={20} /> : 'Download PDF'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={() => handleDownload('html')}
        >
          Download HTML
        </Button>
      </Box>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <ExperienceStep />;
      case 2:
        return <EducationStep />;
      case 3:
        return <SkillsStep />;
      case 4:
        return <Box><Typography>Additional sections coming soon...</Typography></Box>;
      case 5:
        return <PreviewStep />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 2, md: 4 }, // Adjust padding for mobile
        px: { xs: 2, md: 4 }, // Adjust padding for mobile
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, md: 4 },
            fontSize: { xs: "1.5rem", md: "2rem" }, // Adjust font size for mobile
          }}
        >
          Resume Builder
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack sections on mobile
            gap: { xs: 2, md: 4 },
          }}
        >
          {/* Resume Sections */}
          <Box sx={{ flex: 1 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 4 }}>
              <Tab label="Build Resume" />
              <Tab label="Upload & Extract" />
              <Tab label="Saved Resumes" />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Card>
                  <CardContent sx={{ p: 4 }}>
                    {renderStepContent(activeStep)}
                    
                    <Box display="flex" justifyContent="space-between" mt={4}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(prev => prev - 1)}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(prev => prev + 1)}
                        disabled={activeStep === steps.length - 1}
                      >
                        Next
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {tabValue === 1 && (
              <Card>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" mb={3}>
                    Upload Your Existing Resume
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Upload a PDF or Word document and we'll extract the information for you
                  </Typography>
                  
                  <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="cv-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="cv-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                      size="large"
                      disabled={extracting}
                    >
                      {extracting ? <CircularProgress size={20} /> : 'Upload Resume'}
                    </Button>
                  </label>

                  {extracting && (
                    <Box mt={3}>
                      <LinearProgress />
                      <Typography variant="body2" mt={1}>
                        Extracting data from your resume...
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" mb={3}>
                  Your Saved Resumes
                </Typography>
                <Grid container spacing={3}>
                  {Array.isArray(savedResumes) && savedResumes.map((resume) => (
                    <Grid item xs={12} md={6} key={resume.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{resume.title || 'Untitled Resume'}</Typography>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            Template: {resume.template}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created: {new Date(resume.createdAt).toLocaleDateString()}
                          </Typography>
                          <Box display="flex" gap={1} mt={2}>
                            <Button size="small" variant="outlined">
                              Edit
                            </Button>
                            <Button size="small" variant="contained">
                              Download
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          {/* Preview */}
          <Box sx={{ flex: 2 }}>
            <Card
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3],
              }}
            >
              {/* ...existing preview content... */}
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onClose={() => setPreviewDialog({ open: false, html: "" })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Resume Preview</DialogTitle>
        <DialogContent>
          <Box 
            dangerouslySetInnerHTML={{ __html: previewDialog.html }}
            sx={{ 
              border: 1, 
              borderColor: 'divider', 
              p: 2, 
              maxHeight: '70vh', 
              overflow: 'auto' 
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, html: "" })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

