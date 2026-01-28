# Landing Page Redesign

## Overview
The SwipeScout frontend has been redesigned to feature a modern, high-converting landing page inspired by AI startups. The new design leverages dark mode, fluid animations, and a clean, "glassmorphism" aesthetic.

## Technologies Used
- **React**: Core framework.
- **Tailwind CSS**: Styling and responsive design.
- **GSAP (GreenSock Animation Platform)**: Advanced animations (ScrollTrigger, Timelines).
- **Lucide React**: Vector icons.

## Key Features
1.  **Hero Section**:
    -   Dynamic entrance animations using GSAP.
    -   Fluid background gradients.
    -   3D-style resume-to-video visual mockup.
    -   Dual CTAs for Job Seekers and Employers.

2.  **Features Section**:
    -   Bento-grid style cards.
    -   Scroll-triggered entrance animations.
    -   Focus on "Resume to Script", "Teleprompter", and "Swipe to Hire".

3.  **How It Works**:
    -   Step-by-step visual guide.
    -   Interactive hover states.

4.  **Responsive Design**:
    -   Fully optimized for Mobile, Tablet, and Desktop.

## Usage
The landing page becomes the default route (`/`).
-   **Sign In**: Redirects to `/login`.
-   **Get Started**: Redirects to `/register`.

## Development
To modify animations, edit `src/pages/LandingPage/LandingPage.jsx`.
GSAP timelines are defined in the `useEffect` hook.

## Dependencies Added
- `gsap`

## Future Improvements
-   Add actual video demos in the Hero visual.
-   Integrate "Swipe" interactive demo in the Features section.
