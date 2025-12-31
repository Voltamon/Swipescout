import i18n from 'i18next';
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
  LinearProgress,
  Toolbar,
  Typography,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  useMediaQuery,
} from "@mui/material"
import { BusinessCenter, LocationOn, ArrowForward, Menu as MenuIcon, Close } from "@mui/icons-material"
import { useState } from "react"

export default function SwipscoutDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawerOpen(open)
  }
  
  // Navigation items
  const navItems = ["Home", "Jobs", "Applications", "Profile", "Logout"]

  return (
    <Box sx={{ flexGrow: 1,backgroundColor: "#ffffff" }}>
      {/* Navigation Bar */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ backgroundColor: "white", borderBottom: "1px solid #eaeaea" }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center" }}>
              <Box component="span" sx={{ color: "#3366ff", fontWeight: "bold" }}>{i18n.t('auto_swip')}</Box>
              <Box component="span" sx={{ color: "#ffc107", fontWeight: "bold" }}>{i18n.t('auto_scout')}</Box>
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 3 }}>
                {navItems.map((item) => (
                  <Button key={item} color="inherit" sx={{ fontWeight: 500 }}>
                    {item}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Hamburger Icon - Centered */}
            {isMobile && (
              <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <IconButton 
                  color="inherit" 
                  aria-label={i18n.t('auto_menu')} 
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            <Avatar sx={{ bgcolor: "#3366ff" }}>{i18n.t('auto_js')}</Avatar>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
      
          <List>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton sx={{ borderRadius: 1 }}>
                  <Typography variant="body1">{item}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        {/* Welcome Message */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: "bold", 
            mb: 4,
            fontSize: isMobile ? '1.75rem' : '2.125rem'
          }}
        >{i18n.t('auto_welcome_back_john_smith')}</Typography>

        {/* Profile Completion Card */}
        <Card sx={{ mb: 5, p: 2 }}>
          <CardContent>
            <Box sx={{ 
              display: "flex", 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: "space-between", 
              alignItems: isMobile ? "flex-start" : "center", 
              mb: isMobile ? 3 : 2,
              gap: isMobile ? 1 : 0
            }}>
              <Typography variant="h6" component="div">{i18n.t('auto_profile_completion')}</Typography>
              <Typography variant="h6" component="div" sx={{ color: "#3366ff", fontWeight: "bold" }}>{i18n.t('auto_80_complete')}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={80}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#3366ff",
                  borderRadius: 5,
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#3366ff",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#2952cc",
                  },
                }}
              >{i18n.t('auto_complete_profile')}</Button>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>{i18n.t('auto_recent_applications')}</Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Application Card 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>{i18n.t('auto_senior_frontend_developer')}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_techcorp_inc')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_san_francisco_ca')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#2196f3",
                      border: "none",
                      borderRadius: "16px",
                      "&:hover": {
                        bgcolor: "#d0e8fd",
                        border: "none",
                      },
                    }}
                  >{i18n.t('auto_reviewed')}</Button>

                  <Button size="small" endIcon={<ArrowForward />} sx={{ color: "#3366ff" }}>{i18n.t('auto_view_details_1')}</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Application Card 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
                  UX/UI Designer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_designhub')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_remote')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#e8f5e9",
                      color: "#4caf50",
                      border: "none",
                      borderRadius: "16px",
                      "&:hover": {
                        bgcolor: "#d7eeda",
                        border: "none",
                      },
                    }}
                  >{i18n.t('auto_shortlisted')}</Button>

                  <Button size="small" endIcon={<ArrowForward />} sx={{ color: "#3366ff" }}>{i18n.t('auto_view_details_1')}</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Application Card 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>{i18n.t('auto_backend_engineer')}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_datasystems')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_new_york_ny')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#fff8e1",
                      color: "#ffc107",
                      border: "none",
                      borderRadius: "16px",
                      "&:hover": {
                        bgcolor: "#ffecb3",
                        border: "none",
                      },
                    }}
                  >{i18n.t('auto_pending')}</Button>

                  <Button size="small" endIcon={<ArrowForward />} sx={{ color: "#3366ff" }}>{i18n.t('auto_view_details_1')}</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recommended Jobs */}
        <Typography variant="h5" component="h2" sx={{ color: "#3366ff", fontWeight: "bold", mb: 3 }}>{i18n.t('auto_recommended_jobs')}</Typography>

        <Grid container spacing={3}>
          {/* Job Card 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>{i18n.t('auto_full_stack_developer')}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_websolutions')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_austin_tx')}</Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>{i18n.t('auto_90_000_120_000')}</Typography>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3366ff",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "#2952cc",
                    },
                  }}
                >{i18n.t('auto_apply_now')}</Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>{i18n.t('auto_product_manager')}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_productlabs')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_chicago_il')}</Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>{i18n.t('auto_110_000_140_000')}</Typography>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3366ff",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "#2952cc",
                    },
                  }}
                >{i18n.t('auto_apply_now')}</Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Card 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 2 }}>{i18n.t('auto_devops_engineer')}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BusinessCenter fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_cloudtech')}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">{i18n.t('auto_remote')}</Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "medium", mb: 2 }}>{i18n.t('auto_100_000_130_000')}</Typography>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3366ff",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "#2952cc",
                    },
                  }}
                >{i18n.t('auto_apply_now')}</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}