import React from "react";
import {
  AppBar,
  Toolbar,
 
  Avatar,


  IconButton,
  Typography,
  Box,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Notifications,
  Home,
  Work,
  Person,
  ExitToApp
} from "@mui/icons-material";

 {/* //Header */}
const Header = ({ onSidebarToggle }) => {
  return (<>
<AppBar position="static" 
      
      color="default"
      elevation={1}
      sx={{
        height: 56,
        justifyContent: "center",
        px: 2, // padding left and right
      }}>   {/*elevation={1} */}
           
            
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side: Menu Icon and Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2}}>
          <IconButton edge="start" color="inherit" onClick={onSidebarToggle}>
            <MenuIcon />
          </IconButton>
        
        </Box>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Swipscout
                </Typography>
                <IconButton color="inherit">
                  <Home />
                </IconButton>
                <IconButton color="inherit">
                  <Work />
                </IconButton>
                <IconButton color="inherit">
                  <Person />
                </IconButton>
                <IconButton color="inherit">
                  <ExitToApp />
                </IconButton>
                <Avatar sx={{ marginLeft: 2 }}>A</Avatar>
              </Toolbar>
            </AppBar> 
</>



  );
};

// const Header = ({ onSidebarToggle }) => {
//   return (
//     <AppBar position="static" color="default" elevation={1} padding={0}>
//             {/* Header */}
//             <AppBar position="static">
//               <Toolbar>
//                 <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                   Swipscout
//                 </Typography>
//                 <IconButton color="inherit">
//                   <Home />
//                 </IconButton>
//                 <IconButton color="inherit">
//                   <Work />
//                 </IconButton>
//                 <IconButton color="inherit">
//                   <Person />
//                 </IconButton>
//                 <IconButton color="inherit">
//                   <ExitToApp />
//                 </IconButton>
//                 <Avatar sx={{ marginLeft: 2 }}>A</Avatar>
//               </Toolbar>
//             </AppBar>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Left side: Menu Icon and Logo */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <IconButton edge="start" color="inherit" onClick={onSidebarToggle}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" component="div">
//             Swipscout
//           </Typography>
//         </Box>

//         {/* Right side: Navigation */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Button color="inherit" href="/">
//             Home
//           </Button>
//           <Button color="inherit" href="/about">
//             About
//           </Button>
//           <Button color="inherit" href="/contact">
//             Contact
//           </Button>
//           <Button variant="contained" color="primary" href="/signin">
//             Sign In
//           </Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

export default Header;
