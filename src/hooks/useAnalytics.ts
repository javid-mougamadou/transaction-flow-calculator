import { useEffect } from 'react';
import { trackEvent, trackPageView, isGAAvailable } from '../utils/analytics';

/**
 * Hook to track page views
 * Waits for Google Analytics to be available before tracking
 */
export const usePageTracking = (path: string, title?: string): void => {
  useEffect(() => {
    // Try to track immediately if GA is available
    if (isGAAvailable()) {
      trackPageView(path, title);
      return;
    }

    // If GA is not available yet, wait a bit and retry (script might still be loading)
    const maxRetries = 20;
    let retries = 0;
    const intervalId = setInterval(() => {
      if (isGAAvailable()) {
        trackPageView(path, title);
        clearInterval(intervalId);
      } else if (retries >= maxRetries) {
        // Stop retrying after max attempts
        clearInterval(intervalId);
      }
      retries++;
    }, 200); // Check every 200ms

    return () => {
      clearInterval(intervalId);
    };
  }, [path, title]);
};

/**
 * Hook to track custom events
 */
export const useAnalytics = () => {
  return {
    trackEvent: (eventName: string, eventParams?: Record<string, unknown>) => {
      trackEvent(eventName, eventParams);
    },
    isAvailable: isGAAvailable(),
  };
};

