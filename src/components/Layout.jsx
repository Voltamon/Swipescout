import React,{ useContext } from "react";
import { Box, useMediaQuery, useTheme, CssBaseline, IconButton  } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Headers/Header";
import Sidebar from "./Sidebar";
import SidebarJobseeker from "./SidebarJobseeker";
import SidebarAdmin from "./SidebarAdmin";
import MobileNavigation from "./MobileNavigation";
import Footer from "./Headers/Footer";
import { blue } from "@mui/material/colors";
import { useAuth } from '../hooks/useAuth';
// import Header from "./Header";
// import Footer from "./Footer";

const LayoutRoot = styled(Box)(({ theme, isMobile }) => ({
  display: "flex",
  flexDirection: "column",
  height: isMobile ? "100%" : "100vh",
  maxHeight: isMobile ? "100%" : "100vh",
  overflow:  "auto" //isMobile ?"hidden": Prevent double scrollbars
}));

const LayoutContent = styled(Box)(({ theme, isMobile }) => ({
  display: "flex",
  flex: "1 1 auto",
  width: "100%",
  backgroundColor: "#efeeff",
  paddingBottom: isMobile ? "56px" : 0 // Space for fixed nav
}));

const HeaderWrapper = styled(Box)(({ open, isMobile }) => ({
  height: 11,
  position: "relative",
  top: 0,
  right: 0,
  marginBottom: 28,
  left: open && !isMobile ? 200 : !isMobile ? 72 : 0,
  width: open && !isMobile ? "calc(100% - 200px)" : !isMobile ? "calc(100% - 72px)" : "100%",
}));


const FooterWrapper = styled(Box)(({ open, isMobile }) => ({
  height: 44,
  position: "relative",
  top: 0,
  right: 0,
  left: open && !isMobile ? 200 : !isMobile ? 72 : 0,
  marginBottom: 30 ,
  width: open && !isMobile ? "calc(100% - 200px)" : !isMobile ? "calc(100% - 72px)" : "100%",
}));

const SidebarContainer = styled(Box)(({ open, isMobile }) => ({
  width: open ? (isMobile ? 0 : 200) : (isMobile ? 0 : 72),
  flexShrink: 0,
  overflowX: 'hidden',
  transition: 'width 0.3s ease-in-out',
}));

const MainContent = styled(Box)(({ open, isMobile }) => ({
  flexGrow: 1,
  width: "100%",
  height: "100%",
  flexDirection: "column",
  flexBasis:
    open && !isMobile
      ? "calc(100% - 200px)"
      : !isMobile ? "calc(100% - 72px)" : "100%",
  transition: "flex-basis 0.3s ease-in-out"
}));

const Layout = ({role}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  // Define patterns for routes that should NOT show the sidebar/header
  const routesWithoutSidebarPatterns = [
    /^\/login(\/.*)?$/,           // /login or /login-form (if login-form is considered a subpath of login)
    /^\/signup(\/.*)?$/,
    /^\/video-feed(\/.*)?$/,
    /^\/video-player(\/.*)?$/,
    // /^\/Employer-explore-sidebar(\/.*)?$/,
    // /^\/jobseeker-explore-sidebar(\/.*)?$/,
    /^\/jobseeker-video-feed(\/.*)?$/, // This will match /jobseeker-video-feed, /jobseeker-video-feed/1, /jobseeker-video-feed/abc etc.
  ];

  // Function to check if the current path matches any of the patterns
  const checkShouldHideSidebar = (pathname) => {
    return routesWithoutSidebarPatterns.some(pattern => pattern.test(pathname));
  };

  const shouldHideSidebar = checkShouldHideSidebar(location.pathname);


  const [sidebarOpen, setSidebarOpen] = React.useState(
    !isMobile && !shouldHideSidebar // Use !shouldHideSidebar here
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
  zIndex: theme.zIndex.drawer + 1,
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

  const { user, logout   } = useAuth();
// roleVar=role;
   let roleVar= role; // JSON.parse(localStorage.getItem("role"));
  if(user && user.role) roleVar=user.role;

const roleGradients = {
  employer: 'linear-gradient(135deg,rgb(121, 144, 235) 0%,rgb(239, 242, 255) 100%)',
  'job-seeker': 'linear-gradient(135deg, #6bdd4f 0%, #3ab756 100%)',
  admin: 'linear-gradient(135deg, #dd4f6b 0%, #b73a56 100%)',
  default: 'linear-gradient(135deg, #6b4fdd 0%, #563ab7 100%)'
};

  React.useEffect(
    () => {
      // Update sidebarOpen based on mobile status and whether sidebar should be hidden
      setSidebarOpen(!isMobile && !shouldHideSidebar);
    },
    [isMobile, location.pathname, shouldHideSidebar] // Include shouldHideSidebar in dependencies
  );

  return <LayoutRoot isMobile={isMobile}>
      <CssBaseline />
      {/* Conditionally render MobileMenuButton based on shouldHideSidebar */}
    {isMobile && !shouldHideSidebar && <MobileMenuButton edge="start" color="inherit" onClick={handleSidebarToggle} sx={{ mt: -2,ml:-2 }}>
          <MenuIcon />
        </MobileMenuButton>}
      {/* Conditionally render Header based on shouldHideSidebar */}
      {!isMobile && !shouldHideSidebar && <HeaderWrapper open={sidebarOpen} isMobile={isMobile}>
          <Header onSidebarToggle={handleSidebarToggle} isSidebarVisible={!shouldHideSidebar} />
        </HeaderWrapper>}
      <LayoutContent>
        {/* Conditionally render SidebarContainer based on shouldHideSidebar */}
        {!shouldHideSidebar && <SidebarContainer open={sidebarOpen} isMobile={isMobile}>
            {roleVar === "employer" ? <Sidebar open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "persistent"} isMobile={isMobile} /> : roleVar === "job_seeker" ? <SidebarJobseeker open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "persistent"} isMobile={isMobile} /> : roleVar === "admin" ? <SidebarAdmin open={sidebarOpen} onClose={handleSidebarClose} variant={isMobile ? "temporary" : "persistent"} isMobile={isMobile} /> : null}
          </SidebarContainer>}
        <MainContent open={sidebarOpen} isMobile={isMobile} sx={{ background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%)`, borderRadius: "8px 0 0 0", mt: isMobile ? 0 : 2, boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}>
          <Outlet />
        </MainContent>
      </LayoutContent>
      {/* Conditionally render Footer based on shouldHideSidebar */}
      {!isMobile && !shouldHideSidebar && <FooterWrapper open={sidebarOpen} isMobile={isMobile}>
          <Footer />
        </FooterWrapper>}
      {/* MobileNavigation is typically part of the main content or explicitly handled */}
      {isMobile && !shouldHideSidebar && <MobileNavigation sx={{ mt: "-10px" }} />} {/* Assuming MobileNavigation is only shown when sidebar is enabled on mobile */}
    </LayoutRoot>;
};

export default Layout;