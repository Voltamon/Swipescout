# Videos Page - Testing & Deployment Guide

## Pre-Deployment Checklist

### 1. Verify Dependencies
Ensure these packages are installed:

```bash
npm install lucide-react
npm install @radix-ui/react-scroll-area
npm install class-variance-authority
npm install clsx tailwind-merge
```

Check `package.json` includes:
```json
{
  "dependencies": {
    "lucide-react": "^0.x.x",
    "@radix-ui/react-scroll-area": "^1.x.x",
    "clsx": "^2.x.x",
    "tailwind-merge": "^2.x.x"
  }
}
```

### 2. Verify Tailwind Configuration

**File**: `tailwind.config.js`
```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your theme extensions
    },
  },
  plugins: [],
}
```

### 3. Verify Path Aliases

**File**: `jsconfig.json` or `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**File**: `vite.config.js`
```js
import path from 'path'

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

## Testing Procedures

### Manual Testing Checklist

#### Video Playback
- [ ] Videos autoplay when scrolled into view
- [ ] Videos pause when scrolled out of view
- [ ] Play/pause toggle works by clicking video
- [ ] Mute/unmute toggle works
- [ ] Video loops correctly
- [ ] Poster image shows before video loads

#### Navigation
- [ ] Arrow up button goes to previous video
- [ ] Arrow down button goes to next video
- [ ] Mouse wheel scroll navigates videos
- [ ] Touch swipe navigates videos (mobile)
- [ ] Keyboard arrow keys work
- [ ] Scroll snap behavior is smooth

#### Interactions
- [ ] Like button toggles state
- [ ] Like count updates correctly
- [ ] Unlike works correctly
- [ ] Comment button opens/closes panel
- [ ] Comments load properly
- [ ] Comment submission works
- [ ] Comment count updates
- [ ] Share button opens popup
- [ ] Save button toggles state
- [ ] Save label appears/disappears

#### Maximize Mode
- [ ] Maximize button enters fullscreen mode
- [ ] Video centers and scales properly
- [ ] Action buttons remain accessible
- [ ] Comments panel hides
- [ ] Exit maximize returns to normal
- [ ] Maximize works in mobile view

#### Responsive Design
- [ ] Layout adapts on mobile (< 768px)
- [ ] Layout adapts on tablet (768-1024px)
- [ ] Layout adapts on desktop (> 1024px)
- [ ] All buttons are touch-friendly
- [ ] Text remains readable at all sizes
- [ ] No horizontal scroll on mobile

#### Comments Section
- [ ] Comments list scrolls smoothly
- [ ] Loading spinner shows while fetching
- [ ] Avatar fallbacks work
- [ ] Comment input accepts text
- [ ] Enter key submits comment
- [ ] Submit button works
- [ ] "Submitting..." state shows correctly
- [ ] New comment appears in list

#### Error States
- [ ] Loading spinner shows on initial load
- [ ] Error message displays correctly
- [ ] "Try Again" button refetches data
- [ ] "Go Home" button navigates away
- [ ] Empty state shows when no videos

#### Performance
- [ ] Page loads quickly (< 3s)
- [ ] Scrolling is smooth (60fps)
- [ ] No janky animations
- [ ] Videos load progressively
- [ ] No memory leaks on long sessions
- [ ] Browser doesn't freeze

### Automated Testing (Optional)

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# E2E tests (if configured)
npm run test:e2e
```

### Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Deployment Steps

### 1. Build the Application

```bash
# Clean install dependencies
npm ci

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### 2. Verify Build Output

Check `dist/` folder contains:
- `index.html`
- `assets/` folder with chunked JS/CSS
- All CSS is purged and minified
- Bundle size is acceptable

### 3. Deploy to Hosting

#### Vercel
```bash
vercel --prod
```

#### Netlify
```bash
netlify deploy --prod
```

#### Other Hosts
Upload `dist/` folder contents to your web server.

### 4. Post-Deployment Verification

- [ ] Visit production URL
- [ ] Check console for errors
- [ ] Verify videos load
- [ ] Test key interactions
- [ ] Check mobile responsiveness
- [ ] Verify API calls work
- [ ] Check analytics tracking

## Performance Monitoring

### Key Metrics to Track

1. **Lighthouse Score**
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

2. **Core Web Vitals**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

3. **Bundle Size**
   - Total JS: < 500KB (gzipped)
   - Total CSS: < 50KB (gzipped)
   - First Load: < 3s on 3G

### Optimization Tips

```bash
# Analyze bundle
npm run build -- --analyze

# Check unused CSS
npx purgecss --css dist/assets/*.css --content dist/**/*.html
```

## Troubleshooting

### Issue: Videos don't autoplay
**Solution**: Ensure videos start muted (browser policy)

### Issue: Styles not applied
**Solution**: Check Tailwind content paths include all component files

### Issue: Icons not showing
**Solution**: Verify lucide-react is installed

### Issue: Path aliases not resolving
**Solution**: Check jsconfig.json and vite.config.js

### Issue: Glass-morphism not visible
**Solution**: Ensure backdrop-blur is supported (may need -webkit- prefix)

### Issue: Scroll snap not working
**Solution**: Check browser support, may need fallback

### Issue: Performance issues
**Solutions**:
- Enable lazy loading for videos
- Reduce video quality/size
- Implement virtual scrolling
- Use video CDN
- Optimize images

## Rollback Plan

If issues occur after deployment:

1. **Immediate**: Revert to previous deployment
2. **Quick Fix**: Hot-patch critical bugs
3. **Full Rollback**: Restore previous version from Git

```bash
# Git rollback
git revert HEAD
git push origin main

# Redeploy
npm run build && vercel --prod
```

## Monitoring & Alerts

Set up monitoring for:
- Error rate (< 1%)
- Page load time (< 3s)
- API response time (< 500ms)
- User engagement metrics

### Recommended Tools
- Sentry (error tracking)
- Google Analytics (user behavior)
- Lighthouse CI (performance)
- LogRocket (session replay)

## Maintenance Schedule

### Daily
- Check error logs
- Monitor performance metrics

### Weekly
- Review user feedback
- Check for dependency updates

### Monthly
- Security audit
- Performance optimization review
- Update dependencies

## Support Resources

### Documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [React Docs](https://react.dev)

### Team Contacts
- Frontend Lead: [Name/Email]
- Backend Lead: [Name/Email]
- DevOps: [Name/Email]

---

## Success Criteria

Deployment is considered successful when:
- ✅ All manual tests pass
- ✅ Lighthouse score > 90
- ✅ Zero critical errors
- ✅ API calls functioning
- ✅ Mobile experience smooth
- ✅ User engagement stable/improved
- ✅ Performance metrics within targets

**Good luck with your deployment! 🚀**
