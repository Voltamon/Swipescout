import React from 'react';
import { Box, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}));

const LayoutContent = styled(Box)(({ theme, open, isMobile }) => ({
  display: 'flex',
  flex: '1 1 auto',
  paddingTop: 56,
  [theme.breakpoints.up('sm')]: {
    paddingTop: 64,
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const MainArea = styled(Box)(({ theme, open, isMobile }) => ({
  flex: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open &&
  !isMobile && {
    marginLeft: 240,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = React.useState(false);//!isMobile

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (1===1) {//isMobile
      setSidebarOpen(false);
    }
  };

  React.useEffect(() => {
                          setSidebarOpen(false); //!isMobile
                        }, [isMobile]); // check ! isMobile

  return <LayoutRoot>
      <CssBaseline />
      <MainArea open={sidebarOpen} isMobile={isMobile}>
        <Header onSidebarToggle={handleSidebarToggle} />
        <LayoutContent open={sidebarOpen} isMobile={isMobile}>
          <Sidebar open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "temporary"} /> 
          <MainContent open={sidebarOpen} isMobile={isMobile}>
            <Outlet />
          </MainContent>
        </LayoutContent>
      </MainArea>
      {isMobile && <MobileNavigation />}
    </LayoutRoot>;
};

export default Layout;
