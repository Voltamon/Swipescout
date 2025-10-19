import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  VideoLibrary as VideoIcon
} from '@mui/icons-material';

const EmptyState = ({
  icon: CustomIcon,
  title,
  description,
  actionText,
  onAction,
  variant = 'default',
  size = 'medium'
}) => {
  const theme = useTheme();

  const getDefaultIcon = () => {
    switch (variant) {
      case 'search': return SearchIcon;
      case 'jobs': return WorkIcon;
      case 'people': return PeopleIcon;
      case 'videos': return VideoIcon;
      default: return InboxIcon;
    }
  };

  const Icon = CustomIcon || getDefaultIcon();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 48,
          titleVariant: 'h6',
          descriptionVariant: 'body2',
          padding: 3
        };
      case 'large':
        return {
          iconSize: 80,
          titleVariant: 'h4',
          descriptionVariant: 'h6',
          padding: 6
        };
      default:
        return {
          iconSize: 64,
          titleVariant: 'h5',
          descriptionVariant: 'body1',
          padding: 4
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: sizeStyles.padding,
        px: 2,
        minHeight: size === 'large' ? 400 : size === 'small' ? 200 : 300
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400
        }}
      >
        <Box
          sx={{
            width: sizeStyles.iconSize + 16,
            height: sizeStyles.iconSize + 16,
            borderRadius: '50%',
            backgroundColor: theme.palette.grey[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            ...(theme.palette.mode === 'dark' && {
              backgroundColor: theme.palette.grey[800]
            })
          }}
        >
          <Icon
            sx={{
              fontSize: sizeStyles.iconSize,
              color: theme.palette.grey[400]
            }}
          />
        </Box>

        <Typography
          variant={sizeStyles.titleVariant}
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant={sizeStyles.descriptionVariant}
            color="text.secondary"
            sx={{
              mb: 3,
              lineHeight: 1.6,
              maxWidth: 350
            }}
          >
            {description}
          </Typography>
        )}

        {actionText && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
            size={size === 'small' ? 'small' : 'medium'}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            {actionText}
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default EmptyState;
