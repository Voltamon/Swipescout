import React from "react";
import { Box, useMediaQuery, useTheme, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}));

const LayoutContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  width: '100%',
}));

const HeaderWrapper = styled(Box)(({ open, isMobile }) =>({
  height: 44,
  position: 'relative',  
  top: 0,
  right: 0,
marginBottom: 8,
  left : open && !isMobile ? 200 :72 ,
  width: open && !isMobile ? 'calc(100% - 240px)' : '100%',
}));

const SidebarContainer = styled(Box)(({ open, isMobile }) => ({
  width: open ? (isMobile ? 'auto' : 200) : 72,
  flexShrink: 0,
  overflowX: 'hidden',
  transition: 'width 0.3s ease-in-out',
}));

const MainContent = styled(Box)(({ open, isMobile }) => ({
  flexGrow: 1,
  width: '100%',
  flexBasis: open && !isMobile ? 'calc(100% - 240px)' : '100%',
  transition: 'flex-basis 0.3s ease-in-out',
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const routesWithoutSidebar = ["/login", "/signup", "/dashboard--"];
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

  React.useEffect(
    () => {
      setSidebarOpen(!isMobile && shouldShowSidebarBase);
    },
    [isMobile, location.pathname, shouldShowSidebarBase]
  );

  return (
    <LayoutRoot>
      <CssBaseline />
      <HeaderWrapper open={sidebarOpen} isMobile={isMobile} >
  <Header onSidebarToggle={handleSidebarToggle} isSidebarVisible={shouldShowSidebarBase} />
</HeaderWrapper>
      <LayoutContent>
        {shouldShowSidebarBase && (
          <SidebarContainer open={sidebarOpen} isMobile={isMobile}>
            <Sidebar
              open={sidebarOpen}
              onClose={handleSidebarClose}
              variant={isMobile ? 'temporary' : 'persistent'}
              isMobile={isMobile}
            />
          </SidebarContainer>
        )}
        <MainContent open={sidebarOpen} isMobile={isMobile}>
          <Outlet />
        </MainContent>
      </LayoutContent>
      {isMobile && <MobileNavigation />}
    </LayoutRoot>
  );
};

export default Layout;