import React, { useContext } from 'react';
import { Card, Typography, Box, Chip } from '@mui/material';
import { People, LocationOn } from '@mui/icons-material';
import { useStyles } from './JobCard.styles';

const JobCard = ({ job }) => {
  const classes = useStyles();

  const getStatusChip = (status) => {
    const statusConfig = {
      open: { label: 'Open', color: 'status.open' },
      closed: { label: 'Closed', color: 'status.closed' },
      filled: { label: 'Filled', color: 'status.filled' },
    };

    const config = statusConfig[status] || statusConfig.open;
    
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: (theme) => theme.palette[config.color].background,
          color: (theme) => theme.palette[config.color].text,
          mt: 1,
        }}
      />
    );
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h6" gutterBottom>
        {job.title}
      </Typography>
      
      <Box display="flex" alignItems="center" mb={1}>
        <People fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="body2" color="textSecondary">
          {job.applications} Applications
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="body2" color="textSecondary">
          {job.location}
        </Typography>
      </Box>
      
      {getStatusChip(job.status)}
      
      <Typography
        component="a"
        href="#"
        className={classes.viewLink}
      >
        View Details →
      </Typography>
    </Card>
  );
};

export default JobCard;