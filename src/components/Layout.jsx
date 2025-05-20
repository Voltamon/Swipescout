import React from "react";
import { Box, useMediaQuery, useTheme, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import Footer from "./Footer";
import { blue } from "@mui/material/colors";
import { useAuth } from '../hooks/useAuth';


const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  
}));

const LayoutContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  width: '100%',backgroundColor: "#efeeff",
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
  width: '100%',
  flexBasis: open && !isMobile ? 'calc(100% - 200px)' : !isMobile ? 'calc(100% - 72px)' : '100%' , 
  transition: 'flex-basis 0.3s ease-in-out',
  
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const routesWithoutSidebar = ["/login","/login-form", "/signup", "/video-feed" ,"/Employer-explore-sidebar"];
  const shouldShowSidebarBase = !routesWithoutSidebar.includes(location.pathname);
  const [sidebarOpen, setSidebarOpen] = React.useState(
    !isMobile && shouldShowSidebarBase
  );

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const { user, logout } = useAuth();

  console.log("user from layout", user);
  
const roleGradients = {
  employer: 'linear-gradient(135deg,rgb(121, 144, 235) 0%,rgb(239, 242, 255) 100%)',
  'job-seeker': 'linear-gradient(135deg, #6bdd4f 0%, #3ab756 100%)',
  admin: 'linear-gradient(135deg, #dd4f6b 0%, #b73a56 100%)',
  default: 'linear-gradient(135deg, #6b4fdd 0%, #563ab7 100%)'
};

  React.useEffect(
    () => {
      setSidebarOpen(!isMobile && shouldShowSidebarBase);
    },
    [isMobile, location.pathname, shouldShowSidebarBase]
  );

  return (
    <LayoutRoot>
      <CssBaseline />
      {!isMobile && shouldShowSidebarBase  && <HeaderWrapper open={sidebarOpen} isMobile={isMobile} 
      >
  <Header onSidebarToggle={handleSidebarToggle} isSidebarVisible={shouldShowSidebarBase} />
</HeaderWrapper>}
      <LayoutContent
      >
        {shouldShowSidebarBase && (
          <SidebarContainer open={sidebarOpen} isMobile={isMobile} >
            <Sidebar
              open={sidebarOpen}
              onClose={handleSidebarClose}
              variant={isMobile ? 'temporary' : 'persistent'}
              isMobile={isMobile}
            
              
            />
          </SidebarContainer>
        )}
        <MainContent open={sidebarOpen} isMobile={isMobile}
         sx={{
          
          borderRadius: '8px 0 0 0',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}
        >
          <Outlet />
        </MainContent>
       
      </LayoutContent> 
      {!isMobile && shouldShowSidebarBase  &&<FooterWrapper open={sidebarOpen} isMobile={isMobile} >
       <Footer ></Footer></FooterWrapper>}
      {isMobile && <MobileNavigation />}
    </LayoutRoot>
  );
};

export default Layout;