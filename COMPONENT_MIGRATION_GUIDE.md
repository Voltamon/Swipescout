# Component Migration Guide: MUI → Tailwind CSS + shadcn/ui

## Quick Reference

### Before and After Examples

#### 1. Header Component
**Key Changes:**
- Removed: `AppBar`, `Toolbar`, `useTheme()`, `useMediaQuery()`
- Added: Simple HTML header with Tailwind classes
- User menu: Custom dropdown (no MUI Menu)
- Responsive: Tailwind's `hidden md:flex` instead of `display: { xs: 'none', md: 'flex' }`

**Old Pattern:**
```jsx
<StyledAppBar position="sticky">
  <StyledToolbar>
    {/* Content with sx={{}} props */}
  </StyledToolbar>
</StyledAppBar>
```

**New Pattern:**
```jsx
<header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Tailwind classes directly */}
  </div>
</header>
```

#### 2. Footer Component
**Key Changes:**
- Removed: `Grid`, `useTheme()`, styled components
- Added: CSS Grid with Tailwind (`grid grid-cols-1 md:grid-cols-3`)
- Social links: Lucide icons + Tailwind hover effects

**Old Pattern:**
```jsx
<Grid container spacing={isMobile ? 2 : 4}>
  <Grid item xs={12} sm={4}>
    <Typography variant="h6">{text}</Typography>
  </Grid>
</Grid>
```

**New Pattern:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div>
    <h3 className="text-lg font-bold">{text}</h3>
  </div>
</div>
```

#### 3. Theme Integration
**Old Pattern:**
```jsx
const theme = useTheme();
sx={{
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper
}}
```

**New Pattern:**
```jsx
import { homeThemeColors } from "@/config/theme-colors-home";

className={`
  text-indigo-600 dark:text-indigo-400
  ${homeThemeColors.backgrounds.card}
`}
```

## Color Mapping

### homeThemeColors Usage

```javascript
// From theme-colors-home.js

// Direct colors
homeThemeColors.brand.primary        // "indigo-600"
homeThemeColors.brand.secondary      // "blue-600"

// Gradients (CSS class names)
homeThemeColors.gradients.header     // "from-indigo-600 via-purple-600 to-blue-600"
homeThemeColors.text.gradient        // "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"

// Pre-made class strings
homeThemeColors.backgrounds.page     // "bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50"
homeThemeColors.borders.default      // "border-slate-200 dark:border-slate-700"
homeThemeColors.text.link           // "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
```

## Responsive Design

### MUI Pattern
```jsx
sx={{ 
  display: { xs: 'none', md: 'flex' },
  gap: { xs: 2, md: 4 },
  padding: { xs: 1, md: 3 }
}}
```

### Tailwind Pattern
```jsx
className="hidden md:flex gap-2 md:gap-4 p-1 md:p-3"
```

## Dark Mode

### MUI Pattern
```jsx
sx={{ color: theme.palette.text.primary }}
```

### Tailwind Pattern
```jsx
className="text-gray-900 dark:text-white"
```

## Common Tailwind Classes Used

| Purpose | Class |
|---------|-------|
| Sticky Header | `sticky top-0 z-50` |
| Rounded Cards | `rounded-lg` |
| Shadows | `shadow-md`, `shadow-lg`, `hover:shadow-xl` |
| Gradients | `bg-gradient-to-r from-X to-Y` |
| Flex Layouts | `flex items-center gap-4` |
| Grid Layouts | `grid grid-cols-1 md:grid-cols-3 gap-6` |
| Spacing | `px-4 py-2 mx-auto my-8` |
| Borders | `border border-gray-200` |
| Text Styling | `font-bold text-lg text-gray-900` |
| Transitions | `transition-all duration-200 hover:scale-110` |

## Icon Migration

### MUI Icons → Lucide React
```jsx
// Old
import { Settings, Logout, Dashboard } from '@mui/icons-material';
<Settings />

// New
import { Settings, LogOut, LayoutDashboard } from 'lucide-react';
<Settings size={20} />
<LogOut size={20} />
<LayoutDashboard size={20} />
```

## Forms and Inputs

### Using shadcn/ui components (already in place)
```jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// These components combine shadcn/ui with Tailwind
<Button className="bg-indigo-600 hover:bg-indigo-700">Click me</Button>
```

## Testing Checklist After Migration

- [ ] No console errors
- [ ] Mobile layout responsive
- [ ] Tablet layout responsive
- [ ] Desktop layout responsive
- [ ] Dark mode applies correctly
- [ ] Hover states work
- [ ] Colors match theme-colors-home
- [ ] No MUI theme errors

## Files Already Migrated

✅ `/src/components/Headers/Footer.jsx`  
✅ `/src/components/Headers/Header.jsx`  
✅ `/src/pages/About/About.jsx`  

## Files to Migrate (if using MUI)

- [ ] Other pages using MUI components
- [ ] Custom components using styled-components with MUI theme
- [ ] Any components with `useTheme()` or `useMediaQuery()`

## Getting Started with a New Component

1. **Remove MUI imports:**
   ```jsx
   // Remove these
   import { Box, Typography, styled } from '@mui/material';
   ```

2. **Add Tailwind and theme imports:**
   ```jsx
   import { homeThemeColors } from "@/config/theme-colors-home";
   ```

3. **Replace components:**
   ```jsx
   // Old: <Box sx={{ display: 'flex', gap: 2 }}>
   // New:
   <div className="flex gap-2">
   ```

4. **Use theme colors:**
   ```jsx
   className={`${homeThemeColors.backgrounds.card} border ${homeThemeColors.borders.default}`}
   ```

5. **Test responsive:**
   - Use Chrome DevTools
   - Test at: 375px, 768px, 1024px, 1440px

---

For more details, see `REFACTOR_SUMMARY.md`
