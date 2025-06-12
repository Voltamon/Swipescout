"use client"
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Toolbar,
    Typography,
    useTheme,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Divider,
    useMediaQuery,
} from "@mui/material"
import { LocationOn, ArrowForward, People, ExpandMore, VideoCall, Menu as MenuIcon, Close } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from '../hooks/useAuth';

export default function EmployerDashboard() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { user } = useAuth();

    // Connect dropdown state
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    // Mobile drawer state
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return
        }
        setDrawerOpen(open)
    }

    // Available people for meetings
    const availablePeople = [
        { name: "Alice Smith", status: "Available now" },
        { name: "Michael Johnson", status: "Available in 30 min" },
        { name: "Sarah Williams", status: "Available now" },
        { name: "David Brown", status: "Available tomorrow" },
    ]

    // Navigation items
    const navItems = ["Home", "Jobs", "Candidates", "Profile", "Logout"]

    return (
<Box sx={{
    background: `linear-gradient(135deg, rgba(178, 209, 224, 0.5) 30%, rgba(111, 156, 253, 0.5) 90%), url('/backgrounds/bkg1.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
    padding: theme.spacing(2),
    height: '100%',
    mt: 0,
    mb: 0,
    paddingBottom: 4,
  }}>
    
            {/* Mobile Navigation Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        boxSizing: 'border-box',
                        background: theme.palette.background.paper, // Use theme's paper background
                        color: theme.palette.text.primary,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <IconButton onClick={toggleDrawer(false)} color="inherit">
                        <Close />
                    </IconButton>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item} disablePadding>
                                <ListItemButton sx={{ borderRadius: 1 }}>
                                    <Typography variant="body1" color="inherit">{item}</Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 2, mb: 0 }}>
                {/* Welcome Message and Connect Button */}
                <Box sx={{
                    display: "flex",
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                    mb: 4,
                    gap: isMobile ? 2 : 0
                }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            color: theme.palette.text.primary, // Use primary text color from theme
                            fontSize: isMobile ? '1.75rem' : '2.125rem',
                            mt: 2,
                        }}
                    >
                        Welcome back, John Doe!
                    </Typography>

                    <Button
                        color="primary"
                        variant="contained"
                        endIcon={<ExpandMore />}
                        onClick={handleClick}
                        sx={{
                            fontWeight: 500,
                            backgroundColor: theme.palette.primary.main, // Use primary color from theme
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            }
                        }}
                    >
                        Connect
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                                width: 250,
                                maxHeight: 300,
                                mt: 1,
                                bgcolor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                            }
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold', color: theme.palette.text.secondary }}>
                            Available for Meeting
                        </Typography>
                        {availablePeople.map((person, index) => (
                            <MenuItem key={index} onClick={handleClose} sx={{ py: 1.5 }}>
                                <ListItemIcon>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.light, color: theme.palette.primary.dark, fontSize: '0.875rem' }}>
                                        {person.name.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText
                                    primary={person.name}
                                    secondary={person.status}
                                    primaryTypographyProps={{ fontWeight: 500, color: theme.palette.text.primary }}
                                    secondaryTypographyProps={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}
                                />
                                <VideoCall fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Posted Jobs */}
                <Typography variant="h5" component="h2" sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}>
                    Posted Jobs
                </Typography>

                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {/* Job Card 1 */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.text.primary }}>
                                    Senior Frontend Developer
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <People fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        24 Applications
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <LocationOn fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        San Francisco, CA
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            bgcolor: theme.palette.success.light,
                                            color: theme.palette.success.dark,
                                            borderColor: 'transparent',
                                            borderRadius: "16px",
                                            "&:hover": {
                                                bgcolor: theme.palette.success.main,
                                                color: theme.palette.common.white,
                                                borderColor: 'transparent',
                                            },
                                        }}
                                    >
                                        Open
                                    </Button>

                                    <Button size="small" endIcon={<ArrowForward />} sx={{ color: theme.palette.primary.main }}>
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Job Card 2 */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.text.primary }}>
                                    UX/UI Designer
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <People fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        18 Applications
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <LocationOn fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Remote
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            bgcolor: theme.palette.info.light,
                                            color: theme.palette.info.dark,
                                            borderColor: 'transparent',
                                            borderRadius: "16px",
                                            "&:hover": {
                                                bgcolor: theme.palette.info.main,
                                                color: theme.palette.common.white,
                                                borderColor: 'transparent',
                                            },
                                        }}
                                    >
                                        Filled
                                    </Button>

                                    <Button size="small" endIcon={<ArrowForward />} sx={{ color: theme.palette.primary.main }}>
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Job Card 3 */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.text.primary }}>
                                    Backend Engineer
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <People fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        32 Applications
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <LocationOn fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        New York, NY
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            bgcolor: theme.palette.success.light,
                                            color: theme.palette.success.dark,
                                            borderColor: 'transparent',
                                            borderRadius: "16px",
                                            "&:hover": {
                                                bgcolor: theme.palette.success.main,
                                                color: theme.palette.common.white,
                                                borderColor: 'transparent',
                                            },
                                        }}
                                    >
                                        Open
                                    </Button>

                                    <Button size="small" endIcon={<ArrowForward />} sx={{ color: theme.palette.primary.main }}>
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Shortlisted Candidates */}
                <Typography variant="h5" component="h2" sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}>
                    Shortlisted Candidates
                </Typography>

                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {/* Candidate Card 1 */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
                            <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.light,
                                        color: theme.palette.primary.dark,
                                        width: 50,
                                        height: 50,
                                        mr: 2,
                                    }}
                                >
                                    AS
                                </Avatar>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1, color: theme.palette.text.primary }}>
                                        Alice Smith
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Senior Frontend Developer
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Interview Scheduled
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Candidate Card 2 */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
                            <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.light,
                                        color: theme.palette.primary.dark,
                                        width: 50,
                                        height: 50,
                                        mr: 2,
                                    }}
                                >
                                    MJ
                                </Avatar>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1, color: theme.palette.text.primary }}>
                                        Michael Johnson
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Backend Engineer
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Hired
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Notifications */}
                <Typography variant="h5" component="h2" sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}>
                    Notifications
                </Typography>

                <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                            New application for Senior Frontend Developer position.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            hours ago
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                            Michael Johnson accepted your offer for Backend Engineer.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            1 day ago
                        </Typography>
                    </CardContent>
                </Card>
            </Container><br></br>
        </Box>
    )
}