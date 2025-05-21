import CheckExplorePage from '../pages/CheckExplorePage';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

 const ExploreLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CheckExplorePage />
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Outlet /> {/* This will render the matched route component below the header */}
      </Box>
    </Box>
  );
};
export default ExploreLayout;