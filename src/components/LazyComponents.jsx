import React, { useContext, lazy, Suspense  } from 'react';
import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';

// Lazy load heavy components
export const LazyAllVideosPage = lazy(() => import('../pages/AllVideosPage'));
export const LazyJobSearchPage = lazy(() => import('../pages/JobSearchPage'));
export const LazyCandidateSearchPage = lazy(() => import('../pages/CandidateSearchPage'));
export const LazyVideoEditPage = lazy(() => import('../pages/VideoEditPage'));
export const LazyResumeBuilderPage = lazy(() => import('../pages/ResumeBuilderPage'));
export const LazyPricingPage = lazy(() => import('../pages/PricingPage'));
export const LazyInterviewPage = lazy(() => import('../pages/InterviewPage'));
export const LazyCompanyVideos = lazy(() => import('../pages/CompanyVideos'));
export const LazySavedVideosPage = lazy(() => import('../pages/SavedVideosPage'));
export const LazyLikedVideosPage = lazy(() => import('../pages/LikedVideosPage'));
export const LazyNotificationSettingsPage = lazy(() => import('../pages/NotificationSettingsPage'));

// Loading fallback components
export const PageLoadingFallback = ({ height = '400px' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height,
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

export const VideoGridSkeleton = ({ count = 6 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, p: 2 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </Box>
    ))}
  </Box>
);

export const VideoPlayerSkeleton = () => (
  <Box sx={{ width: '100%', height: '100vh', bgcolor: 'black', position: 'relative' }}>
    <Skeleton variant="rectangular" width="100%" height="100%" />
    <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
      <Skeleton variant="text" width="70%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" />
    </Box>
  </Box>
);

export const TabContentSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index}>
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1, mb: 1 }} />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="70%" />
        </Box>
      ))}
    </Box>
  </Box>
);

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = (LazyComponent, fallback = <PageLoadingFallback />) => {
  return React.forwardRef((props, ref) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Error boundary for lazy components
export class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            gap: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" color="error">
            Failed to load component
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please refresh the page or try again later.
          </Typography>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: '#f5f5f5',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </Box>
      );
    }

    return this.props.children;
  }
}

