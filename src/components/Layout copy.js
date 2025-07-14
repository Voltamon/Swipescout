import React from "react";
import { Box, useMediaQuery, useTheme, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Header from "./Headers/admin/HeaderAdmin";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh"
}));

const LayoutContent = styled(Box)(({ theme, open, isMobile }) => ({
  display: "flex",
  flex: "1 1 auto",
  paddingTop: 56,
  [theme.breakpoints.up("sm")]: {
    paddingTop: 64
  }
}));

const MainContent = styled(Box)(({ theme, open, isMobile }) => ({
  flex: "1 1 auto",
  width: "100%",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open &&
  !isMobile && {
    marginRight: 240,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

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
      setSidebarOpen(!isMobile);
    },
    [isMobile]
  );

  return (
    <LayoutRoot>
      <CssBaseline />
      <Header onSidebarToggle={handleSidebarToggle} />
      <LayoutContent open={sidebarOpen} isMobile={isMobile}>
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          variant={isMobile ? "temporary" : "persistent"}
        />
        <MainContent open={sidebarOpen} isMobile={isMobile}>
          <Outlet />
        </MainContent>
      </LayoutContent>
      {isMobile && <MobileNavigation />}
    </LayoutRoot>
  );
};

export default Layout;
