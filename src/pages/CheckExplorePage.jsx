import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Tabs, 
  Tab, 
  Box, 
  useTheme,
  Paper,
  alpha
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: 'none',
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const AnimatedTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 4,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2),
  },
}));

const GlowTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(16),
  color: alpha(theme.palette.common.white, 0.8),
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  '&.Mui-selected': {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 2,
    backgroundColor: theme.palette.secondary.main,
    transition: 'width 0.3s ease',
  },
  '&.Mui-selected::after': {
    width: 'calc(100% - 24px)',
  },
}));

const CheckExplorePage = () => {
  const theme = useTheme();
  const location = useLocation();
  
  const tabRoutes = [
    { 
      path: '/explore-layout/employer-explore-public', 
      label: 'For Employers',
      icon: '💼' 
    },
    { 
      path: '/explore-layout/job-seeker-explore-public', 
      label: 'For Job Seekers',
      icon: '👔'
    },
  ];

  const currentTab = tabRoutes.find(route => 
    location.pathname.startsWith(route.path)
  )?.path || false;

  return (
    <Paper elevation={0} sx={{ mb: 3 }}>
      <GradientAppBar position="static">
        <Toolbar disableGutters sx={{ px: 2 }}>
          <AnimatedTabs
            value={currentTab}
            variant="fullWidth"
            sx={{ flex: 1 }}
            TabIndicatorProps={{
              children: <span className="MuiTabs-indicatorSpan" />,
            }}
          >
            {tabRoutes.map((route) => (
              <GlowTab
                key={route.path}
                icon={<span style={{ marginRight: 8 }}>{route.icon}</span>}
                iconPosition="start"
                label={route.label}
                value={route.path}
                component={Link}
                to={route.path}
                sx={{
                  minHeight: 64,
                  '&.Mui-selected': {
                    background: alpha(theme.palette.common.white, 0.05),
                  }
                }}
              />
            ))}
          </AnimatedTabs>
        </Toolbar>
      </GradientAppBar>
    </Paper>
  );
};

export default CheckExplorePage;