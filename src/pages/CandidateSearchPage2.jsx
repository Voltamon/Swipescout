import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  TextField, 
  Button, 
  Select, 
  FormControl, 
  InputLabel, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid, 
  Container, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  logo: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '& span': {
      color: theme.palette.secondary.main
    }
  },
  searchSection: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(5)
  },
  searchBar: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  searchInput: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2)
    }
  },
  searchButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr'
    }
  },
  candidateCard: {
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  videoThumbnail: {
    height: 160,
    backgroundColor: theme.palette.grey[300],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(5)
  },
  footer: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(5, 0)
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
    '& a': {
      margin: theme.spacing(0, 2)
    }
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    '& a': {
      margin: theme.spacing(0, 1.5)
    }
  }
}));

const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" className={classes.logo}>
            Swip<span>scout</span>
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit">Home</Button>
            <Button color="inherit">Jobs</Button>
            <Button color="inherit">Candidates</Button>
            <Button color="inherit">Profile</Button>
            <Button color="inherit">Logout</Button>
          </Box>
          
          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>JD</Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Help Center</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const SearchSection = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper className={classes.searchSection} elevation={1}>
      <Typography variant="h6" color="primary" gutterBottom>
        Find the Right Candidate
      </Typography>
      
      <Box className={classes.searchBar}>
        <TextField
          className={classes.searchInput}
          variant="outlined"
          placeholder="Search for candidates..."
          size={isMobile ? "small" : "medium"}
          InputProps={{
            style: isMobile ? { borderRadius: 4 } : { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
          }}
        />
        <Button
          className={classes.searchButton}
          variant="contained"
          color="primary"
          size={isMobile ? "medium" : "large"}
          startIcon={<SearchIcon />}
          sx={isMobile ? {} : { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {isMobile ? '' : 'Search'}
        </Button>
      </Box>
      
      <Box className={classes.filtersGrid}>
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor="skills">Skills</InputLabel>
          <TextField
            id="skills"
            label="Skills"
            placeholder="Select skills"
          />
        </FormControl>
        
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor="experience">Experience Level</InputLabel>
          <Select
            native
            id="experience"
            label="Experience Level"
          >
            <option value="">Any</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor="location">Location</InputLabel>
          <TextField
            id="location"
            label="Location"
            placeholder="Select location"
          />
        </FormControl>
        
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor="education">Education Level</InputLabel>
          <Select
            native
            id="education"
            label="Education Level"
          >
            <option value="">Any</option>
            <option value="high-school">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
          </Select>
        </FormControl>
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        color="secondary"
      >
        Apply Filters
      </Button>
    </Paper>
  );
};

const CandidateCard = ({ candidate }) => {
  const classes = useStyles();

  return (
    <Card className={classes.candidateCard} elevation={2}>
      <Box className={classes.videoThumbnail}>
        <Box className={classes.playIcon}>
          <PlayIcon />
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {candidate.name}
        </Typography>
        
        <List dense disablePadding>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CodeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={candidate.skills} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <WorkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={`${candidate.experience} years experience`} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LocationIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={candidate.location} />
          </ListItem>
        </List>
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Box className={classes.footerLinks}>
          <Link href="#" color="inherit">About Us</Link>
          <Link href="#" color="inherit">Contact Us</Link>
          <Link href="#" color="inherit">Privacy Policy</Link>
          <Link href="#" color="inherit">Terms and Conditions</Link>
        </Box>
        
        <Box className={classes.socialIcons}>
          <IconButton href="#"><Facebook /></IconButton>
          <IconButton href="#"><Twitter /></IconButton>
          <IconButton href="#"><LinkedIn /></IconButton>
          <IconButton href="#"><Instagram /></IconButton>
        </Box>
        
        <Typography variant="body2" color="textSecondary" align="center">
          © 2023 Swipscout. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

const CandidateSearchPage2 = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      skills: 'JavaScript, React, Node.js',
      experience: 5,
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'Michael Chen',
      skills: 'Python, Django, Machine Learning',
      experience: 7,
      location: 'Remote'
    },
    {
      id: 3,
      name: 'David Wilson',
      skills: 'Java, Spring Boot, AWS',
      experience: 4,
      location: 'New York, NY'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      skills: 'UI/UX Design, Figma, Adobe XD',
      experience: 3,
      location: 'Austin, TX'
    }
  ];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <SearchSection />
        
        <Box mb={5}>
          <Typography variant="h6" color="primary" gutterBottom>
            Candidate Listings
          </Typography>
          
          <Grid container spacing={3}>
            {candidates.map((candidate) => (
              <Grid item key={candidate.id} xs={12} sm={6} md={4} lg={3}>
                <CandidateCard candidate={candidate} />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Box className={classes.pagination}>
          <Pagination
            count={5}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      </Container>
      
      <Footer />
    </>
  );
};

export default CandidateSearchPage2;