import React, { useState } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { 
    Box, 
    Container, 
    Typography, 
    Paper, 
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Link,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import { 
    Users, 
    Briefcase, 
    FileText, 
    Clock as UserClock,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    LogOut,
    User,
    Settings,
    HelpCircle
} from 'lucide-react';
import { blue, amber, green, red, grey, indigo } from '@mui/material/colors';
// import { motion, AnimatePresence } from 'framer-motion';

// ===============================
// Styles
// ===============================

const primaryColor = blue[600];  // #2563EB
const secondaryColor = amber[500]; // #F59E0B
const bgLight = grey[50];       // #F9FAFB
const textDark = grey[800];      // #1F2937
const textLight = grey[500];    // #6B7280
const white = '#FFFFFF';
const cardShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
const successColor = green[500];    // #10B981
const dangerColor = red[500];      // #EF4444
const indigoColor = indigo[500];
const warningColor = amber[500];

const PoppinsFont = "'Poppins', sans-serif";

// Create a theme with Poppins font
const theme = createTheme({
    typography: {
        fontFamily: PoppinsFont,
    },
});

const Root = styled('div')({
    fontFamily: PoppinsFont,
});

const HeaderContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 0),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

const Logo = styled('a')({
    fontSize: '24px',
    fontWeight: 700,
    color: primaryColor,
    textDecoration: 'none',
    '& span': {
        color: secondaryColor,
    },
});

const Nav = styled('nav')(({ theme }) => ({
    '& ul': {
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        [theme.breakpoints.down('md')]: {
            marginTop: '15px',
            flexWrap: 'wrap',
        },
        '& li': {
            marginLeft: '30px',
            [theme.breakpoints.down('md')]: {
                margin: '5px 15px 5px 0',
            },
            '& a': {
                textDecoration: 'none',
                color: textDark,
                fontWeight: 500,
                transition: 'color 0.3s',
                '&:hover': {
                    color: primaryColor,
                },
            },
        },
    },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: primaryColor,
    color: white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
}));

const DashboardContent = styled('main')(({ theme }) => ({
    padding: theme.spacing(8, 0),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(5, 0),
    },
}));

const WelcomeMessage = styled(Typography)({
    fontSize: '28px',
    marginBottom: '40px',
    fontWeight: 500
});

const MetricsGrid = styled(Grid)(({ theme }) => ({
    marginBottom: '40px',
}));

const MetricCard = styled(Paper)(({ theme }) => ({
    borderRadius: 8,
    padding: theme.spacing(3),
    boxShadow: cardShadow,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const MetricHeader = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
});

const MetricIcon = styled('div')(({ bgColor, color }) => ({
    width: 40,
    height: 40,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '15px',
    fontSize: '18px',
    backgroundColor: bgColor,
    color: color,
}));

const MetricTitle = styled(Typography)({
    fontSize: '14px',
    color: textLight,
});

const MetricValue = styled(Typography)({
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '10px',
});

const MetricChange = styled('div')(({ color }) => ({
    fontSize: '12px',
    marginTop: 'auto',
    color: color,
    display: 'flex',
    alignItems: 'center'
}));

const SectionTitle = styled(Typography)({
    fontSize: '22px',
    marginBottom: '20px',
    color: primaryColor,
    fontWeight: 600
});

const ActivityCard = styled(Paper)(({ theme }) => ({
    borderRadius: 8,
    padding: '24px',
    boxShadow: cardShadow,
    marginBottom: '40px',
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
    padding: '12px 0',
    borderBottom: `1px solid #E5E7EB`,
    '&:last-child': {
        borderBottom: 'none',
    },
    alignItems: 'flex-start',
}));

const ActivityIcon = styled(ListItemIcon)(({ theme }) => ({
    marginRight: '15px',
    color: primaryColor,
    fontSize: '18px',
    minWidth: 'auto'
}));

const ActivityContent = styled('div')({
    '& p': {
        fontSize: '14px',
        marginBottom: '5px',
    },
});

const ActivityTime = styled(Typography)({
    color: textLight,
    fontSize: '12px',
});

const QuickLinks = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
    '& a': {
        padding: '12px 24px',
        backgroundColor: primaryColor,
        color: white,
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#1D4ED8',
        },
    }
}));

const FooterContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
});

const FooterLinks = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    '& a': {
        margin: '0 15px',
        color: textDark,
        textDecoration: 'none',
        fontSize: '14px',
        '&:hover': {
            color: primaryColor,
        },
    },
});

const SocialIcons = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    '& a': {
        margin: '0 10px',
        color: textDark,
        fontSize: '20px',
        '&:hover': {
            color: primaryColor,
        },
    },
});

const Copyright = styled(Typography)({
    textAlign: 'center',
    color: textLight,
    fontSize: '14px',
});

// ===============================
// Components
// ===============================

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <header>
            <Container maxWidth="xl">
                <HeaderContainer>
                    <Logo href="#">
                        Swip<span>scout</span>
                    </Logo>
                    <Nav>
                        <ul>
                            <li><a href="#">Dashboard</a></li>
                            <li><a href="#">Users</a></li>
                            <li><a href="#">Jobs</a></li>
                            <li><a href="#">Reports</a></li>
                            <li><a href="#">Logout</a></li>
                        </ul>
                    </Nav>
                    <UserAvatar onClick={handleClick}>
                        AD
                    </UserAvatar>
                    <Menu
                        id="dropdown-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            style: {
                                borderRadius: 8,
                                boxShadow: cardShadow,
                                width: 200,
                            }
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <User size={16} />
                            </ListItemIcon>
                            Profile Settings
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Settings size={16} />
                            </ListItemIcon>
                            Account
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <HelpCircle size={16} />
                            </ListItemIcon>
                            Help Center
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                 <LogOut size={16} />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </HeaderContainer>
            </Container>
        </header>
    );
};

const MetricCardComponent = ({
    icon,
    title,
    value,
    change,
    isPositive,
}) => {
    return (
        <MetricCard>
            <MetricHeader>
                <MetricIcon
                    bgColor={
                        title === 'Total Users' ? '#DBEAFE' :
                        title === 'Total Jobs' ? '#D1FAE5' :
                        title === 'Total Applications' ? '#FEF3C7' :
                        '#E0E7FF'
                    }
                    color={
                        title === 'Total Users' ? primaryColor :
                        title === 'Total Jobs' ? successColor :
                        title === 'Total Applications' ? warningColor :
                        indigoColor
                    }
                >
                    {icon}
                </MetricIcon>
                <div>
                    <MetricTitle>{title}</MetricTitle>
                    <MetricValue>{value}</MetricValue>
                </div>
            </MetricHeader>
         
        </MetricCard>
    );
};
//    <MetricChange color={isPositive ? successColor : dangerColor}>
//                 {isPositive ? <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>&nbsp;</> :
//                 <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>&nbsp;</>}
//                 {change}
//             </MetricChange>
const ActivityItemComponent = ({ icon, children }) => (
    <ActivityItem>
        <ActivityIcon>{icon}</ActivityIcon>
        <ActivityContent>{children}</ActivityContent>
    </ActivityItem>
);

const Footer = () => (
    <footer>
        <Container maxWidth="xl">
            <FooterContainer>
                <FooterLinks>
                    <Link href="#">About Us</Link>
                    <Link href="#">Contact Us</Link>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms and Conditions</Link>
                </FooterLinks>
                <SocialIcons>
                    <Link href="#"><Facebook /></Link>
                    <Link href="#"><Twitter /></Link>
                    <Link href="#"><Linkedin /></Link>
                    <Link href="#"><Instagram /></Link>
                </SocialIcons>
                <Copyright>© {new Date().getFullYear()} Swipscout. All rights reserved.</Copyright>
            </FooterContainer>
        </Container>
    </footer>
);

const adminDashboard = () => {
    return (
        <ThemeProvider theme={theme}>
            <Root>
                <Header />
                <DashboardContent>
                    <Container maxWidth="xl">
                        <WelcomeMessage>Welcome back, Admin!</WelcomeMessage>

                        <MetricsGrid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <MetricCardComponent
                                    icon={<Users />}
                                    title="Total Users"
                                    value="1,248"
                                    change="12% from last month"
                                    isPositive={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <MetricCardComponent
                                    icon={<Briefcase />}
                                    title="Total Jobs"
                                    value="356"
                                    change="8% from last month"
                                    isPositive={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <MetricCardComponent
                                    icon={<FileText />}
                                    title="Total Applications"
                                    value="2,187"
                                    change="15% from last month"
                                    isPositive={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <MetricCardComponent
                                    icon={<UserClock />}
                                    title="Active Users"
                                    value="87"
                                    change="5% from yesterday"
                                    isPositive={false}
                                />
                            </Grid>
                        </MetricsGrid>

                        <SectionTitle>Recent Activity</SectionTitle>
                        <ActivityCard>
                            <List>
                                <ActivityItemComponent icon={<Briefcase />}>
                                    <p>New job posted by Tech Corp: "Senior Frontend Developer"</p>
                                    <ActivityTime>10 minutes ago</ActivityTime>
                                </ActivityItemComponent>
                                <ActivityItemComponent icon={<Users />}>
                                    <p>John Doe applied for "Software Engineer" at DataSystems</p>
                                    <ActivityTime>25 minutes ago</ActivityTime>
                                </ActivityItemComponent>
                                <ActivityItemComponent icon={<Briefcase />}>
                                    <p>New employer registered: DesignHub</p>
                                    <ActivityTime>1 hour ago</ActivityTime>
                                </ActivityItemComponent>
                                <ActivityItemComponent icon={<Users />}>
                                    <p>Alice Smith completed her profile (100%)</p>
                                    <ActivityTime>2 hours ago</ActivityTime>
                                </ActivityItemComponent>
                            </List>
                        </ActivityCard>

                        <QuickLinks>
                            <a href="#">Manage Users</a>
                            <a href="#">Manage Jobs</a>
                            <a href="#">View Reports</a>
                        </QuickLinks>
                    </Container>
                </DashboardContent>
                <Footer />
            </Root>
        </ThemeProvider>
    );
};

export default adminDashboard;