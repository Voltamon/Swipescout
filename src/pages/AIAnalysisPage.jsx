import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Assessment,
  VideoLibrary,
  Person,
  School,
  Work,
  Star,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { getUserAIAnalysis, getVideoAIAnalysis } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AIAnalysisPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [userAnalysis, setUserAnalysis] = useState(null);
  const [videoAnalyses, setVideoAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserAnalysis();
  }, [user]);

  const fetchUserAnalysis = async () => {
    try {
      setLoading(true);
      const response = await getUserAIAnalysis(user.id);
      setUserAnalysis(response.data.data);
    } catch (err) {
      setError('Failed to fetch AI analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoAnalysis = async (videoId) => {
    try {
      const response = await getVideoAIAnalysis(videoId);
      return response.data.data;
    } catch (err) {
      console.error('Failed to fetch video analysis:', err);
      return null;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        {t('aiAnalysis.title', 'AI Analysis Dashboard')}
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label={i18n.t('auto_ai_analysis_tabs')} >
        <Tab 
          label={t('aiAnalysis.profileAnalysis', 'Profile Analysis')} 
          icon={<Person />} 
          iconPosition="start"
        />
        <Tab 
          label={t('aiAnalysis.videoAnalysis', 'Video Analysis')} 
          icon={<VideoLibrary />} 
          iconPosition="start"
        />
        <Tab 
          label={t('aiAnalysis.recommendations', 'Recommendations')} 
          icon={<TrendingUp />} 
          iconPosition="start"
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Overall Score Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('aiAnalysis.overallScore', 'Overall Score')}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress
                    variant="determinate"
                    value={userAnalysis?.overallScore || 0}
                    size={80}
                    thickness={4}
                  />
                  <Typography variant="h4" color="primary">
                    {Math.round(userAnalysis?.overallScore || 0)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Career Path Suggestion */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work color="primary" />
                  {t('aiAnalysis.careerPath', 'Suggested Career Path')}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {userAnalysis?.careerPathSuggestion || 'Software Engineer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('aiAnalysis.careerPathDescription', 'Based on your skills, experience, and interests, this career path aligns well with your profile.')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Skill Gaps */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" />
                  {t('aiAnalysis.skillGaps', 'Skill Gaps')}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {(userAnalysis?.skillGaps || []).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Resume Optimization Tips */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  {t('aiAnalysis.resumeTips', 'Resume Optimization Tips')}
                </Typography>
                <List dense>
                  {(userAnalysis?.resumeOptimizationTips || []).map((tip, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Star color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          {t('aiAnalysis.videoAnalysisTitle', 'Video Performance Analysis')}
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('aiAnalysis.videoAnalysisDescription', 'Upload videos to get detailed AI analysis of your presentation skills, content quality, and engagement metrics.')}
        </Alert>
        
        {/* Placeholder for video analysis results */}
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center" py={4}>
              {t('aiAnalysis.noVideos', 'No videos analyzed yet. Upload a video to see detailed AI insights.')}
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          {t('aiAnalysis.aiRecommendations', 'AI-Powered Recommendations')}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('aiAnalysis.learningRecommendations', 'Learning Recommendations')}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Cloud Computing Fundamentals"
                      secondary="Recommended based on current industry trends"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Machine Learning Basics"
                      secondary="Enhance your technical skill set"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('aiAnalysis.jobRecommendations', 'Job Recommendations')}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Senior Frontend Developer"
                      secondary="95% match with your profile"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Full Stack Engineer"
                      secondary="87% match with your profile"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AIAnalysisPage;

