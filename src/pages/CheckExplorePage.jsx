import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Tabs, 
  Tab, 
  Box, 
  styled,
  useTheme 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: `linear-gradient(135deg, rgba(178, 209, 224, 1) 30%, rgba(69, 117, 221, 1) 90%)`,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTabs = styled(Tabs)({
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
  color: theme.palette.common.white,
  opacity: 0.7,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
  '&.Mui-selected': {
    color: theme.palette.common.white,
    opacity: 1,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const CheckExplorePage = () => {
  const theme = useTheme();
  const location = useLocation();
  
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
      <Toolbar>
        <Box sx={{ 
          width: '100%',
          display: 'flex',
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