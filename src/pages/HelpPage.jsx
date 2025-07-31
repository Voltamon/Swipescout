import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Chip,
    Tab,
    Tabs,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    ExpandMore as ExpandMoreIcon,
    Search as SearchIcon,
    Help as HelpIcon,
    VideoLibrary as VideoLibraryIcon,
    Article as ArticleIcon,
    Support as SupportIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Chat as ChatIcon,
    PlayCircleOutline as PlayCircleOutlineIcon,
    GetApp as GetAppIcon,
    Security as SecurityIcon,
    Work as WorkIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Payment as PaymentIcon,
    Settings as SettingsIcon,
    BugReport as BugReportIcon,
    Feedback as FeedbackIcon,
    School as SchoolIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const HelpContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 56px)',
}));

const HelpHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, rgb(189, 227, 241) 0%, rgb(4, 41, 75) 100%)`,
  color: "rgb(255, 255, 255)",
  textAlign: "center"
}));

const CategoryCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const HelpPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [contactDialog, setContactDialog] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
    });

    const faqCategories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: <HelpIcon />,
            faqs: [
                {
                    question: 'How do I create an account on SwipeScout?',
                    answer: 'To create an account, click the "Sign Up" button on the homepage. You can register as either a job seeker or employer. Fill in your basic information, verify your email, and complete your profile setup.'
                },
                {
                    question: 'What is the difference between job seeker and employer accounts?',
                    answer: 'Job seeker accounts allow you to search for jobs, upload video resumes, apply to positions, and connect with employers. Employer accounts let you post jobs, search for candidates, view video resumes, and manage applications.'
                },
                {
                    question: 'How do I complete my profile?',
                    answer: 'After registration, follow the step-by-step profile completion guide. Add your personal information, work experience, skills, education, and upload a professional photo. For job seekers, uploading a video resume is highly recommended.'
                }
            ]
        },
        {
            id: 'video-resumes',
            title: 'Video Resumes',
            icon: <VideoLibraryIcon />,
            faqs: [
                {
                    question: 'How do I upload a video resume?',
                    answer: 'Go to your profile page and click "Upload Video Resume". Record or upload a video (max 2 minutes, MP4 format). You can trim, edit, and add captions before publishing. Ensure your profile is at least 60% complete before uploading.'
                },
                {
                    question: 'What makes a good video resume?',
                    answer: 'A good video resume should be 60-90 seconds long, well-lit, with clear audio. Introduce yourself, highlight key skills and experiences, and show your personality. Dress professionally and maintain eye contact with the camera.'
                },
                {
                    question: 'Can I edit my video after uploading?',
                    answer: 'Yes, you can edit your video title, description, and tags. For major changes to the video content, you\'ll need to upload a new version. You can also trim the video length using our built-in editor.'
                }
            ]
        },
        {
            id: 'job-search',
            title: 'Job Search & Applications',
            icon: <WorkIcon />,
            faqs: [
                {
                    question: 'How do I search for jobs?',
                    answer: 'Use the job search page to filter jobs by location, industry, experience level, salary range, and job type. You can also browse video job postings and use our TikTok-style feed to discover opportunities.'
                },
                {
                    question: 'How do I apply for a job?',
                    answer: 'Click "Apply" on any job posting. Your profile and video resume will be automatically submitted. You can also add a personalized cover letter. Track your applications in the "My Applications" section.'
                },
                {
                    question: 'How can I save jobs for later?',
                    answer: 'Click the bookmark icon on any job posting to save it. Access your saved jobs from your dashboard or the "Saved Jobs" section in your profile menu.'
                }
            ]
        },
        {
            id: 'employers',
            title: 'For Employers',
            icon: <BusinessIcon />,
            faqs: [
                {
                    question: 'How do I post a job?',
                    answer: 'From your employer dashboard, click "Post New Job". Fill in the job details, requirements, and compensation. You can also upload a company video to make your posting more engaging.'
                },
                {
                    question: 'How do I search for candidates?',
                    answer: 'Use the candidate search page to filter by skills, experience, location, and other criteria. Browse video resumes to get a better sense of candidates\' personalities and communication skills.'
                },
                {
                    question: 'How do I manage applications?',
                    answer: 'Access all applications from your employer dashboard. You can filter by job posting, review candidate profiles and videos, schedule interviews, and update application statuses.'
                }
            ]
        },
        {
            id: 'premium',
            title: 'Premium Features',
            icon: <TrendingUpIcon />,
            faqs: [
                {
                    question: 'What are the premium features?',
                    answer: 'Premium features include advanced analytics, priority support, enhanced profile visibility, unlimited video uploads, AI-powered job matching, career coaching sessions, and access to exclusive job opportunities.'
                },
                {
                    question: 'How do I upgrade to premium?',
                    answer: 'Go to Settings > Premium or click the "Upgrade" button in your dashboard. Choose from monthly or annual plans. We accept all major credit cards and PayPal through our secure Stripe payment system.'
                },
                {
                    question: 'Can I cancel my premium subscription?',
                    answer: 'Yes, you can cancel anytime from your account settings. Your premium features will remain active until the end of your current billing period. No cancellation fees apply.'
                }
            ]
        },
        {
            id: 'technical',
            title: 'Technical Support',
            icon: <SettingsIcon />,
            faqs: [
                {
                    question: 'Why can\'t I upload my video?',
                    answer: 'Ensure your video is in MP4 format, under 100MB, and less than 2 minutes long. Check your internet connection and try again. If the problem persists, contact our technical support team.'
                },
                {
                    question: 'How do I reset my password?',
                    answer: 'Click "Forgot Password" on the login page. Enter your email address and follow the instructions in the reset email. If you don\'t receive the email, check your spam folder.'
                },
                {
                    question: 'Why am I not receiving notifications?',
                    answer: 'Check your notification settings in your profile. Ensure you\'ve allowed browser notifications and that our emails aren\'t going to spam. You can also enable SMS notifications for important updates.'
                }
            ]
        }
    ];

    const tutorials = [
        {
            title: 'Getting Started with SwipeScout',
            description: 'Complete guide to setting up your account and profile',
            duration: '5 min',
            type: 'video',
            thumbnail: '/tutorials/getting-started.jpg'
        },
        {
            title: 'Creating the Perfect Video Resume',
            description: 'Tips and best practices for recording your video resume',
            duration: '8 min',
            type: 'video',
            thumbnail: '/tutorials/video-resume.jpg'
        },
        {
            title: 'Advanced Job Search Techniques',
            description: 'How to use filters and find the best job matches',
            duration: '6 min',
            type: 'video',
            thumbnail: '/tutorials/job-search.jpg'
        },
        {
            title: 'Employer Guide: Finding Top Talent',
            description: 'Best practices for employers to attract candidates',
            duration: '10 min',
            type: 'video',
            thumbnail: '/tutorials/employer-guide.jpg'
        }
    ];

    const supportOptions = [
        {
            title: 'Live Chat',
            description: 'Get instant help from our support team',
            icon: <ChatIcon />,
            action: 'Start Chat',
            available: '24/7'
        },
        {
            title: 'Email Support',
            description: 'Send us a detailed message',
            icon: <EmailIcon />,
            action: 'Send Email',
            available: 'Response within 24h'
        },
        {
            title: 'Phone Support',
            description: 'Speak directly with our team',
            icon: <PhoneIcon />,
            action: 'Call Now',
            available: 'Mon-Fri 9AM-6PM'
        },
        {
            title: 'Community Forum',
            description: 'Connect with other users',
            icon: <SupportIcon />,
            action: 'Visit Forum',
            available: 'Always open'
        }
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleContactFormChange = (field, value) => {
        setContactForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitContact = () => {
        // Handle contact form submission
        console.log('Contact form submitted:', contactForm);
        setContactDialog(false);
        setContactForm({
            name: '',
            email: '',
            subject: '',
            message: '',
            category: 'general'
        });
    };

    const filteredFAQs = faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    return (
        <HelpContainer maxWidth="lg">
            {/* Header */}
            <HelpHeader elevation={3}>
                <Typography variant="h3" gutterBottom>
                    Help Center
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                    Find answers, get support, and learn how to make the most of SwipeScout
                </Typography>
                
                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Search for help articles, tutorials, or FAQs..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: { 
                            backgroundColor: 'background.paper',
                            maxWidth: 600,
                            mx: 'auto'
                        }
                    }}
                    sx={{ maxWidth: 600, mx: 'auto' }}
                />
            </HelpHeader>

            {/* Navigation Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="FAQs" />
                    <Tab label="Video Tutorials" />
                    <Tab label="Contact Support" />
                    <Tab label="Downloads" />
                </Tabs>
            </Paper>

            {/* FAQ Tab */}
            {activeTab === 0 && (
                <Box>
                    {searchQuery ? (
                        // Search Results
                        <Box>
                            <Typography variant="h5" gutterBottom>
                                Search Results for "{searchQuery}"
                            </Typography>
                            {filteredFAQs.map((category) => (
                                <Box key={category.id} sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        {category.icon}
                                        <Box sx={{ ml: 1 }}>{category.title}</Box>
                                    </Typography>
                                    {category.faqs.map((faq, index) => (
                                        <Accordion key={index}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1">{faq.question}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2" color="text.secondary">
                                                    {faq.answer}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        // Category View
                        <Grid container spacing={3}>
                            {faqCategories.map((category) => (
                                <Grid item xs={12} md={6} key={category.id}>
                                    <CategoryCard>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                    {category.icon}
                                                </Avatar>
                                                <Typography variant="h6">{category.title}</Typography>
                                            </Box>
                                            
                                            {category.faqs.slice(0, 3).map((faq, index) => (
                                                <Accordion key={index}>
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                        <Typography variant="subtitle2">{faq.question}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {faq.answer}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </CardContent>
                                        {category.faqs.length > 3 && (
                                            <CardActions>
                                                <Button size="small">
                                                    View All {category.faqs.length} Questions
                                                </Button>
                                            </CardActions>
                                        )}
                                    </CategoryCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}

            {/* Video Tutorials Tab */}
            {activeTab === 1 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Video Tutorials
                    </Typography>
                    <Grid container spacing={3}>
                        {tutorials.map((tutorial, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card>
                                    <Box
                                        sx={{
                                            height: 200,
                                            backgroundImage: `url(${tutorial.thumbnail})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative'
                                        }}
                                    >
                                        <IconButton
                                            sx={{
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                                color: 'white',
                                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                                            }}
                                        >
                                            <PlayCircleOutlineIcon sx={{ fontSize: 48 }} />
                                        </IconButton>
                                        <Chip
                                            label={tutorial.duration}
                                            size="small"
                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {tutorial.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {tutorial.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" startIcon={<PlayCircleOutlineIcon />}>
                                            Watch Tutorial
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Contact Support Tab */}
            {activeTab === 2 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Contact Support
                    </Typography>
                    <Grid container spacing={3}>
                        {supportOptions.map((option, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                                                {option.icon}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6">{option.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.available}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {option.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                if (option.title === 'Email Support') {
                                                    setContactDialog(true);
                                                }
                                            }}
                                        >
                                            {option.action}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Downloads Tab */}
            {activeTab === 3 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Downloads & Resources
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Mobile App
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Download the SwipeScout mobile app for iOS and Android
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="outlined" startIcon={<GetAppIcon />}>
                                            iOS App
                                        </Button>
                                        <Button variant="outlined" startIcon={<GetAppIcon />}>
                                            Android App
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Resume Templates
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Professional resume templates to complement your video resume
                                    </Typography>
                                    <Button variant="outlined" startIcon={<GetAppIcon />}>
                                        Download Templates
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Contact Dialog */}
            <Dialog
                open={contactDialog}
                onClose={() => setContactDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Contact Support</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={contactForm.name}
                                onChange={(e) => handleContactFormChange('name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => handleContactFormChange('email', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={contactForm.category}
                                    onChange={(e) => handleContactFormChange('category', e.target.value)}
                                    label="Category"
                                >
                                    <MenuItem value="general">General Question</MenuItem>
                                    <MenuItem value="technical">Technical Issue</MenuItem>
                                    <MenuItem value="billing">Billing</MenuItem>
                                    <MenuItem value="feature">Feature Request</MenuItem>
                                    <MenuItem value="bug">Bug Report</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject"
                                value={contactForm.subject}
                                onChange={(e) => handleContactFormChange('subject', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                multiline
                                rows={6}
                                value={contactForm.message}
                                onChange={(e) => handleContactFormChange('message', e.target.value)}
                                placeholder="Please describe your question or issue in detail..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContactDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmitContact} variant="contained">
                        Send Message
                    </Button>
                </DialogActions>
            </Dialog>
        </HelpContainer>
    );
};

export default HelpPage;

