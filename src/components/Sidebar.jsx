import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  useTheme,
  Box,
  Avatar,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  PersonSearch as SearchIcon,
  Business as JobsIcon,
  Message as MessagesIcon,
  People as CandidatesIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const expandedWidth = 200;
const collapsedWidth = 72;

const Sidebar = ({ open = true, onClose, variant ,isMobile}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Find Candidates', icon: <SearchIcon />, path: '/candidates' },
    { text: 'Job Postings', icon: <JobsIcon />, path: '/jobs' },
    { text: 'Applicants', icon: <CandidatesIcon />, path: '/applicants' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/messages' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  ];

  const secondaryItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (<>  {(open || !isMobile) && (
    <Drawer
      variant="permanent" // or "persistent"
      open={open}
      sx={{
        width: open ? expandedWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? expandedWidth : collapsedWidth,
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
  
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={user?.photoUrl} sx={{ width: 50, height: 50, mr: open ? 2 : 0 }}>
            {user?.name?.charAt(0)}
          </Avatar>
          {open && (
            <Box>
              <Typography variant="subtitle1">{user?.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.company || 'Employer'}
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />

        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={!open ? item.text : ''} placement="right">
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (variant === 'temporary') onClose();
                }}
                sx={{
                  bgcolor: isActive(item.path) ? theme.palette.action.selected : 'transparent',
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2 : 1,
                }}
              >
                {(open || !isMobile) && (
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                      minWidth: open ? 40 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}

                {open && !isMobile && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                )}
              </ListItem>

            </Tooltip>
          ))}
        </List>

        <Divider />

        <List>
          {secondaryItems.map((item) => (
            <Tooltip key={item.text} title={!open ? item.text : ''} placement="right">
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (variant === 'temporary') onClose();
                }}
                sx={{
                  bgcolor: isActive(item.path) ? theme.palette.action.selected : 'transparent',
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2 : 1,
                }}
              >
                {(open || !isMobile) && (
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                      minWidth: open ? 40 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}

                {open && !isMobile && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                )}
              </ListItem>

            </Tooltip>
          ))}
          <Tooltip title={!open ? 'Logout' : ''} placement="right">
            <ListItem
              button
              onClick={logout}
              sx={{ justifyContent: open ? 'initial' : 'center', px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                <LogoutIcon color="error" />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ color: 'error' }}
                />
              )}
            </ListItem>
          </Tooltip>
        </List>
      </Box>
    </Drawer> )} </>
  );
};

export default Sidebar;

// // Sidebar.jsx
// import React from "react";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Tooltip,
//   Box
// } from "@mui/material";
// import {
//   Home,
//   Work,
//   Person,
//   Settings
// } from "@mui/icons-material";

// const drawerWidthExpanded = 200;
// const drawerWidthCollapsed = 72;

// const Sidebar = ({ open = true, variant = "persistent", onClose, userRole = "employer" }) => {
//   const showText = open;

//   const employerLinks = [
//     { label: "Dashboard", icon: <Home />, path: "/dashboard" },
//     { label: "Post Job", icon: <Work />, path: "/post-job" },
//     { label: "Profile", icon: <Person />, path: "/employer-profile" },
//     { label: "Settings", icon: <Settings />, path: "/settings" },
//   ];

//   const jobSeekerLinks = [
//     { label: "Home", icon: <Home />, path: "/home" },
//     { label: "Jobs", icon: <Work />, path: "/jobs" },
//     { label: "Profile", icon: <Person />, path: "/profile" },
//     { label: "Settings", icon: <Settings />, path: "/settings" },
//   ];

//   const menuItems = userRole === "employer" ? employerLinks : jobSeekerLinks;

//   return (
//     <Drawer
//       variant={variant}
//       open={open}
//       onClose={onClose}
//       sx={{
//         width: open ? drawerWidthExpanded : drawerWidthCollapsed,
//         flexShrink: 0,
//         whiteSpace: "nowrap",
//         "& .MuiDrawer-paper": {
//           width: open ? drawerWidthExpanded : drawerWidthCollapsed,
//           transition: "width 0.3s ease-in-out",
//           overflowX: "hidden",
//           boxSizing: "border-box",
//         },
//       }}
//     >
//       <Box sx={{ mt: 8 }}> {/* Margin top for header space */}
//         <List>
//           {menuItems.map(({ label, icon, path }) => (
//             <Tooltip title={!showText ? label : ""} placement="right" key={label}>
//               <ListItemButton href={path} sx={{ px: 2 }}>
//                 <ListItemIcon sx={{ minWidth: 0, mr: showText ? 2 : "auto", justifyContent: "center" }}>
//                   {icon}
//                 </ListItemIcon>
//                 {showText && <ListItemText primary={label} />}
//               </ListItemButton>
//             </Tooltip>
//           ))}
//         </List>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;



// import React from 'react';
// import { 
//   Drawer, 
//   List, 
//   ListItem, 
//   ListItemIcon, 
//   ListItemText, 
//   Divider, 
//   Toolbar, 
//   useTheme,
//   Box,
//   Avatar,
//   Typography
// } from '@mui/material';
// import {
//   Home as HomeIcon,
//   PersonSearch as SearchIcon,
//   Business as JobsIcon,
//   Message as MessagesIcon,
//   People as CandidatesIcon,
//   Assessment as AnalyticsIcon,
//   Settings as SettingsIcon,
//   Help as HelpIcon,
//   Logout as LogoutIcon
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const drawerWidth = 240;

// const Sidebar = ({ open, onClose, variant }) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   const menuItems = [
//     { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
//     { text: 'Find Candidates', icon: <SearchIcon />, path: '/candidates' },
//     { text: 'Job Postings', icon: <JobsIcon />, path: '/jobs' },
//     { text: 'Applicants', icon: <CandidatesIcon />, path: '/applicants' },
//     { text: 'Messages', icon: <MessagesIcon />, path: '/messages' },
//     { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
//   ];

//   const secondaryItems = [
//     { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
//     { text: 'Help Center', icon: <HelpIcon />, path: '/help' },
//   ];

//   const isActive = (path) => location.pathname.startsWith(path);

//   return (
//     <Drawer
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           backgroundColor: theme.palette.background.paper,
//         },
//       }}
//       variant={variant}
//       anchor="left"
//       open={open}
//       onClose={onClose}
//     >
//       <Toolbar />
//       <Box sx={{ overflow: 'auto' }}>
//         <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Avatar src={user?.photoUrl} sx={{ width: 56, height: 56, mr: 2 }}>
//             {user?.name?.charAt(0)}
//           </Avatar>
//           <Box>
//             <Typography variant="subtitle1">{user?.name}</Typography>
//             <Typography variant="body2" color="textSecondary">
//               {user?.company || 'Employer'}
//             </Typography>
//           </Box>
//         </Box>
//         <Divider />

//         <List>
//           {menuItems.map((item) => (
//             <ListItem 
//               button 
//               key={item.text}
//               onClick={() => {
//                 navigate(item.path);
//                 if (variant === 'temporary') onClose();
//               }}
//               sx={{
//                 bgcolor: isActive(item.path) ? theme.palette.action.selected : 'transparent',
//               }}
//             >
//               <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : 'inherit' }}>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItem>
//           ))}
//         </List>
//         <Divider />

//         <List>
//           {secondaryItems.map((item) => (
//             <ListItem button key={item.text} onClick={() => navigate(item.path)}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItem>
//           ))}
//           <ListItem button onClick={logout}>
//             <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
//             <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
//           </ListItem>
//         </List>
//       </Box>
//     </Drawer>
//   ); 
// };

// export default Sidebar;