import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  Psychology,
  TrendingUp,
  Work,
  Person,
  Star,
  LocationOn,
  AttachMoney,
  School,
  Schedule,
  Insights,
  Refresh,
  FilterList,
  Analytics,
  Lightbulb,
  Assessment,
  Business,
  EmojiObjects
} from "@mui/icons-material";
import { 
  getJobRecommendations, 
  getCandidateRecommendations, 
  analyzeMatch,
  getMarketInsights 
} from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useContext } from 'react';

export default function SmartRecommendationsPage() {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Job recommendations state
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [minJobScore, setMinJobScore] = useState(70);
  const [jobLimit, setJobLimit] = useState(10);
  
  // Candidate recommendations state
  const [candidateRecommendations, setCandidateRecommendations] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [minCandidateScore, setMinCandidateScore] = useState(70);
  const [candidateLimit, setCandidateLimit] = useState(10);
  
  // Market insights state
  const [marketInsights, setMarketInsights] = useState(null);
  
  // Match analysis state
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [analysisDialog, setAnalysisDialog] = useState(false);

  useEffect(() => {
    if (activeTab === 0) {
      fetchJobRecommendations();
    } else if (activeTab === 2) {
      fetchMarketInsights();
    }
  }, [activeTab]);

  const fetchJobRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getJobRecommendations({
        limit: jobLimit,
        minScore: minJobScore
      });
      setJobRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      setError('Failed to load job recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateRecommendations = async () => {
    if (!selectedJobId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getCandidateRecommendations(selectedJobId, {
        limit: candidateLimit,
        minScore: minCandidateScore
      });
      setCandidateRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching candidate recommendations:', error);
      setError('Failed to load candidate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMarketInsights();
      setMarketInsights(response.data);
    } catch (error) {
      console.error('Error fetching market insights:', error);
      setError('Failed to load market insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMatch = async (candidateId, jobId) => {
    try {
      const response = await analyzeMatch(candidateId, jobId);
      setMatchAnalysis(response.data);
      setAnalysisDialog(true);
    } catch (error) {
      console.error('Error analyzing match:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const JobRecommendationCard = ({ job }) => (
    <Card 
      sx={{ 
        mb: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Avatar
              src={job.companyLogo}
              sx={{ width: 50, height: 50, mr: 2 }}
            >
              {job.company?.[0]}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bold">
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.company}
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {job.location}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box textAlign="center">
            <Chip
              label={`${job.compatibilityScore}% Match`}
              color={getScoreColor(job.compatibilityScore)}
              sx={{ mb: 1 }}
            />
            <LinearProgress
              variant="determinate"
              value={job.compatibilityScore}
              color={getScoreColor(job.compatibilityScore)}
              sx={{ width: 80, height: 6, borderRadius: 3 }}
            />
          </Box>
        </Box>

        {job.matchReasons && job.matchReasons.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Why this matches:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {job.matchReasons.slice(0, 3).map((reason, index) => (
                <Chip
                  key={index}
                  label={reason}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
              {job.matchReasons.length > 3 && (
                <Chip
                  label={`+${job.matchReasons.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {job.salary_min && job.salary_max && (
              <Typography variant="body2" color="text.secondary">
                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {job.job_type} • Posted {new Date(job.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
            >
              View Job
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => window.open(`/jobs/${job.id}/apply`, '_blank')}
            >
              Apply Now
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const CandidateRecommendationCard = ({ candidate }) => (
    <Card 
      sx={{ 
        mb: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Avatar
              src={candidate.profileImage}
              sx={{ width: 50, height: 50, mr: 2 }}
            >
              {candidate.first_name?.[0]}{candidate.last_name?.[0]}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bold">
                {candidate.first_name} {candidate.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {candidate.title}
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Work sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {candidate.total_experience} years experience
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box textAlign="center">
            <Chip
              label={`${candidate.compatibilityScore}% Match`}
              color={getScoreColor(candidate.compatibilityScore)}
              sx={{ mb: 1 }}
            />
            <LinearProgress
              variant="determinate"
              value={candidate.compatibilityScore}
              color={getScoreColor(candidate.compatibilityScore)}
              sx={{ width: 80, height: 6, borderRadius: 3 }}
            />
          </Box>
        </Box>

        {candidate.matchReasons && candidate.matchReasons.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Match highlights:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {candidate.matchReasons.slice(0, 3).map((reason, index) => (
                <Chip
                  key={index}
                  label={reason}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
              {candidate.matchReasons.length > 3 && (
                <Chip
                  label={`+${candidate.matchReasons.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {candidate.location}
            </Typography>
            {candidate.expected_salary && (
              <Typography variant="body2" color="text.secondary">
                Expected: ${candidate.expected_salary.toLocaleString()}
              </Typography>
            )}
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.open(`/candidate/${candidate.id}`, '_blank')}
            >
              View Profile
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleAnalyzeMatch(candidate.id, selectedJobId)}
            >
              Analyze Match
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const MarketInsightsSection = () => (
    <Grid container spacing={3}>
      {/* Market Stats */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Market Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {marketInsights?.marketStats?.totalJobs || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Jobs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    ${(marketInsights?.marketStats?.avgSalary || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Salary
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {marketInsights?.marketStats?.remoteJobsPercentage || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remote Jobs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {marketInsights?.trendingSkills?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trending Skills
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Trending Skills */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Trending Skills
            </Typography>
            <List dense>
              {marketInsights?.trendingSkills?.slice(0, 10).map((skill, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={skill.skill}
                    secondary={`${skill.demand} job postings`}
                  />
                  <Chip 
                    label={`#${index + 1}`} 
                    size="small" 
                    color={index < 3 ? "primary" : "default"}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Salary Trends */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
              Salary Trends by Role
            </Typography>
            <List dense>
              {marketInsights?.salaryTrends?.slice(0, 10).map((trend, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={trend.role}
                    secondary={`${trend.jobCount} positions`}
                  />
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    ${trend.avgSalary.toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Locations */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Top Job Markets
            </Typography>
            <Grid container spacing={2}>
              {marketInsights?.topLocations?.map((location, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {location.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.jobCount} jobs
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">
          Smart Recommendations
        </Typography>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab 
          label="Job Recommendations" 
          icon={<Work />} 
          iconPosition="start"
        />
        <Tab 
          label="Candidate Recommendations" 
          icon={<Person />} 
          iconPosition="start"
        />
        <Tab 
          label="Market Insights" 
          icon={<Insights />} 
          iconPosition="start"
        />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Job Recommendations Tab */}
      {activeTab === 0 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>
                    Minimum Match Score: {minJobScore}%
                  </Typography>
                  <Slider
                    value={minJobScore}
                    onChange={(e, value) => setMinJobScore(value)}
                    min={50}
                    max={100}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Results Limit</InputLabel>
                    <Select
                      value={jobLimit}
                      onChange={(e) => setJobLimit(e.target.value)}
                      label="Results Limit"
                    >
                      <MenuItem value={5}>5 jobs</MenuItem>
                      <MenuItem value={10}>10 jobs</MenuItem>
                      <MenuItem value={20}>20 jobs</MenuItem>
                      <MenuItem value={50}>50 jobs</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={fetchJobRecommendations}
                    disabled={loading}
                    fullWidth
                  >
                    Refresh Recommendations
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={60} />
            </Box>
          ) : jobRecommendations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <EmojiObjects sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={2}>
                No job recommendations found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Try lowering the minimum match score or update your profile for better recommendations.
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/profile'}
              >
                Update Profile
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" mb={3}>
                {jobRecommendations.length} job{jobRecommendations.length !== 1 ? 's' : ''} recommended for you
              </Typography>
              {jobRecommendations.map((job) => (
                <JobRecommendationCard key={job.id} job={job} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Candidate Recommendations Tab */}
      {activeTab === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Select Job</InputLabel>
                    <Select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      label="Select Job"
                    >
                      <MenuItem value="">Select a job...</MenuItem>
                      {/* This would be populated with user's job postings */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" gutterBottom>
                    Minimum Match Score: {minCandidateScore}%
                  </Typography>
                  <Slider
                    value={minCandidateScore}
                    onChange={(e, value) => setMinCandidateScore(value)}
                    min={50}
                    max={100}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Results Limit</InputLabel>
                    <Select
                      value={candidateLimit}
                      onChange={(e) => setCandidateLimit(e.target.value)}
                      label="Results Limit"
                    >
                      <MenuItem value={5}>5 candidates</MenuItem>
                      <MenuItem value={10}>10 candidates</MenuItem>
                      <MenuItem value={20}>20 candidates</MenuItem>
                      <MenuItem value={50}>50 candidates</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={fetchCandidateRecommendations}
                    disabled={loading || !selectedJobId}
                    fullWidth
                  >
                    Find Candidates
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {!selectedJobId ? (
            <Box textAlign="center" py={8}>
              <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={2}>
                Select a job to find matching candidates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose one of your job postings to get AI-powered candidate recommendations.
              </Typography>
            </Box>
          ) : loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={60} />
            </Box>
          ) : candidateRecommendations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={2}>
                No matching candidates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try lowering the minimum match score or check back later for new candidates.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" mb={3}>
                {candidateRecommendations.length} candidate{candidateRecommendations.length !== 1 ? 's' : ''} found
              </Typography>
              {candidateRecommendations.map((candidate) => (
                <CandidateRecommendationCard key={candidate.id} candidate={candidate} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Market Insights Tab */}
      {activeTab === 2 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Market Insights & Trends
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchMarketInsights}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={60} />
            </Box>
          ) : marketInsights ? (
            <MarketInsightsSection />
          ) : (
            <Box textAlign="center" py={8}>
              <Assessment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={2}>
                No market data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Market insights will be available once there's sufficient data.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Match Analysis Dialog */}
      <Dialog 
        open={analysisDialog} 
        onClose={() => setAnalysisDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Match Analysis
        </DialogTitle>
        <DialogContent>
          {matchAnalysis && (
            <Box>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Candidate
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {matchAnalysis.candidate.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {matchAnalysis.candidate.title}
                    </Typography>
                    <Typography variant="body2">
                      {matchAnalysis.candidate.experience} years experience
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Job Position
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {matchAnalysis.job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {matchAnalysis.job.company}
                    </Typography>
                    <Typography variant="body2">
                      Min {matchAnalysis.job.min_experience} years experience
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box textAlign="center" mb={3}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {matchAnalysis.analysis.compatibilityScore}%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Compatibility Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={matchAnalysis.analysis.compatibilityScore}
                  color={getScoreColor(matchAnalysis.analysis.compatibilityScore)}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Strengths
                  </Typography>
                  <List dense>
                    {matchAnalysis.analysis.strengths.map((strength, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Concerns
                  </Typography>
                  <List dense>
                    {matchAnalysis.analysis.concerns.map((concern, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={concern} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom color="info.main">
                    <EmojiObjects sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Recommendations
                  </Typography>
                  <List dense>
                    {matchAnalysis.analysis.recommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

