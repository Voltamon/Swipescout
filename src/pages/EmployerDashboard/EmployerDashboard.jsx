import React from 'react';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import Header from '../../components/Header/Header';
import JobCard from '../../components/JobCard/JobCard.jsx';
import CandidateCard from '../../components/CandidateCard/CandidateCard';
import NotificationItem from '../../components/NotificationItem/NotificationItem';
import Footer from '../../components/Footer/Footer';
// import { useStyles } from './EmployerDashboard.styles';

const EmployerDashboard2 = () => {
  // const classes = useStyles();

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      applications: 24,
      location: 'San Francisco, CA',
      status: 'open',
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      applications: 18,
      location: 'Remote',
      status: 'filled',
    },
    {
      id: 3,
      title: 'Backend Engineer',
      applications: 32,
      location: 'New York, NY',
      status: 'open',
    },
  ];

  const candidates = [
    {
      id: 1,
      name: 'Alice Smith',
      position: 'Senior Frontend Developer',
      status: 'interview',
      initials: 'AS',
    },
    {
      id: 2,
      name: 'Michael Johnson',
      position: 'Backend Engineer',
      status: 'hired',
      initials: 'MJ',
    },
  ];

  const notifications = [
    {
      id: 1,
      message: 'New application for Senior Frontend Developer position.',
      time: '2 hours ago',
    },
    {
      id: 2,
      message: 'Michael Johnson accepted your offer for Backend Engineer.',
      time: '1 day ago',
    },
    {
      id: 3,
      message: 'Your job posting for UX/UI Designer has been viewed 150 times.',
      time: '3 days ago',
    },
  ];

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h4" className={classes.welcomeMessage}>
          Welcome back, John Doe!
        </Typography>
        
        {/* Posted Jobs Section */}
        <Typography variant="h6" color="primary" className={classes.sectionTitle}>
          Posted Jobs
        </Typography>
        <Grid container spacing={3} className={classes.section}>
          {jobs.map((job) => (
            <Grid item key={job.id} xs={12} sm={6} md={4}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
        
        {/* Shortlisted Candidates Section */}
        <Typography variant="h6" color="primary" className={classes.sectionTitle}>
          Shortlisted Candidates
        </Typography>
        <Grid container spacing={3} className={classes.section}>
          {candidates.map((candidate) => (
            <Grid item key={candidate.id} xs={12} md={6}>
              <CandidateCard candidate={candidate} />
            </Grid>
          ))}
        </Grid>
        
        {/* Notifications Section */}
        <Typography variant="h6" color="primary" className={classes.sectionTitle}>
          Notifications
        </Typography>
        <Card className={classes.section}>
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              lastItem={index === notifications.length - 1}
            />
          ))}
        </Card>
      </Container>
      
      <Footer />
    </>
  );
};

export default EmployerDashboard2;