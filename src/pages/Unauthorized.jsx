import i18n from 'i18next';
import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  useTheme,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';

const UnauthorizedPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <LockIcon 
          sx={{ 
            fontSize: 80, 
            color: theme.palette.error.main,
            mb: 2 
          }} 
        />
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{i18n.t('auto_access_denied')}</Typography>
        
        <Typography variant="h6" color="textSecondary" paragraph>{i18n.t('auto_you_don_t_have_permission_to_view_this_p')}</Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please contact your administrator if you believe this is an error, 
          or return to the home page.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >{i18n.t('auto_go_to_home')}</Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >{i18n.t('auto_go_back')}</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;