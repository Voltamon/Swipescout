# Videos Page - Component Reference

## Quick Reference Guide for the Redesigned Videos Page

### Color Palette
```
Primary Gradient: Purple (900) → Indigo (900) → Blue (900)
Accent Colors:
  - Like (active): Red 500
  - Save (active): Purple 400
  - Text: White / Gray 200-300
  - Cards: White with 10% opacity + backdrop blur
  - Badges: Black 40% opacity
```

### Component Structure

```
Videos (Main Component)
├── SwipeScoutBackground (Animated gradient)
├── Container (Scrollable)
│   └── VideoCard (for each video)
│       ├── Left Panel (Comments + Info)
│       │   ├── Comments Card (if toggled)
│       │   │   ├── ScrollArea
│       │   │   ├── Comment List
│       │   │   └── Input Section
│       │   └── Video Info Card
│       │       ├── Title
│       │       ├── Hashtags
│       │       └── Views
│       ├── Center Panel (Video Player)
│       │   ├── Video Element
│       │   ├── Sample Badge
│       │   ├── Maximize Button
│       │   └── Mute Button
│       └── Right Panel (Actions)
│           ├── Previous Button
│           ├── Like Button + Count
│           ├── Comment Button + Count
│           ├── Share Button + Count
│           ├── Save Button + Label
│           └── Next Button
└── ToastContainer
```

### Key Classes Used

#### Layout
```jsx
// Container
className="min-h-screen overflow-y-auto scroll-smooth relative z-10"

// Video Card Wrapper
className="w-full min-h-screen flex justify-center items-center relative"

// Three Column Layout
className="w-full max-w-7xl flex gap-4 items-stretch px-4 md:px-6 flex-col md:flex-row"
```

#### Cards (Glass-morphism)
```jsx
className="bg-white/10 backdrop-blur-md border-white/20"
```

#### Buttons
```jsx
// Ghost button with hover scale
className="rounded-full transition-all hover:scale-110 text-white hover:bg-white/20"

// Active state (like/save)
className={cn(
  "rounded-full transition-all hover:scale-110",
  isActive ? "text-red-500 hover:bg-red-500/20" : "text-white hover:bg-white/20"
)}
```

#### Stats Badges
```jsx
className="text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded-full"
```

### Responsive Breakpoints

```jsx
// Mobile first approach
className="w-full md:w-80"           // Full width on mobile, 320px on desktop
className="flex-col md:flex-row"     // Column on mobile, row on desktop
className="px-4 md:px-6"            // Less padding on mobile
className="text-sm md:text-base"    // Smaller text on mobile
className="gap-2 md:gap-4"          // Tighter spacing on mobile
```

### Animation Classes

```jsx
// Spin animation
className="animate-spin"

// Pulse animation
className="animate-pulse"

// Scale on hover
className="hover:scale-110 transition-all"

// Custom float animation (in style tag)
animation: 'float 6s ease-in-out infinite'
```

### Icon Sizes
```jsx
<Loader2 className="h-12 w-12" />      // Large loading spinner
<Heart className="h-6 w-6" />          // Action buttons
<Eye className="h-3 w-3" />            // Small decorative icons
<Send className="h-4 w-4" />           // Input buttons
```

### shadcn/ui Components Used

1. **Button** - All interactive elements
   ```jsx
   <Button size="icon" variant="ghost" className="..." />
   ```

2. **Card** - Content containers
   ```jsx
   <Card className="bg-white/10 backdrop-blur-md">
     <CardContent className="p-4">
       {/* content */}
     </CardContent>
   </Card>
   ```

3. **Avatar** - User profiles
   ```jsx
   <Avatar className="h-9 w-9">
     <AvatarImage src={url} />
     <AvatarFallback>AB</AvatarFallback>
   </Avatar>
   ```

4. **Badge** - Labels and tags
   ```jsx
   <Badge variant="secondary">Sample</Badge>
   ```

5. **ScrollArea** - Scrollable lists
   ```jsx
   <ScrollArea className="h-96 pr-4">
     {/* scrollable content */}
   </ScrollArea>
   ```

### Utility Function (cn)
```jsx
import { cn } from '@/lib/utils';

// Merge conditional classes
className={cn(
  "base-classes",
  condition && "conditional-classes",
  anotherCondition ? "true-classes" : "false-classes"
)}
```

### State Management Pattern

```jsx
// Local state in parent
const [playingVideoId, setPlayingVideoId] = useState(null);
const [isMuted, setIsMuted] = useState(false);
const [maximizedVideoId, setMaximizedVideoId] = useState(null);
const [visibleCommentsFor, setVisibleCommentsFor] = useState(null);

// Pass down to VideoCard as props
<VideoCard
  isPlaying={playingVideoId === video.id}
  isMaximized={maximizedVideoId === video.id}
  showComments={visibleCommentsFor === video.id}
  // ... handlers
/>
```

### Performance Optimizations

1. **React.memo** - VideoCard is memoized
2. **Lazy loading** - Only load videos within viewport range
3. **Conditional rendering** - `shouldRenderCard` and `shouldLoadVideo` flags
4. **Virtual scrolling** - Load more videos on scroll
5. **CSS transforms** - Use transform for animations (GPU accelerated)

### Accessibility Features

```jsx
// Proper ARIA labels
aria-label="like"
aria-label="comment-input"

// Keyboard navigation
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    // Submit comment
  }
}}

// Semantic HTML
<button> instead of <div onClick>
```

### Dark Mode Ready
All colors use CSS variables from `index.css`:
```css
--background, --foreground, --card, --primary, etc.
```

Simply toggle the `.dark` class on root to switch themes.

---

## Common Customizations

### Change Primary Color
Update in `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#your-color',
    600: '#darker-shade',
  }
}
```

### Adjust Card Transparency
```jsx
// More opaque
className="bg-white/20 backdrop-blur-lg"

// Less opaque
className="bg-white/5 backdrop-blur-sm"
```

### Change Animation Speed
```jsx
// Faster
className="transition-all duration-200"

// Slower
className="transition-all duration-500"
```

### Modify Hover Effects
```jsx
// Bigger scale
className="hover:scale-125"

// Add rotation
className="hover:scale-110 hover:rotate-3"
```

---

**Note**: This component is fully compatible with the existing backend API and maintains all original functionality while providing a modern, performant UI.
