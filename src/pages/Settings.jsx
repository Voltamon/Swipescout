// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Container,
//   Paper, 
//   Typography, 
//   Divider, 
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemButton,
//   Switch,
//   TextField,
//   Button,
//   Grid,
//   Avatar,
//   FormControl,
//   FormControlLabel,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   Snackbar,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import SecurityIcon from '@mui/icons-material/Security';
// import LanguageIcon from '@mui/icons-material/Language';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteIcon from '@mui/icons-material/Delete';
// import HelpIcon from '@mui/icons-material/Help';
// import { useAuth } from '../hooks/useAuth';
// // import { getUserSettings, updateUserSettings } from '../services/userService';

// const SettingsContainer = styled(Container)(({ theme }) => ({
//   padding: theme.spacing(3),
//   backgroundColor: theme.palette.background.default,
//   minHeight: 'calc(100vh - 56px)',
// }));

// const SettingsPaper = styled(Paper)(({ theme }) => ({
//   padding: 0,
//   borderRadius: theme.shape.borderRadius,
//   overflow: 'hidden',
// }));

// const SettingsSidebar = styled(Box)(({ theme }) => ({
//   width: '100%',
//   backgroundColor: theme.palette.background.paper,
//   [theme.breakpoints.up('md')]: {
//     width: 240,
//     borderRight: `1px solid ${theme.palette.divider}`,
//     height: '100%',
//   },
// }));

// const SettingsContent = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
//   flex: 1,
// }));

// const SettingsHeader = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
// }));

// const AvatarUpload = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   marginBottom: theme.spacing(3),
// }));

// const LargeAvatar = styled(Avatar)(({ theme }) => ({
//   width: 100,
//   height: 100,
//   marginBottom: theme.spacing(2),
// }));

// const Settings = () => {
//   const { user } = useAuth();
//   const [activeSection, setActiveSection] = useState('profile');
//   const [settings, setSettings] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '' });
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     bio: '',
//     location: '',
//     language: 'ar',
//     emailNotifications: true,
//     pushNotifications: true,
//     smsNotifications: false,
//     profileVisibility: 'public',
//     twoFactorAuth: false,
//   });

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         setLoading(true);
//         const response = await getUserSettings();
//         setSettings(response.data.settings);
//         setFormData({
//           name: response.data.settings.name || '',
//           email: response.data.settings.email || '',
//           mobile: response.data.settings.mobile || '',
//           bio: response.data.settings.bio || '',
//           location: response.data.settings.location || '',
//           language: response.data.settings.language || 'ar',
//           emailNotifications: response.data.settings.notifications?.email || true,
//           pushNotifications: response.data.settings.notifications?.push || true,
//           smsNotifications: response.data.settings.notifications?.sms || false,
//           profileVisibility: response.data.settings.privacy?.profile_visibility || 'public',
//           twoFactorAuth: response.data.settings.security?.two_factor_auth || false,
//         });
//       } catch (error) {
//         console.error('Error fetching settings:', error);
//         setSnackbar({
//           open: true,
//           message: 'حدث خطأ أثناء تحميل الإعدادات',
//           severity: 'error',
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSettings();
//   }, []);

//   const handleSectionChange = (section) => {
//     setActiveSection(section);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSwitchChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: checked,
//     });
//   };

//   const handleSaveSettings = async () => {
//     try {
//       setSaving(true);
      
//       // تحويل البيانات إلى الشكل المطلوب للـ API
//       const updatedSettings = {
//         name: formData.name,
//         email: formData.email,
//         mobile: formData.mobile,
//         bio: formData.bio,
//         location: formData.location,
//         language: formData.language,
//         notifications: {
//           email: formData.emailNotifications,
//           push: formData.pushNotifications,
//           sms: formData.smsNotifications,
//         },
//         privacy: {
//           profile_visibility: formData.profileVisibility,
//         },
//         security: {
//           two_factor_auth: formData.twoFactorAuth,
//         },
//       };
      
//       await updateUserSettings(updatedSettings);
      
//       setSnackbar({
//         open: true,
//         message: 'تم حفظ الإعدادات بنجاح',
//         severity: 'success',
//       });
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       setSnackbar({
//         open: true,
//         message: 'حدث خطأ أثناء حفظ الإعدادات',
//         severity: 'error',
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleOpenConfirmDialog = (title, message) => {
//     setConfirmDialog({
//       open: true,
//       title,
//       message,
//     });
//   };

//   const handleCloseConfirmDialog = () => {
//     setConfirmDialog({ ...confirmDialog, open: false });
//   };

//   const handleDeleteAccount = () => {
//     handleOpenConfirmDialog(
//       'حذف الحساب',
//       'هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى فقدان جميع بياناتك.'
//     );
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <SettingsContainer maxWidth="lg">
//       <Typography variant="h4" gutterBottom>
//         الإعدادات
//       </Typography>
      
//       <Grid container spacing={3} sx={{ mt: 1 }}>
//         <Grid item xs={12} md={3}>
//           <SettingsPaper elevation={2}>
//             <SettingsSidebar>
//               <List>
//                 <ListItemButton
//                   selected={activeSection === 'profile'}
//                   onClick={() => handleSectionChange('profile')}
//                 >
//                   <ListItemIcon>
//                     <AccountCircleIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="الملف الشخصي" />
//                 </ListItemButton>
                
//                 <ListItemButton
//                   selected={activeSection === 'notifications'}
//                   onClick={() => handleSectionChange('notifications')}
//                 >
//                   <ListItemIcon>
//                     <NotificationsIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="الإشعارات" />
//                 </ListItemButton>
                
//                 <ListItemButton
//                   selected={activeSection === 'privacy'}
//                   onClick={() => handleSectionChange('privacy')}
//                 >
//                   <ListItemIcon>
//                     <VisibilityIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="الخصوصية" />
//                 </ListItemButton>
                
//                 <ListItemButton
//                   selected={activeSection === 'security'}
//                   onClick={() => handleSectionChange('security')}
//                 >
//                   <ListItemIcon>
//                     <SecurityIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="الأمان" />
//                 </ListItemButton>
                
//                 <ListItemButton
//                   selected={activeSection === 'language'}
//                   onClick={() => handleSectionChange('language')}
//                 >
//                   <ListItemIcon>
//                     <LanguageIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="اللغة" />
//                 </ListItemButton>
                
//                 <ListItemButton
//                   selected={activeSection === 'help'}
//                   onClick={() => handleSectionChange('help')}
//                 >
//                   <ListItemIcon>
//                     <HelpIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="المساعدة" />
//                 </ListItemButton>
                
//                 <Divider />
                
//                 <ListItemButton
//                   onClick={handleDeleteAccount}
//                   sx={{ color: 'error.main' }}
//                 >
//                   <ListItemIcon sx={{ color: 'error.main' }}>
//                     <DeleteIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="حذف الحساب" />
//                 </ListItemButton>
//               </List>
//             </SettingsSidebar>
//           </SettingsPaper>
//         </Grid>
        
//         <Grid item xs={12} md={9}>
//           <SettingsPaper elevation={2}>
//             {activeSection === 'profile' && (
//               <Box>
//                 <SettingsHeader>
//                   <Typography variant="h6">إعدادات الملف الشخصي</Typography>
//                 </SettingsHeader>
                
//                 <SettingsContent>
//                   <AvatarUpload>
//                     <LargeAvatar src={user?.photo_url}>
//                       {!user?.photo_url && user?.name?.charAt(0)}
//                     </LargeAvatar>
//                     <Button variant="outlined" component="label">
//                       تغيير الصورة
//                       <input type="file" hidden accept="image/*" />
//                     </Button>
//                   </AvatarUpload>
                  
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="الاسم"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         margin="normal"
//                       />
//                     </Grid>
                    
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="البريد الإلكتروني"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         margin="normal"
//                       />
//                     </Grid>
                    
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="رقم الجوال"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleInputChange}
//                         margin="normal"
//                       />
//                     </Grid>
                    
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="الموقع"
//                         name="location"
//                         value={formData.location}
//                         onChange={handleInputChange}
//                         margin="normal"
//                       />
//                     </Grid>
                    
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="نبذة عني"
//                         name="bio"
//                         value={formData.bio}
//                         onChange={handleInputChange}
//                         margin="normal"
//                         multiline
//                         rows={4}
//                       />
//                     </Grid>
//                   </Grid>
                  
//                   <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleSaveSettings}
//                       disabled={saving}
//                     >
//                       {saving ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
//                     </Button>
//                   </Box>
//                 </SettingsContent>
//               </Box>
//             )}
            
//             {activeSection === 'notifications' && (
//               <Box>
//                 <SettingsHeader>
//                   <Typography variant="h6">إعدادات الإشعارات</Typography>
//                 </SettingsHeader>
                
//                 <SettingsContent>
//                   <List>
//                     <ListItem>
//                       <ListItemText 
//                         primary="إشعارات البريد الإلكتروني" 
//                         secondary="استلام إشعارات عبر البريد الإلكتروني" 
//                       />
//                       <Switch
//                         edge="end"
//                         name="emailNotifications"
//                         checked={formData.emailNotifications}
//                         onChange={handleSwitchChange}
//                       />
//                     </ListItem>
                    
//                     <Divider />
                    
//                     <ListItem>
//                       <ListItemText 
//                         primary="إشعارات الدفع" 
//                         secondary="استلام إشعارات في المتصفح وعلى الجوال" 
//                       />
//                       <Switch
//                         edge="end"
//                         name="pushNotifications"
//                         checked={formData.pushNotifications}
//                         onChange={handleSwitchChange}
//                       />
//                     </ListItem>
                    
//                     <Divider />
                    
//                     <ListItem>
//                       <ListItemText 
//                         primary="إشعارات الرسائل النصية" 
//                         secondary="استلام إشعارات عبر الرسائل النصية" 
//                       />
//                       <Switch
//                         edge="end"
//                         name="smsNotifications"
//                         checked={formData.smsNotifications}
//                         onChange={handleSwitchChange}
//                       />
//                     </ListItem>
//                   </List>
                  
//                   <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleSaveSettings}
//                       disabled={saving}
//                     >
//                       {saving ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
//                     </Button>
//                   </Box>
//                 </SettingsContent>
//               </Box>
//             )}
            
//             {activeSection === 'privacy' && (
//               <Box>
//                 <SettingsHeader>
//                   <Typography variant="h6">إعدادات الخصوصية</Typography>
//                 </SettingsHeader>
                
//                 <SettingsContent>
//                   <FormControl fullWidth margin="normal">
//                     <InputLabel>رؤية الملف الشخصي</InputLabel>
//                     <Select
//                       name="profileVisibility"
//                       value={formData.profileVisibility}
//                       onChange={handleInputChange}
//                       label="رؤية الملف الشخصي"
//                     >
//                       <MenuItem value="public">عام</MenuItem>
//                       <MenuItem value="connections">جهات الاتصال فقط</MenuItem>
//                       <MenuItem value="private">خاص</MenuItem>
//                     </Select>
//                   </FormControl>
                  
//                   <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleSaveSettings}
//                       disabled={saving}
//                     >
//                       {saving ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
//                     </Button>
//                   </Box>
//                 </SettingsContent>
//               </Box>
//             )}
            
//             {activeSection === 'security' && (
//               <Box>
//                 <SettingsHeader>
//                   <Typography variant="h6">إعدادات الأمان</Typography>
//                 </SettingsHeader>
                
//                 <SettingsContent>
//                   <List>
//                     <ListItem>
//                       <ListItemText 
//                         primary="المصادقة الثنائية" 
//                         secondary="تفعيل المصادقة الثنائية لزيادة أمان حسابك" 
//                       />
//                       <Switch
//                         edge="end"
//                         name="twoFactorAuth"
//                         checked={formData.twoFactorAuth}
//                         onChange={handleSwitchChange}
//                       />
//                     </ListItem>
                    
//                     <Divider />
//                   </List>
                  
//                   <Box sx={{ mt: 3 }}>
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       fullWidth
//                       sx={{ mb: 2 }}
//                     >
//                       تغيير كلمة المرور
//                     </Button>
                    
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       fullWidth
//                     >
//                       جلسات تسجيل الدخول النشطة
//                     </Button>
//                   </Box>
                  
//                   <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleSaveSettings}
//                       disabled={saving}
//                     >
//                       {saving ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
//                     </Button>
//                   </Box>
//                 </SettingsContent>
//               </Box>
//             )}
            
//             {activeSection === 'language' && (
//               <Box>
//                 <SettingsHeader>
//                   <Typography variant="h6">إعدادات اللغة</Typography>
//                 </SettingsHeader>
                
//                 <SettingsContent>
//                   <FormControl fullWidth margin="normal">
//                     <InputLabel>اللغة</InputLabel>
//                     <Select
//                       name="language"
//                       value={formData.language}
//                       onChange={handleInputChange}
//                       label="اللغة"
//                     >
//                       <MenuItem value="ar">العربية</MenuItem>
//                       <MenuItem value="en">الإنجليزية</MenuItem>
//                     </Select>
//                   </FormControl>
                  
//                   <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleSaveSettings}
//                       disabled={saving}
//                     >
//                       {saving ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
//                     </Button>
//                   </Box>
//                 </SettingsContent>
//               </Box>
//             )}
            
//             {activeSection === 'help' && (
//               <Box>
//                 <SettingsHeader>
//                   <Typography variant="h6">المساعدة والدعم</Typography>
//                 </SettingsHeader>
                
//                 <SettingsContent>
//                   <Typography variant="body1" paragraph>
//                     إذا كنت بحاجة إلى مساعدة أو لديك أي استفسارات، يمكنك الاتصال بفريق الدعم الخاص بنا.
//                   </Typography>
                  
//                   <List>
//                     <ListItem>
//                       <ListItemText 
//                         primary="مركز المساعدة" 
//                         secondary="تصفح الأسئلة الشائعة والمقالات التوضيحية" 
//                       />
//                       <Button variant="outlined" size="small">
//                         فتح
//                       </Button>
//                     </ListItem>
                    
//                     <Divider />
                    
//                     <ListItem>
//                       <ListItemText 
//                         primary="الدعم الفني" 
//                         secondary="تواصل مع فريق الدعم الفني" 
//                       />
//                       <Button variant="outlined" size="small">
//                         اتصال
//                       </Button>
//                     </ListItem>
                    
//                     <Divider />
                    
//                     <ListItem>
//                       <ListItemText 
//                         primary="الإبلاغ عن مشكلة" 
//                         secondary="أبلغ عن مشكلة أو خلل في التطبيق" 
//                       />
//                       <Button variant="outlined" size="small">
//                         إبلاغ
//                       </Button>
//                     </ListItem>
//                   </List>
//                 </SettingsContent>
//               </Box>
//             )}
//           </SettingsPaper>
//         </Grid>
//       </Grid>
      
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
      
//       <Dialog
//         open={confirmDialog.open}
//         onClose={handleCloseConfirmDialog}
//       >
//         <DialogTitle>{confirmDialog.title}</DialogTitle>
//         <DialogContent>
//           <Typography>{confirmDialog.message}</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseConfirmDialog}>إلغاء</Button>
//           <Button color="error" onClick={handleCloseConfirmDialog}>
//             حذف الحساب
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </SettingsContainer>
//   );
// };

// export default Settings;
