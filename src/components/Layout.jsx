import React from "react";
import { Box, useMediaQuery, useTheme, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh"
}));

const LayoutContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  width: "100%"
}));

const SidebarWrapper = styled(Box)(({ isSidebarVisible }) => ({
  width: isSidebarVisible ? 240 : 0,
  flexShrink: 0,
  overflowX: "hidden" // Prevent potential scrollbar when width is 0
}));

const MainContent = styled(Box)(({ isSidebarVisible }) => ({
  flexGrow: 1,
  width: "100%",
  marginLeft: isSidebarVisible ? 0 : 0, // Adjust if needed
  transition: "width 0.3s ease-in-out, marginLeft 0.3s ease-in-out"
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  // Define an array of routes where the sidebar should NOT be visible
  const routesWithoutSidebar = ["/login", "/signup", "/dashboard--"]; // Add your specific routes

  // Determine if the sidebar should be visible based on the current route and screen size
  const shouldShowSidebar =
    !isMobile && !routesWithoutSidebar.includes(location.pathname);
  const [sidebarOpen, setSidebarOpen] = React.useState(
    !isMobile && shouldShowSidebar
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
      setSidebarOpen(!isMobile && shouldShowSidebar);
    },
    [isMobile, location.pathname, shouldShowSidebar]
  );

  return (
    <LayoutRoot>
      <CssBaseline />
       {/* <Header
        onSidebarToggle={handleSidebarToggle}
        isSidebarVisible={shouldShowSidebar}
      />{" "}
      {/* Pass visibility to Header if needed */}
      <LayoutContent>
        {shouldShowSidebar &&
          <SidebarWrapper isSidebarVisible={shouldShowSidebar}>
            <Sidebar
              open={sidebarOpen}
              onClose={handleSidebarClose}
              variant="persistent"
            />
          </SidebarWrapper>}
        <MainContent isSidebarVisible={shouldShowSidebar}>
          <Outlet />
        </MainContent>
      </LayoutContent>
      {isMobile && <MobileNavigation />}
    </LayoutRoot>
  );
};

export default Layout;
