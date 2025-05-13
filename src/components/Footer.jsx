import React from "react";
import { Box, Typography, Link, IconButton, useTheme, useMediaQuery } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from "@mui/material/styles";

const FooterRoot = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.footer,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const FooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginBottom: 0,
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SocialIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Copyright = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  textAlign: 'center',
  marginTop: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginTop: 0,
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FooterRoot>
      <FooterContainer>
        <FooterLinks>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/contact">Contact Us</FooterLink>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms and Conditions</FooterLink>
        </FooterLinks>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? theme.spacing(1) : theme.spacing(3) }}>
          <SocialIcons>
            <SocialIcon aria-label="Facebook" href="#">
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon aria-label="Twitter" href="#">
              <TwitterIcon />
            </SocialIcon>
            <SocialIcon aria-label="LinkedIn" href="#">
              <LinkedInIcon />
            </SocialIcon>
          </SocialIcons>
          <Copyright variant="body2">© 2025 Swipscout. All rights reserved.</Copyright>
        </Box>
      </FooterContainer>
    </FooterRoot>
  );
};

export default Footer;


// import React from "react";

// const Footer = () => {
//   return (
//     <footer>
//       <div className="container">
//         <div className="footer-links">
//           <a href="/about">About Us</a>
//           <a href="/contact">Contact Us</a>
//           <a href="/privacy-policy">Privacy Policy</a>
//           <a href="/terms">Terms and Conditions</a>
//         </div>
//         <div className="social-icons">
//           <a href="#">
//             <i className="fab fa-facebook" />
//           </a>
//           <a href="#">
//             <i className="fab fa-twitter" />
//           </a>
//           <a href="#">
//             <i className="fab fa-linkedin" />
//           </a>
//         </div>
//         <p>© 2025 Swipscout. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

      // {/* Footer */}
      // <Box
      //   sx={{
      //     backgroundColor: "#333",
      //     color: "white",
      //     padding: 4,
      //     marginTop: 4,
      //     textAlign: "center"
      //   }}
      // >
      //   <Typography variant="body2">
      //     © 2025 Swipscout. All rights reserved.
      //   </Typography>
      // </Box>