// Google Analytics utility functions using react-ga4

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// @ts-expect-error - react-ga4 types may not be available
import ReactGA from 'react-ga4';

// Get environment variables with proper typing
// @ts-expect-error - import.meta.env is provided by Vite
const GA_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;
// Use Vite's PROD flag which is the most reliable way to detect production
// @ts-expect-error - import.meta.env is provided by Vite
const IS_PRODUCTION: boolean = import.meta.env.PROD === true;

// Track if GA has been initialized
let gaInitialized = false;

/**
 * Initialize Google Analytics (only in production)
 */
export const initGA = (): void => {
  // Debug logging
  console.log('[GA Debug] Initializing Google Analytics...', {
    GA_MEASUREMENT_ID: GA_MEASUREMENT_ID ? `Set (${GA_MEASUREMENT_ID.substring(0, 8)}...)` : 'Not set',
    IS_PRODUCTION,
    // @ts-expect-error - import.meta.env is provided by Vite
    MODE: import.meta.env.MODE,
    // @ts-expect-error - import.meta.env is provided by Vite
    PROD: import.meta.env.PROD,
  });

  // Only initialize in production
  if (!IS_PRODUCTION) {
    console.log('[GA Debug] Disabled - not in production mode');
    return;
  }

  if (!GA_MEASUREMENT_ID) {
    console.warn('[GA Debug] VITE_GA_MEASUREMENT_ID is not set');
    return;
  }

  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      testMode: false,
    });
    gaInitialized = true;
    console.log('[GA Debug] Google Analytics initialized successfully via react-ga4');
  } catch (error) {
    console.error('[GA Debug] Failed to initialize Google Analytics:', error);
    gaInitialized = false;
  }
};

/**
 * Track a page view
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID) {
    console.log('[GA Debug] trackPageView skipped - not production or no ID', {
      IS_PRODUCTION,
      hasId: !!GA_MEASUREMENT_ID,
      path,
    });
    return;
  }

  if (!gaInitialized) {
    console.log('[GA Debug] trackPageView skipped - GA not initialized yet', { path });
    return;
  }

  try {
    console.log('[GA Debug] Tracking page view', { path, title });
    ReactGA.send({ hitType: 'pageview', page: path, title: title || document.title });
    console.log('[GA Debug] Page view sent to GA');
  } catch (error) {
    console.error('[GA Debug] Error tracking page view:', error);
  }
};

/**
 * Track a custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>,
): void => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID) {
    console.log('[GA Debug] trackEvent skipped - not production or no ID', {
      IS_PRODUCTION,
      hasId: !!GA_MEASUREMENT_ID,
      eventName,
    });
    return;
  }

  if (!gaInitialized) {
    console.log('[GA Debug] trackEvent skipped - GA not initialized yet', { eventName });
    return;
  }

  try {
    console.log('[GA Debug] Tracking event', { eventName, eventParams });
    ReactGA.event(eventName, eventParams || {});
    console.log('[GA Debug] Event sent to GA', { eventName });
  } catch (error) {
    console.error('[GA Debug] Error tracking event:', error);
  }
};

/**
 * Check if Google Analytics is available
 */
export const isGAAvailable = (): boolean => {
  // Check if GA is initialized via react-ga4 or via HTML script tag
  const isInitialized = gaInitialized || (!!window.dataLayer && !!window.gtag);
  return IS_PRODUCTION && !!GA_MEASUREMENT_ID && isInitialized;
};
