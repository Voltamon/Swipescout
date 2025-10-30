import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  Box,
  Collapse,
  List
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({
  icon: Icon,
  text,
  path,
  badge,
  chip,
  children,
  onClick,
  disabled = false,
  divider = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  
  const isActive = location.pathname === path || 
    (children && children.some(child => location.pathname === child.path));
  
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (disabled) return;
    
    if (hasChildren) {
      setOpen(!open);
    } else if (path) {
      navigate(path);
    } else if (onClick) {
      onClick();
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    const iconElement = <Icon sx={{ color: isActive ? 'primary.main' : 'inherit' }} />;
    
    if (badge) {
      return (
        <Badge badgeContent={badge} color="error">
          {iconElement}
        </Badge>
      );
    }
    
    return iconElement;
  };

  const renderText = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <ListItemText 
        primary={text}
        sx={{
          '& .MuiListItemText-primary': {
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'primary.main' : 'inherit'
          }
        }}
      />
      {chip && (
        <Chip 
          label={chip} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ ml: 1 }}
        />
      )}
      {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
    </Box>
  );

  return (
    <>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={handleClick}
          disabled={disabled}
          sx={{
            minHeight: 48,
            px: 2.5,
            borderRadius: 2,
            mx: 1,
            mb: 0.5,
            backgroundColor: isActive ? 'primary.light' : 'transparent',
            '&:hover': {
              backgroundColor: isActive ? 'primary.light' : 'action.hover',
            },
            '&.Mui-disabled': {
              opacity: 0.5
            }
          }}
        >
          {Icon && (
            <ListItemIcon sx={{ minWidth: 40 }}>
              {renderIcon()}
            </ListItemIcon>
          )}
          {renderText()}
        </ListItemButton>
      </ListItem>
      
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {children.map((child, index) => (
              <SidebarItem
                key={index}
                icon={child.icon}
                text={child.text}
                path={child.path}
                badge={child.badge}
                chip={child.chip}
                onClick={child.onClick}
                disabled={child.disabled}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarItem;
