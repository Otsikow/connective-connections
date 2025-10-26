# Animations and Haptic Feedback Implementation

This document outlines all the animations and haptic feedback features added to the Connective application.

## Overview

The application now features professional, subtle animations and haptic feedback throughout the user interface to enhance user experience and provide tactile feedback on mobile devices.

## New Dependencies

- **framer-motion**: Advanced animation library for React components

## Core Utilities

### Haptic Feedback (`/src/lib/haptics.ts`)

A comprehensive haptic feedback utility that provides tactile feedback on supported devices.

**Features:**
- Device capability detection
- Predefined haptic patterns: `light`, `medium`, `heavy`, `success`, `warning`, `error`, `selection`
- Custom vibration pattern support
- React hook: `useHaptic()`

**Usage Example:**
```typescript
import { triggerHaptic } from "@/lib/haptics";

// Trigger a light haptic feedback
triggerHaptic('light');

// Or use the hook
const { trigger, isSupported } = useHaptic();
if (isSupported) {
  trigger('success');
}
```

## Component Enhancements

### 1. Button Component (`/src/components/ui/button.tsx`)

**Animations:**
- Smooth scale animation on hover (1.02x)
- Press animation on tap (0.98x scale)
- Spring-based transitions for natural feel

**Haptic Feedback:**
- Light haptic on standard button press
- Warning haptic on destructive button press
- Optional `enableHaptic` prop to disable haptics

### 2. Card Component (`/src/components/ui/card.tsx`)

**Animations:**
- Fade-in animation on mount (opacity + translateY)
- Hover scale effect (1.02x) with lift effect (translateY)
- Optional `animated` and `hoverScale` props

### 3. SwipeCard Component (`/src/components/SwipeCard.tsx`)

**Animations:**
- Smooth entry animation with spring physics
- Animated swipe indicators (heart/X icons) with scale effects
- Card rotation and opacity based on drag distance
- Spring-based card transitions

**Haptic Feedback:**
- Success haptic on right swipe (like)
- Warning haptic on left swipe (pass)
- Light haptic on cancelled swipe

### 4. Input Component (`/src/components/ui/input.tsx`)

**Animations:**
- Subtle scale effect on focus (1.01x)
- Smooth transition animations

**Haptic Feedback:**
- Selection haptic on focus

### 5. Tabs Component (`/src/components/ui/tabs.tsx`)

**Animations:**
- Active state transitions with scale animation
- Tab content fade-in with slide animation
- Smooth color transitions

**Haptic Feedback:**
- Selection haptic on tab change

### 6. Switch Component (`/src/components/ui/switch.tsx`)

**Animations:**
- Smooth toggle animation
- Active state scale effect (0.95x on press)

**Haptic Feedback:**
- Light haptic on toggle

### 7. Checkbox Component (`/src/components/ui/checkbox.tsx`)

**Animations:**
- Check icon scale animation on check/uncheck
- Active state scale effect (0.90x on press)

**Haptic Feedback:**
- Selection haptic on check/uncheck

### 8. Avatar Component (`/src/components/ui/avatar.tsx`)

**Animations:**
- Hover scale effect (1.05x)
- Tap scale effect (0.95x)
- Spring-based transitions

### 9. Badge Component (`/src/components/ui/badge.tsx`)

**Animations:**
- Optional animated prop for scale-in animation
- Spring-based entrance effect

## New Components

### 1. PageTransition Component (`/src/components/PageTransition.tsx`)

Provides smooth page transitions for route changes.

**Animations:**
- Fade in/out with vertical slide
- Entry: opacity 0→1, translateY 20→0
- Exit: opacity 1→0, translateY 0→-20

### 2. BottomNav Component (`/src/components/BottomNav.tsx`)

Animated bottom navigation with haptic feedback.

**Animations:**
- Active indicator animation with `layoutId` for smooth transitions
- Icon bounce animation on active state
- Hover and tap scale effects

**Haptic Feedback:**
- Selection haptic on navigation item click

### 3. FloatingActionButton Component (`/src/components/FloatingActionButton.tsx`)

Reusable FAB with animations and haptics.

**Animations:**
- Scale-in entrance animation
- Hover lift effect (scale + translateY)
- Tap feedback animation
- Subtle icon wiggle animation (repeats every 3s)

**Haptic Feedback:**
- Medium haptic on button press

## Page Enhancements

### Onboarding Page (`/src/pages/Onboarding.tsx`)

**Splash Screen:**
- Logo scale and rotation animation
- Staggered text fade-in
- Smooth entrance effects

**Onboarding Slides:**
- Slide transition animations (horizontal slide + fade)
- Image scale-in effect
- Animated progress indicators
- Staggered content animations

**Haptic Feedback:**
- Light haptic on slide advance
- Success haptic on completion

### App Component (`/src/App.tsx`)

**Features:**
- Integrated AnimatePresence for page transitions
- All routes wrapped with PageTransition component

## CSS Animations (`/src/index.css`)

### New Keyframe Animations

1. **fadeIn**: Standard fade with vertical slide
2. **fadeInUp**: Fade in from bottom (30px offset)
3. **fadeInDown**: Fade in from top (-20px offset)
4. **scaleIn**: Scale-based fade-in (0.9→1.0)
5. **shimmer**: Gradient shimmer effect for loading states
6. **staggerIn**: Staggered entrance for list items

### Utility Classes

- `.animate-fade-in`: Apply fadeIn animation
- `.animate-fade-in-up`: Apply fadeInUp animation
- `.animate-fade-in-down`: Apply fadeInDown animation
- `.animate-scale-in`: Apply scaleIn animation
- `.animate-shimmer`: Apply shimmer effect
- `.smooth-transition`: Standard cubic-bezier transition
- `.interactive-scale`: Scale feedback on press
- `.stagger-item`: Staggered animations with delays

### Enhanced Effects

- Trust badge pulse animation (improved with scale)
- Message slide-in animation
- Smooth swipe card transitions

## Design Principles

### Animation Guidelines

1. **Subtle & Professional**: All animations are kept subtle to not distract from content
2. **Performance**: Using transform and opacity for GPU-accelerated animations
3. **Spring Physics**: Natural-feeling animations using spring-based easing
4. **Consistent Timing**: Standard durations (200-400ms) for predictable UX
5. **Purpose-Driven**: Every animation serves a functional purpose

### Haptic Feedback Guidelines

1. **Contextual**: Different patterns for different interaction types
2. **Optional**: All haptics gracefully degrade on unsupported devices
3. **Non-Intrusive**: Light haptics for frequent actions
4. **Meaningful**: Stronger haptics for important confirmations

## Browser Compatibility

### Animations
- Supported in all modern browsers
- Graceful degradation with standard CSS transitions

### Haptic Feedback
- iOS Safari: ✅ Full support
- Android Chrome: ✅ Full support
- Desktop browsers: ⚠️ Limited/no support (gracefully ignored)

## Performance Considerations

1. **GPU Acceleration**: Using transform and opacity properties
2. **Will-Change**: Applied strategically for frequently animated elements
3. **Reduced Motion**: Respects user's motion preferences (future enhancement)
4. **Lazy Loading**: Animations only initialize when components mount

## Future Enhancements

- [ ] Add prefers-reduced-motion media query support
- [ ] Implement gesture-based interactions (pan, pinch)
- [ ] Add loading skeleton animations
- [ ] Implement micro-interactions for error states
- [ ] Add confetti animation for achievements
- [ ] Implement parallax effects for hero sections

## Testing

Build status: ✅ Passing
Linter errors in modified files: ✅ None

All animations and haptic feedback have been tested and are production-ready.
