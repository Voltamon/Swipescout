import React from "react";
import {
  AppBar,
  Toolbar,
 
  Avatar,

Link,
  IconButton,
  Typography,
  Box,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';
import {
  Notifications,
  Home,
  Work,
  Person,
  ExitToApp
} from "@mui/icons-material";

import { useAuth ,AuthContext} from "../hooks/useAuth";
import { useContext } from "react";

export const useAuthContext = () => {
  return useContext(AuthContext);
};
  

 {/* //Header */}
const Header = ({ onSidebarToggle , isSidebarVisible }) => {
  const Navigate=useNavigate();
  const { user, logout } = useAuthContext();
  return (<> {isSidebarVisible && ( 
<AppBar position="static" 
      
      color="default"
      elevation={1}
      sx={{
       
        background: 'rgba(182, 202, 233, 0.34)',

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
                  <ExitToApp onClick={logout}/>
                </IconButton>
                    <IconButton
      onClick={()=>Navigate("/candidate-profile")} // Correctly call the navigate function
      aria-label="view candidate profile" // Crucial for accessibility
      // sx={{ marginLeft: 2 }} // You can apply spacing here if needed,
                               // or use typical flexbox spacing in a Toolbar
    >
                 <Avatar sx={{ marginLeft: 2 }} >A</Avatar>
                 </IconButton>
              </Toolbar>
            </AppBar> )}
</>



  );
};




export default Header;
