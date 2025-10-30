import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Psychology,
  PlayArrow,
  Stop,
  Assessment,
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
  VideoCall,
  QuestionAnswer
} from '@mui/icons-material';
import { 
  getAutoInitialInterviewResults, 
  generateAIInterviewQuestions,
  getUserVideos 
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react'; // Import the AuthContext contexts/AuthContext';

const AIInterviewPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [interviewResults, setInterviewResults] = useState(null);
  const [aiQuestions, setAIQuestions] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
 
  const steps = [
    t('aiInterview.selectVideo', 'Select Video'),
    t('aiInterview.aiAnalysis', 'AI Analysis'),
    t('aiInterview.results', 'Results')
  ];

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const fetchUserVideos = async () => {
    try {
      const response = await getUserVideos();
      setUserVideos(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch user videos:', err);
    }
  };

  const startAutoInitialInterview = async (videoId) => {
    try {
      setLoading(true);
      setActiveStep(1);
      
      // Simulate AI analysis process
      setTimeout(async () => {
        try {
          const response = await getAutoInitialInterviewResults(user.id, videoId);
          setInterviewResults(response.data.data);
          setActiveStep(2);
          setShowResults(true);
        } catch (err) {
          setError('Failed to get interview results');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 3000); // Simulate 3 second analysis
      
    } catch (err) {
      setError('Failed to start interview analysis');
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    try {
      setLoading(true);
      const response = await generateAIInterviewQuestions(user.id, null);
      setAIQuestions(response.data.data || []);
    } catch (err) {
      setError('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <TrendingUp color="success" />;
    if (score >= 60) return <Warning color="warning" />;
    return <TrendingDown color="error" />;
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        {t('aiInterview.title', 'AI Interview Assistant')}
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        {t('aiInterview.description', 'Get instant AI-powered feedback on your interview performance and receive personalized recommendations.')}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('aiInterview.selectVideoTitle', 'Select a Video for AI Analysis')}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('aiInterview.selectVideoDescription', 'Choose one of your uploaded videos to get AI-powered interview feedback.')}
                </Typography>
                
                {userVideos.length === 0 ? (
                  <Alert severity="info">
                    {t('aiInterview.noVideos', 'No videos found. Please upload a video first to use AI interview analysis.')}
                  </Alert>
                ) : (
                  <Grid container spacing={2}>
                    {userVideos.map((video) => (
                      <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 2 },
                            border: selectedVideo?.id === video.id ? 2 : 1,
                            borderColor: selectedVideo?.id === video.id ? 'primary.main' : 'divider'
                          }}
                          onClick={() => setSelectedVideo(video)}
                        >
                          <CardContent>
                            <Typography variant="h6" noWrap>
                              {video.title || 'Untitled Video'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {video.duration ? `${video.duration}s` : 'Unknown duration'}
                            </Typography>
                            <Box mt={1}>
                              <Chip 
                                label={video.videoType || 'General'} 
                                size="small" 
                                variant="outlined" 
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                
                {selectedVideo && (
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={() => startAutoInitialInterview(selectedVideo.id)}
                      disabled={loading}
                    >
                      {t('aiInterview.startAnalysis', 'Start AI Analysis')}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('aiInterview.aiQuestionsTitle', 'AI-Generated Interview Questions')}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('aiInterview.aiQuestionsDescription', 'Get personalized interview questions based on your profile and target roles.')}
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<QuestionAnswer />}
                  onClick={generateQuestions}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {t('aiInterview.generateQuestions', 'Generate Questions')}
                </Button>

                {aiQuestions.length > 0 && (
                  <List>
                    {aiQuestions.map((question, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <QuestionAnswer color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={question} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <Box display="flex" flexDirection="column" alignItems="center" py={8}>
          <CircularProgress size={80} sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            {t('aiInterview.analyzing', 'Analyzing your video...')}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('aiInterview.analyzingDescription', 'Our AI is evaluating your communication skills, content quality, and overall presentation.')}
          </Typography>
          <LinearProgress sx={{ width: '100%', mt: 3 }} />
        </Box>
      )}

      {/* Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Assessment color="primary" />
            {t('aiInterview.resultsTitle', 'AI Interview Analysis Results')}
          </Box>
        </DialogTitle>
        <DialogContent>
          {interviewResults && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                      {getScoreIcon(interviewResults.score)}
                      <Typography variant="h4" color={getScoreColor(interviewResults.score)}>
                        {Math.round(interviewResults.score)}%
                      </Typography>
                    </Box>
                    <Typography variant="h6">
                      {t('aiInterview.overallScore', 'Overall Score')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('aiInterview.feedback', 'AI Feedback')}
                    </Typography>
                    <Typography variant="body1">
                      {interviewResults.feedback}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle color="success" />
                      {t('aiInterview.strengths', 'Strengths')}
                    </Typography>
                    <List dense>
                      {(interviewResults.strengths || []).map((strength, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning color="warning" />
                      {t('aiInterview.improvements', 'Areas for Improvement')}
                    </Typography>
                    <List dense>
                      {(interviewResults.areasForImprovement || []).map((area, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={area} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)}>
            {t('common.close', 'Close')}
          </Button>
          <Button variant="contained" onClick={() => {
            setShowResults(false);
            setActiveStep(0);
            setSelectedVideo(null);
            setInterviewResults(null);
          }}>
            {t('aiInterview.analyzeAnother', 'Analyze Another Video')}
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AIInterviewPage;

