import React, { useContext } from "react";
import { Box, useMediaQuery, useTheme, CssBaseline, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarJobseeker from "./SidebarJobseeker";
import SidebarAdmin from "./SidebarAdmin";
import MobileNavigation from "./MobileNavigation";
import Footer from "./Headers/admin/FooterAdmin";
import Header from "./Headers/admin/HeaderAdmin";
import { useAuth } from '../hooks/useAuth';

// Define sidebar widths for consistent calculations
const expandedSidebarWidth = 250;
const collapsedSidebarWidth = 72;
const headerHeight = 26; // Standard AppBar height

// Styled components for layout structure
const LayoutRoot = styled(Box)(({ theme, isMobile }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh", // Full viewport height
  maxHeight: "100vh",
  overflow: "auto", // Changed from "hidden" to "auto" to allow scrolling for the entire layout
  backgroundColor: theme.palette.background.default, // Use theme background
}));

const LayoutContent = styled(Box)(({ theme, isMobile }) => ({
  display: "flex",
  flex: "1 1 auto",
  width: "100%",
  backgroundColor: theme.palette.background.default, // Use theme background
  paddingBottom: isMobile ? "56px" : 0, // Space for fixed nav on mobile
}));

const HeaderWrapper = styled(Box)(({ open, isMobile, theme }) => ({
  position: "sticky", // Keep it sticky
  top: 0,
  zIndex: theme.zIndex.appBar + 1, // Ensure header is above content
  // Dynamically adjust width and left based on sidebar state
  width: open && !isMobile ? `calc(100% - ${expandedSidebarWidth}px)` : !isMobile ? `calc(100% - ${collapsedSidebarWidth}px)` : "100%",
  left: open && !isMobile ? expandedSidebarWidth : !isMobile ? collapsedSidebarWidth : 0,
  transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out', // Smooth transition
  padding: isMobile ? theme.spacing(1) : theme.spacing(2), // Responsive padding
}));

const FooterWrapper = styled(Box)(({ open, isMobile, theme }) => ({
  position: "relative", // Changed to relative for better flow
  // Dynamically adjust width and left based on sidebar state
  width: open && !isMobile ? `calc(100% - ${expandedSidebarWidth}px)` : !isMobile ? `calc(100% - ${collapsedSidebarWidth}px)` : "100%",
  left: open && !isMobile ? expandedSidebarWidth : !isMobile ? collapsedSidebarWidth : 0,
  transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out', // Smooth transition
  padding: isMobile ? theme.spacing(1) : theme.spacing(2),
}));

const SidebarContainer = styled(Box)(({ open, isMobile, theme }) => ({
  width: open ? (isMobile ? 0 : expandedSidebarWidth) : (isMobile ? 0 : collapsedSidebarWidth),
  flexShrink: 0,
  overflowX: 'hidden',
  transition: 'width 0.3s ease-in-out',
  height: '100%',
  display: isMobile && !open ? 'none' : 'block',
}));

const MainContent = styled(Box)(({ open, isMobile, theme }) => ({
  flexGrow: 1,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  // Dynamic width based on sidebar state
  flexBasis: open && !isMobile ? `calc(100% - ${expandedSidebarWidth}px)` : !isMobile ? `calc(100% - ${collapsedSidebarWidth}px)` : "100%",
  transition: "flex-basis 0.3s ease-in-out",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  background: theme.palette.background.paper,
  margin: isMobile ? 0 : theme.spacing(2),
  overflowY: 'auto', // Allow vertical scrolling for main content
  overflowX: 'hidden', // Prevent horizontal scrolling
  // Add padding-top to account for the sticky header's height
  paddingTop: !isMobile && !open ? headerHeight : 0,
}));

const Layout = ({ role }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { user } = useAuth();

  const routesWithoutSidebarPatterns = [
    /^\/login(\/.*)?$/,
    /^\/signup(\/.*)?$/,
    /^\/video-feed(\/.*)?$/,
    /^\/video-player(\/.*)?$/,
    /^\/jobseeker-video-feed(\/.*)?$/,
  ];

  const checkShouldHideSidebar = (pathname) => {
    return routesWithoutSidebarPatterns.some(pattern => pattern.test(pathname));
  };

  const shouldHideSidebar = checkShouldHideSidebar(location.pathname);

  const [sidebarOpen, setSidebarOpen] = React.useState(
    !isMobile && !shouldHideSidebar
  );

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const MobileMenuButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 2,
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[2],
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }));

  let roleVar = role;
  if (user && user.role) roleVar = user.role;

  React.useEffect(
    () => {
      setSidebarOpen(!isMobile && !shouldHideSidebar);
    },
    [isMobile, location.pathname, shouldHideSidebar]
  );

  return (
    <LayoutRoot isMobile={isMobile}>
      <CssBaseline />
      {isMobile && !shouldHideSidebar && (
        <MobileMenuButton edge="start" color="inherit" onClick={handleSidebarToggle}>
          <MenuIcon />
        </MobileMenuButton>
      )}

      {!shouldHideSidebar && (
        <HeaderWrapper open={sidebarOpen} isMobile={isMobile}>
          <Header onSidebarToggle={handleSidebarToggle} isSidebarVisible={!shouldHideSidebar} />
        </HeaderWrapper>
      )}

      <LayoutContent>
        {!shouldHideSidebar && (
          <SidebarContainer open={sidebarOpen} isMobile={isMobile}>
            {roleVar === "employer" ? (
              <Sidebar open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "persistent"} isMobile={isMobile} />
            ) : roleVar === "job_seeker" ? (
              <SidebarJobseeker open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "persistent"} isMobile={isMobile} />
            ) : roleVar === "admin" ? (
              <SidebarAdmin open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "persistent"} isMobile={isMobile} />
            ) : null}
          </SidebarContainer>
        )}

        <MainContent open={sidebarOpen} isMobile={isMobile}>
          <Outlet />
        </MainContent>
      </LayoutContent>

      {!isMobile && !shouldHideSidebar && (
        <FooterWrapper open={sidebarOpen} isMobile={isMobile}>
          <Footer />
        </FooterWrapper>
      )}

      {isMobile && !shouldHideSidebar && <MobileNavigation />}
    </LayoutRoot>
  );
};

export default Layout;
