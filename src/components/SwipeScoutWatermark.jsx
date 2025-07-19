// SwipeScoutWatermark.jsx
import { Box, Typography } from '@mui/material';
import { Home} from '@mui/icons-material';

const SwipeScoutWatermark = () => (
  <Box sx={{
    position: 'absolute',
    top: 67,
    right: 40,
    zIndex: 0,
    opacity: 0.3,
    pointerEvents: 'none'
  }}>
    
    <Typography variant="h1" sx={{
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'rgb(108, 171, 248)',
      lineHeight: 1,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      fontFamily: 'Arial, sans-serif',
      WebkitTextStroke: '1px rgba(86, 122, 189, 0.3)',
      paintOrder: 'stroke fill'
    }}>
      SwipeScout
    </Typography>
  </Box>
);

export default SwipeScoutWatermark;
 