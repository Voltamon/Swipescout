import React, { useContext } from 'react';
import { Card, Box, Typography, Avatar, Chip } from '@mui/material';
import { useStyles } from './CandidateCard.styles';

const CandidateCard = ({ candidate }) => {
  const classes = useStyles();

  const getStatusChip = (status) => {
    const statusConfig = {
      interview: { label: 'Interview Scheduled', color: 'status.interview' },
      hired: { label: 'Hired', color: 'status.hired' },
    };

    const config = statusConfig[status] || { label: 'Applied', color: 'status.open' };
    
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
      <Box display="flex" alignItems="center">
        <Avatar className={classes.avatar}>{candidate.initials}</Avatar>
        <Box ml={2}>
          <Typography variant="subtitle1" fontWeight="medium">
            {candidate.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {candidate.position}
          </Typography>
          {getStatusChip(candidate.status)}
        </Box>
      </Box>
    </Card>
  );
};

export default CandidateCard;