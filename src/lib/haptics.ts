/**
 * Haptic feedback utility for providing tactile feedback on user interactions
 * Works on devices that support the Vibration API (most modern mobile browsers)
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Check if the device supports haptic feedback
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in navigator;
};

/**
 * Trigger haptic feedback with predefined patterns
 */
export const triggerHaptic = (pattern: HapticPattern = 'light'): void => {
  if (!isHapticSupported()) return;

  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [30, 100, 30, 100, 30],
    selection: 5,
  };

  const vibrationPattern = patterns[pattern];
  
  try {
    if (typeof vibrationPattern === 'number') {
      navigator.vibrate(vibrationPattern);
    } else {
      navigator.vibrate(vibrationPattern);
    }
  } catch (error) {
    // Silently fail if vibration is not supported or blocked
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Custom haptic feedback with specific duration or pattern
 */
export const triggerCustomHaptic = (pattern: number | number[]): void => {
  if (!isHapticSupported()) return;

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Cancel any ongoing haptic feedback
 */
export const cancelHaptic = (): void => {
  if (!isHapticSupported()) return;

  try {
    navigator.vibrate(0);
  } catch (error) {
    console.debug('Could not cancel haptic feedback:', error);
  }
};

/**
 * React hook for haptic feedback
 */
export const useHaptic = () => {
  const trigger = (pattern: HapticPattern = 'light') => {
    triggerHaptic(pattern);
  };

  return {
    trigger,
    isSupported: isHapticSupported(),
    cancel: cancelHaptic,
  };
};
