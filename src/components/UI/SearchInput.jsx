import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Box,
  Typography,
  Chip,
  Paper,
  Popper,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'البحث...',
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  showSuggestions = true,
  showHistory = true,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  debounceMs = 300,
  maxSuggestions = 5,
  onSuggestionClick,
  disabled = false
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onChange?.(inputValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, onChange, value]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue || '');
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch?.(inputValue.trim());
      setOpen(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange?.(suggestion);
    onSuggestionClick?.(suggestion);
    setOpen(false);
  };

  const combinedOptions = [
    ...recentSearches.slice(0, 3).map(item => ({ type: 'recent', value: item })),
    ...trendingSearches.slice(0, 3).map(item => ({ type: 'trending', value: item })),
    ...suggestions.slice(0, maxSuggestions).map(item => ({ type: 'suggestion', value: item }))
  ];

  const CustomPopper = (props) => (
    <Popper
      {...props}
      style={{ width: props.anchorEl?.clientWidth }}
      placement="bottom-start"
    />
  );

  const renderOption = (props, option) => (
    <Box
      component="li"
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 1,
        px: 2,
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        }
      }}
    >
      {option.type === 'recent' && (
        <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      )}
      {option.type === 'trending' && (
        <TrendingIcon sx={{ fontSize: 16, color: 'warning.main' }} />
      )}
      {option.type === 'suggestion' && (
        <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      )}
      
      <Typography variant="body2" sx={{ flex: 1 }}>
        {option.value}
      </Typography>
      
      {option.type === 'trending' && (
        <Chip label="رائج" size="small" color="warning" variant="outlined" />
      )}
    </Box>
  );

  return (
    <Autocomplete
      freeSolo
      open={open && combinedOptions.length > 0}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={combinedOptions}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.value}
      filterOptions={(options) => options} // Don't filter, show all
      PopperComponent={CustomPopper}
      renderOption={renderOption}
      disabled={disabled}
      loading={loading}
      PaperComponent={({ children, ...props }) => (
        <Paper
          {...props}
          sx={{
            mt: 1,
            boxShadow: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2
          }}
        >
          {showHistory && (recentSearches.length > 0 || trendingSearches.length > 0) && (
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                البحث الأخير والرائج
              </Typography>
            </Box>
          )}
          {children}
        </Paper>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          onKeyPress={handleKeyPress}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {inputValue && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={handleSearch}
                  disabled={!inputValue.trim()}
                  edge="end"
                  color="primary"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          }}
        />
      )}
    />
  );
};

export default SearchInput;
