# Videos Page - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (if not already installed)

```bash
# Install required packages
npm install lucide-react @radix-ui/react-scroll-area class-variance-authority clsx tailwind-merge

# Or with yarn
yarn add lucide-react @radix-ui/react-scroll-area class-variance-authority clsx tailwind-merge
```

### Step 2: Verify Configuration

**Check `tailwind.config.js`:**
```bash
# Should include your content paths
content: ["./src/**/*.{js,jsx,ts,tsx}"]
```

**Check `vite.config.js` or your bundler config:**
```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Step 3: Run the Application

```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:5173/videos` (or your videos route)

---

## 🎨 Quick Customization Guide

### Change Primary Color

**File: `tailwind.config.js`**
```js
theme: {
  extend: {
    colors: {
      purple: {
        // Your custom purple shades
        500: '#your-color',
        600: '#your-darker-color',
      }
    }
  }
}
```

### Change Background Gradient

**File: `src/pages/Videos.jsx`**
```jsx
// Find SwipeScoutBackground component
<div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" />

// Change to:
<div className="absolute inset-0 bg-gradient-to-br from-[#yourcolor] via-[#yourcolor2] to-[#yourcolor3]" />
```

### Adjust Card Transparency

**File: `src/pages/Videos.jsx`**
```jsx
// Find Card components
<Card className="bg-white/10 backdrop-blur-md border-white/20">

// More opaque:
<Card className="bg-white/20 backdrop-blur-lg border-white/30">

// Less opaque:
<Card className="bg-white/5 backdrop-blur-sm border-white/10">
```

### Change Button Hover Effects

**File: `src/pages/Videos.jsx`**
```jsx
// Find Button components
className="hover:scale-110 transition-all"

// Bigger scale:
className="hover:scale-125 transition-all"

// Add rotation:
className="hover:scale-110 hover:rotate-6 transition-all"

// Change duration:
className="hover:scale-110 transition-all duration-500"
```

---

## 🔧 Common Tasks

### Add a New Action Button

```jsx
// In the action buttons section (right panel)
<div className="flex flex-col items-center gap-1">
  <Button
    size="icon"
    variant="ghost"
    onClick={() => handleYourAction(video.id)}
    className="rounded-full transition-all hover:scale-110 text-white hover:bg-white/20"
    aria-label="your-action"
  >
    <YourIcon className="h-6 w-6" />
  </Button>
  <span className="text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded-full">
    {yourCount}
  </span>
</div>
```

### Add a Video Overlay Element

```jsx
// Inside the video container div
<div className="absolute top-4 left-4 z-10">
  <Badge variant="secondary" className="bg-black/60 text-white">
    Your Label
  </Badge>
</div>
```

### Modify Comment Input Styling

```jsx
// Find the comment input
<input
  className="flex-1 px-3 py-2 text-sm rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
  // Change focus ring color:
  // focus:ring-blue-500
  // focus:ring-pink-500
/>
```

---

## 🐛 Troubleshooting

### Issue: Styles not showing

**Solution:**
```bash
# 1. Clear cache
rm -rf node_modules/.vite

# 2. Restart dev server
npm run dev
```

### Issue: Icons not displaying

**Solution:**
```bash
# Verify lucide-react is installed
npm list lucide-react

# Reinstall if needed
npm install lucide-react --force
```

### Issue: Path alias not working

**Solution:**
Check these files have the alias configured:
- `vite.config.js` or `webpack.config.js`
- `jsconfig.json` or `tsconfig.json`

```js
// vite.config.js
import path from 'path'
export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

### Issue: Glass effect not working

**Solution:**
Some browsers need vendor prefixes. Add to your CSS:
```css
.backdrop-blur-md {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
```

### Issue: Animations janky

**Solution:**
```jsx
// Use transform for better performance
className="hover:scale-110 transition-transform"
// instead of
className="hover:scale-110 transition-all"
```

---

## 📱 Testing on Mobile

### Using Browser DevTools
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device
4. Test touch interactions

### Using Real Device
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from mobile: `http://YOUR_IP:5173/videos`
3. Test gestures and performance

---

## 🎯 Performance Tips

### Optimize Images/Videos
```jsx
// Use lazy loading
<video 
  loading="lazy"
  preload="metadata"
  poster={thumbnail}
/>
```

### Reduce Bundle Size
```bash
# Analyze bundle
npm run build -- --analyze

# Remove unused dependencies
npm prune
```

### Improve Initial Load
```jsx
// Use dynamic imports for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/pages/Videos.jsx` | Main component |
| `src/components/ui/button.jsx` | Button component |
| `src/components/ui/card.jsx` | Card component |
| `src/components/ui/avatar.jsx` | Avatar component |
| `src/components/ui/badge.jsx` | Badge component |
| `src/components/ui/scroll-area.jsx` | Scroll area |
| `src/lib/utils.js` | Utility functions (cn) |
| `src/index.css` | Global styles |
| `tailwind.config.js` | Tailwind config |

---

## 🔗 Useful Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Radix UI](https://www.radix-ui.com)

---

## 💡 Pro Tips

### 1. Use cn() for Conditional Classes
```jsx
import { cn } from '@/lib/utils';

className={cn(
  "base-classes",
  isActive && "active-classes",
  condition ? "true-classes" : "false-classes"
)}
```

### 2. Customize with Arbitrary Values
```jsx
className="bg-[#your-exact-color] p-[17px] w-[calc(100%-50px)]"
```

### 3. Use Tailwind Variants
```jsx
className="hover:bg-blue-500 focus:ring-2 active:scale-95 disabled:opacity-50"
```

### 4. Debug with Outline
```jsx
// Temporarily add this to see layout
className="outline outline-red-500"
```

### 5. Copy from shadcn/ui
Visit [ui.shadcn.com](https://ui.shadcn.com) and copy any component you need.

---

## 🚢 Ready to Deploy?

1. Run production build: `npm run build`
2. Test production build: `npm run preview`
3. Check bundle size: `ls -lh dist/assets/`
4. Run lighthouse: Open DevTools > Lighthouse
5. Deploy: `vercel` or `netlify deploy`

---

## 🆘 Need Help?

1. Check the comparison docs: `VIDEOS_BEFORE_AFTER_COMPARISON.md`
2. Review component reference: `VIDEOS_COMPONENT_REFERENCE.md`
3. See testing guide: `VIDEOS_TESTING_DEPLOYMENT_GUIDE.md`
4. Open an issue on GitHub
5. Ask in team Slack channel

---

**Happy coding! 🎉**
