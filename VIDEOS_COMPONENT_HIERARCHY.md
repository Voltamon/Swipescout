# Videos Page - Component Hierarchy

## 🗂️ Visual Component Structure

```
Videos (Main Component)
│
├── 🎨 SwipeScoutBackground
│   ├── Gradient Background Layer
│   ├── Overlay Gradient
│   ├── Shimmer Effect
│   ├── Brand Text (Floating Animation)
│   └── Decorative Circles
│
├── 📜 Container (Scrollable)
│   │
│   └── For each video:
│       │
│       └── 🎬 VideoCard Component
│           │
│           ├── 💬 Left Panel (w-80, order-2 on mobile, order-1 on desktop)
│           │   │
│           │   ├── Comments Section (if toggled)
│           │   │   ├── Card (glass-morphism)
│           │   │   │   └── CardContent
│           │   │   │       ├── Header ("Comments (count)")
│           │   │   │       ├── ScrollArea
│           │   │   │       │   └── Comment List
│           │   │   │       │       └── For each comment:
│           │   │   │       │           ├── Avatar
│           │   │   │       │           │   ├── AvatarImage
│           │   │   │       │           │   └── AvatarFallback
│           │   │   │       │           └── Comment Content
│           │   │   │       │               ├── User Name
│           │   │   │       │               ├── Content Text
│           │   │   │       │               └── Timestamp
│           │   │   │       └── Input Section
│           │   │   │           ├── Input Field
│           │   │   │           └── Button (Send Icon)
│           │   │   │
│           │   └── Video Info Card
│           │       └── Card (glass-morphism)
│           │           └── CardContent
│           │               ├── Video Title (h2)
│           │               ├── Hashtags (p)
│           │               └── View Count (div with Eye icon)
│           │
│           ├── 🎥 Center Panel (flex-1, order-1)
│           │   └── Video Container
│           │       └── Video Player (relative container)
│           │           ├── video Element
│           │           ├── Sample Badge (if videoType === 'sample')
│           │           ├── Maximize Button (top-right, hidden until hover)
│           │           └── Mute Button (bottom-left, hidden until hover)
│           │
│           └── 🎮 Right Panel (w-20, order-3 on mobile, order-2 on desktop)
│               └── Action Buttons Stack
│                   ├── Previous Button (ChevronUp)
│                   │
│                   ├── Like Button + Count
│                   │   ├── Button (Heart icon)
│                   │   └── Count Badge
│                   │
│                   ├── Comment Button + Count
│                   │   ├── Button (MessageCircle icon)
│                   │   └── Count Badge
│                   │
│                   ├── Share Button + Count
│                   │   ├── Button (Share2 icon)
│                   │   └── Count Badge
│                   │
│                   ├── Save Button + Label
│                   │   ├── Button (Bookmark icon)
│                   │   └── Label Text ("Saved" when active)
│                   │
│                   └── Next Button (ChevronDown)
│
└── 🔔 ToastContainer (react-toastify)
```

---

## 📱 Responsive Layout Changes

### Desktop (md: 768px+)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐  ┌─────────────────┐  ┌──────────┐  │
│  │          │  │                 │  │          │  │
│  │          │  │                 │  │  ⬆︎      │  │
│  │ Comments │  │                 │  │          │  │
│  │          │  │     Video       │  │  ❤️  23  │  │
│  │          │  │                 │  │          │  │
│  │          │  │                 │  │  💬  5   │  │
│  │          │  │                 │  │          │  │
│  │  Info    │  │                 │  │  📤  12  │  │
│  │          │  │                 │  │          │  │
│  └──────────┘  └─────────────────┘  │  🔖      │  │
│                                      │          │  │
│                                      │  ⬇︎      │  │
│                                      └──────────┘  │
└─────────────────────────────────────────────────────┘
    Left Panel      Center Panel      Right Panel
    (280px)         (flex-1)          (80px)
```

### Mobile (< 768px)
```
┌───────────────────────────┐
│                           │
│   ┌───────────────────┐   │
│   │                   │   │
│   │                   │   │
│   │      Video        │   │
│   │                   │   │
│   │                   │   │
│   └───────────────────┘   │
│                           │
│   ┌───────────────────┐   │
│   │  ⬆︎  ❤️  💬  📤  🔖  ⬇︎  │
│   └───────────────────┘   │
│                           │
│   ┌───────────────────┐   │
│   │   Comments        │   │
│   │   Info            │   │
│   └───────────────────┘   │
└───────────────────────────┘
       Stacked Layout
       (full width)
```

---

## 🎨 Styling Architecture

### Color System
```
Background Gradient:
  - from-purple-900 (#581c87)
  - via-indigo-900 (#312e81)
  - to-blue-900 (#1e3a8a)

Text Colors:
  - Primary: text-white
  - Secondary: text-gray-200
  - Muted: text-gray-300
  - Disabled: text-gray-400

Interactive States:
  - Default: text-white
  - Hover: hover:bg-white/20
  - Active (Like): text-red-500
  - Active (Save): text-purple-400

Card Styling:
  - Background: bg-white/10
  - Backdrop: backdrop-blur-md
  - Border: border-white/20
  - Shadow: (inherited from Card)

Badges:
  - Background: bg-black/40
  - Text: text-white
  - Padding: px-2 py-0.5
  - Border Radius: rounded-full
```

### Spacing Scale
```
Tailwind's default scale (4px base):
  gap-1  → 4px
  gap-2  → 8px
  gap-3  → 12px
  gap-4  → 16px
  gap-6  → 24px

Padding:
  p-2  → 8px
  p-3  → 12px
  p-4  → 16px
  p-6  → 24px

Margins:
  mb-3 → 12px bottom
  mt-1 → 4px top
```

### Typography Scale
```
Headings:
  - h1: text-2xl md:text-5xl (24px/48px)
  - h2: text-lg (18px)
  - h3: text-sm (14px)

Body:
  - Base: text-sm (14px)
  - Small: text-xs (12px)
  - Caption: text-xs (12px)

Font Weights:
  - Regular: font-normal (400)
  - Semibold: font-semibold (600)
  - Bold: font-bold (700)
  - Black: font-black (900)
```

### Border Radius
```
  - rounded-lg  → 8px (cards)
  - rounded-xl  → 12px (video container)
  - rounded-full → 9999px (buttons, badges)
```

---

## 🎬 Animation System

### Keyframe Animations (CSS)
```css
@keyframes floatGradient {
  /* Background floating effect */
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  25%      { transform: translate3d(5%, -3%, 0) scale(1.05); }
  50%      { transform: translate3d(-5%, 3%, 0) scale(1.08); }
  75%      { transform: translate3d(3%, -5%, 0) scale(1.03); }
}

@keyframes shimmer {
  /* Shimmer overlay effect */
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  /* Brand text floating */
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.05; }
  50%      { transform: translateY(-20px) scale(1.05); opacity: 0.12; }
}
```

### Transition Classes
```jsx
// Smooth all properties
className="transition-all"

// Only transform (better performance)
className="transition-transform"

// Custom duration
className="transition-all duration-300"

// Easing
className="transition-all ease-in-out"
```

### Hover Effects
```jsx
// Scale up
className="hover:scale-110"

// Background fade in
className="hover:bg-white/20"

// Opacity change
className="hover:opacity-80"

// Combined
className="hover:scale-110 hover:bg-white/20 transition-all"
```

---

## 🔄 State Management Flow

```
User Interaction
       ↓
Event Handler (in Videos.jsx)
       ↓
State Update (useState)
       ↓
Props to VideoCard
       ↓
UI Re-render
       ↓
Visual Feedback
```

### Key State Variables
```jsx
// Video control
playingVideoId: null | string
isMuted: boolean

// UI state
maximizedVideoId: null | string
visibleCommentsFor: null | string
currentVideoIndex: number

// Data
videos: Video[]
commentsByVideo: { [videoId]: CommentMeta }

// Loading
loading: boolean
error: string | null
hasMoreVideos: boolean
```

---

## 📊 Data Flow

```
API Request → normalizeVideoFromApi → Local State → Props → UI
     ↓                                      ↓
localStorage (anonymous users)        VideoCard Component
     ↓                                      ↓
User Interaction                     Render with Tailwind
     ↓                                      ↓
Optimistic Update                    Visual Feedback
     ↓
API Call (async)
     ↓
Server Response
     ↓
State Sync
```

---

## 🎯 Performance Optimization Points

### 1. Lazy Loading
```jsx
// Only load videos near viewport
const shouldLoad = distanceFromActive <= 1 || isMaximized
```

### 2. React.memo
```jsx
// Prevent unnecessary re-renders
const VideoCard = React.memo(({ ... }) => { ... })
```

### 3. CSS Transforms
```jsx
// GPU-accelerated animations
className="transition-transform" // ✅ Good
className="transition-all"       // ❌ Slower
```

### 4. Conditional Rendering
```jsx
// Don't render far-away videos
{shouldRenderCard ? <VideoCard /> : <Loader />}
```

### 5. Event Throttling
```jsx
// Limit scroll event frequency
const wheelTimeout = useRef(null)
wheelTimeout.current = setTimeout(() => { ... }, 600)
```

---

## 🔍 Accessibility Features

### Semantic HTML
```jsx
<button>          // Interactive elements
<h1>, <h2>, <h3>  // Heading hierarchy
<input>           // Form controls
```

### ARIA Labels
```jsx
aria-label="like"
aria-label="comment"
aria-label="previous"
```

### Keyboard Navigation
```jsx
onKeyDown={(e) => {
  if (e.key === 'Enter') { /* Submit */ }
  if (e.key === 'ArrowUp') { /* Previous */ }
  if (e.key === 'ArrowDown') { /* Next */ }
}}
```

### Focus States
```jsx
focus:outline-none
focus:ring-2
focus:ring-purple-500
```

---

## 📦 Component Dependencies

```
VideoCard
  ├── React Hooks
  │   ├── useState
  │   ├── useEffect
  │   ├── useRef
  │   └── useCallback
  │
  ├── Context
  │   └── useAuth (for user data)
  │
  ├── UI Components
  │   ├── Button (shadcn/ui)
  │   ├── Card (shadcn/ui)
  │   ├── Avatar (shadcn/ui)
  │   ├── Badge (shadcn/ui)
  │   └── ScrollArea (shadcn/ui)
  │
  ├── Icons (Lucide React)
  │   ├── Heart
  │   ├── MessageCircle
  │   ├── Share2
  │   ├── Bookmark
  │   ├── ChevronUp/Down
  │   ├── Maximize/Minimize
  │   ├── Volume2/VolumeX
  │   ├── Send
  │   ├── Eye
  │   └── Loader2
  │
  └── Utilities
      ├── cn (class merger)
      ├── toast (notifications)
      └── API services
```

---

This visual guide provides a complete overview of the component structure, making it easy to understand and maintain the Videos page.
