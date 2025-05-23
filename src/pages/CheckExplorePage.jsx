import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Tabs, 
  Tab, 
  Box, 
  IconButton,
  styled,
  useTheme  
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Link, useLocation } from 'react-router-dom';
import { useNavigate   } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
       background: 'rgba(182, 202, 233, 0.34)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTabs = styled(Tabs)({
  color: "#ffff",
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: '2px 2px 0 0',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({

  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(16),
  marginRight: theme.spacing(4),
  color: "rgb(151, 200, 233)",
  opacity: 0.7,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
  '&.Mui-selected': {
    color: "rgb(78, 77, 77)",
    opacity: 1,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const CheckExplorePage = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate=useNavigate();
  
  // Define all possible tab routes
  const tabRoutes = [
    { path: '/explore-layout/Employer-explore-public', label: 'Employer ' },
    { path: '/explore-layout/Job-seeker-explore-public', label: 'Job Seeker ' },
  ];

  // Find the current tab value
  const currentTab = tabRoutes.find(route => 
    location.pathname.startsWith(route.path)
  )?.path || false;

  return (
    <StyledAppBar position="static" sx={{m:0,p:0}}>

      <Toolbar>      <IconButton
                  sx={{
                    display: 'inline',
                  mb:2,
                    color: '#999',
                    width: '24px',
                    height: '24px',
                  }}
                  onClick={()=>navigate('/')}
                >
                  <ArrowBackIcon  fontSize="large" />
                </IconButton>
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          backgroundColor :"#dfdsa",
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <StyledTabs
            value={currentTab}
            textColor="inherit"
            indicatorColor="secondary"
            aria-label="Navigation tabs"
          >
            {tabRoutes.map((route) => (
              <StyledTab
                key={route.path}
                label={route.label}
                value={route.path}
                component={Link}
                to={route.path}
              />
            ))}
          </StyledTabs>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default CheckExplorePage;