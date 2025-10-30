import React, { useContext, useState, useRef, useEffect  } from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, VolumeOff, VolumeUp } from '@mui/icons-material';
import { useLazyVideo } from '../hooks/useIntersectionObserver';

const LazyVideo = ({
  src,
  poster,
  width = '100%',
  height = '100%',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  preload = 'metadata',
  sx = {},
  onPlay,
  onPause,
  onLoadStart,
  onLoadedData,
  onError,
  showPlayButton = true,
  showVolumeButton = true,
  ...props
}) => {
  const videoRef = useRef(null);
  const [ref, shouldLoad, isVisible] = useLazyVideo(src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Auto play when visible and autoPlay is enabled
    if (isVisible && autoPlay && shouldLoad) {
      video.play().catch(() => {
        // Auto play failed, which is normal in many browsers
      });
    } else if (!isVisible && isPlaying) {
      video.pause();
    }
  }, [isVisible, autoPlay, shouldLoad, isPlaying]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const handleVolumeToggle = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoPlay = (event) => {
    setIsPlaying(true);
    if (onPlay) onPlay(event);
  };

  const handleVideoPause = (event) => {
    setIsPlaying(false);
    if (onPause) onPause(event);
  };

  const handleLoadStart = (event) => {
    setIsLoading(true);
    if (onLoadStart) onLoadStart(event);
  };

  const handleLoadedData = (event) => {
    setIsLoading(false);
    if (onLoadedData) onLoadedData(event);
  };

  const handleError = (event) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(event);
  };

  return (
    <Box
      ref={ref}
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...props}
    >
      {shouldLoad && !hasError ? (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            width="100%"
            height="100%"
            muted={isMuted}
            loop={loop}
            controls={controls}
            preload={preload}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onLoadStart={handleLoadStart}
            onLoadedData={handleLoadedData}
            onError={handleError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <CircularProgress size={40} sx={{ color: 'white' }} />
            </Box>
          )}
          
          {/* Custom controls overlay */}
          {!controls && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 3,
              }}
            >
              {showPlayButton && (
                <IconButton
                  onClick={handlePlay}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
              )}
              
              {showVolumeButton && (
                <IconButton
                  onClick={handleVolumeToggle}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
              )}
            </Box>
          )}
        </>
      ) : hasError ? (
        <Box
          sx={{
            color: 'white',
            textAlign: 'center',
            p: 2,
          }}
        >
          Failed to load video
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.900',
          }}
        >
          {poster ? (
            <img
              src={poster}
              alt="Video poster"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box sx={{ color: 'grey.500' }}>
              Video will load when visible
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LazyVideo;

