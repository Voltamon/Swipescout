import React, { useContext, useState  } from 'react';
import { Box, Skeleton } from '@mui/material';
import { useLazyImage } from '../hooks/useIntersectionObserver';

const LazyImage = ({
  src,
  alt,
  width,
  height,
  sx = {},
  skeletonProps = {},
  onLoad,
  onError,
  ...props
}) => {
  const [ref, imageSrc, isLoaded] = useLazyImage(src);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (event) => {
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    setHasError(true);
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
        ...sx,
      }}
      {...props}
    >
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          {...skeletonProps}
        />
      )}
      
      {imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isLoaded ? 'block' : 'none',
          }}
        />
      )}
      
      {hasError && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
            color: 'grey.500',
            fontSize: '0.875rem',
          }}
        >
          Failed to load image
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;

