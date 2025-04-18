import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container,
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Work as WorkIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { 
  getJobSeekerDashboardStats, 
  getRecentActivities,
  getJobRecommendations
} from '../services/dashboardService';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// تسجيل مكونات ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: 'calc(100vh - 56px)',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatsCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flex: 1,
}));

const StatsIcon = styled(Box)(({ theme, color }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette[color].light,
  color: theme.palette[color].main,
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // جلب إحصائيات لوحة التحكم
        const statsResponse = await getJobSeekerDashboardStats();
        setStats(statsResponse.data.stats);
        
        // جلب الأنشطة الأخيرة
        const activitiesResponse = await getRecentActivities();
        setActivities(activitiesResponse.data.activities);
        
        // جلب توصيات الوظائف
        const recommendationsResponse = await getJobRecommendations();
        setRecommendations(recommendationsResponse.data.recommendations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // بيانات مخطط النشاط
  const activityChartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'مشاهدات الملف الشخصي',
        data: stats?.profile_views_chart || [12, 19, 15, 25, 22, 30],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // بيانات مخطط السحب
  const swipeChartData = {
    labels: ['إعجاب', 'تخطي', 'رفض'],
    datasets: [
      {
        data: stats?.swipe_stats || [65, 20, 15],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // بيانات مخطط المهارات
  const skillsChartData = {
    labels: stats?.skills_chart?.map(skill => skill.name) || ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS'],
    datasets: [
      {
        label: 'مستوى المهارة',
        data: stats?.skills_chart?.map(skill => skill.level) || [85, 90, 75, 95, 80],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardContainer maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">لوحة التحكم</Typography>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayCircleOutlineIcon />}
            sx={{ mr: 1 }}
          >
            تحميل فيديو السيرة الذاتية
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
          >
            إضافة مهارات
          </Button>
        </Box>
      </Box>
      
      {/* بطاقات الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon color="primary">
                <VisibilityIcon fontSize="large" />
              </StatsIcon>
              <Typography variant="h4" gutterBottom>
                {stats?.profile_views || 0}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                مشاهدات الملف الشخصي
              </Typography>
            </StatsCardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon color="success">
                <ThumbUpIcon fontSize="large" />
              </StatsIcon>
              <Typography variant="h4" gutterBottom>
                {stats?.matches || 0}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                المطابقات
              </Typography>
            </StatsCardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon color="warning">
                <WorkIcon fontSize="large" />
              </StatsIcon>
              <Typography variant="h4" gutterBottom>
                {stats?.applications || 0}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                طلبات التقديم
              </Typography>
            </StatsCardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <StatsCardContent>
              <StatsIcon color="info">
                <MessageIcon fontSize="large" />
              </StatsIcon>
              <Typography variant="h4" gutterBottom>
                {stats?.unread_messages || 0}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                الرسائل غير المقروءة
              </Typography>
            </StatsCardContent>
          </StatsCard>
        </Grid>
      </Grid>
      
      {/* المخططات والتوصيات */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              نشاط الملف الشخصي
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={activityChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  إحصائيات السحب
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Doughnut 
                    data={swipeChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  مستوى المهارات
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Bar 
                    data={skillsChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                الأنشطة الأخيرة
              </Typography>
              <IconButton size="small">
                <NotificationsIcon />
              </IconButton>
            </Box>
            
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {activities.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="لا توجد أنشطة حديثة" 
                    secondary="ستظهر أنشطتك هنا عند التفاعل مع التطبيق" 
                  />
                </ListItem>
              ) : (
                activities.map((activity, index) => (
                  <ActivityItem key={index}>
                    <ListItemIcon>
                      {activity.type === 'view' && <VisibilityIcon color="primary" />}
                      {activity.type === 'match' && <ThumbUpIcon color="success" />}
                      {activity.type === 'application' && <WorkIcon color="warning" />}
                      {activity.type === 'message' && <MessageIcon color="info" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.title} 
                      secondary={activity.time} 
                    />
                  </ActivityItem>
                ))
              )}
            </List>
          </Paper>
          
          <Paper>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                وظائف موصى بها
              </Typography>
              <Button 
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                عرض الكل
              </Button>
            </Box>
            
            <List sx={{ maxHeight: 350, overflow: 'auto' }}>
              {recommendations.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="لا توجد توصيات حالياً" 
                    secondary="ستظهر التوصيات هنا بناءً على مهاراتك واهتماماتك" 
                  />
                </ListItem>
              ) : (
                recommendations.map((job, index) => (
                  <React.Fragment key={job.id}>
                    <ListItem 
                      button
                      sx={{ py: 2 }}
                    >
                      <Avatar 
                        src={job.company.logo_url} 
                        sx={{ mr: 2 }}
                      />
                      <ListItemText 
                        primary={job.title} 
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span">
                              {job.company.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                              <Typography variant="body2" component="span" color="textSecondary">
                                {job.location}
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                      <Box>
                        <Chip 
                          label={job.match_percentage + '%'} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                    </ListItem>
                    {index < recommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* قسم النصائح والتحسينات */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          نصائح لتحسين فرصك
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    أكمل ملفك الشخصي
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  الملفات الشخصية المكتملة تحصل على اهتمام أكبر من أصحاب العمل.
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats?.profile_completion || 75} 
                  sx={{ mt: 2 }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}>
                  {stats?.profile_completion || 75}% مكتمل
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PlayCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    أضف فيديو السيرة الذاتية
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  الفيديو يزيد من فرص المطابقة بنسبة 70% ويجعلك تبرز بين المرشحين.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  تحميل فيديو
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    حدّث مهاراتك
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  أضف المهارات الأكثر طلباً في مجالك لزيادة فرص ظهورك في نتائج البحث.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  إضافة مهارات
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </DashboardContainer>
  );
};

export default JobSeekerDashboard;
