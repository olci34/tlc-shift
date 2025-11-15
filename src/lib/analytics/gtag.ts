/**
 * Google Analytics utility functions
 * Used to track page views and custom events
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = process.env.NODE_ENV === 'production';

// Type definition for gtag function
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}

/**
 * Track page views
 * @param url - The page URL to track
 */
export const pageview = (url: string): void => {
  if (!GA_MEASUREMENT_ID || !isProduction) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url
    });
  }
};

/**
 * Track custom events
 * @param action - The action being tracked
 * @param category - The category of the event
 * @param label - Additional label for the event
 * @param value - Optional numeric value
 */
export const event = ({
  action,
  category,
  label,
  value
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}): void => {
  if (!GA_MEASUREMENT_ID || !isProduction) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

/**
 * Track specific user actions
 */
export const trackEvent = {
  // User authentication events
  signup: () => {
    event({
      action: 'sign_up',
      category: 'authentication',
      label: 'user_signup'
    });
  },

  login: () => {
    event({
      action: 'login',
      category: 'authentication',
      label: 'user_login'
    });
  },

  // Listing events
  createListing: (category: string, price?: number) => {
    event({
      action: 'create_listing',
      category: 'listings',
      label: category,
      value: price
    });
  },

  viewListing: (listingId: string) => {
    event({
      action: 'view_listing',
      category: 'listings',
      label: listingId
    });
  },

  deleteListing: (listingId: string) => {
    event({
      action: 'delete_listing',
      category: 'listings',
      label: listingId
    });
  },

  // Engagement events
  submitFeedback: () => {
    event({
      action: 'submit_feedback',
      category: 'engagement',
      label: 'feature_request'
    });
  },

  joinWaitlist: () => {
    event({
      action: 'join_waitlist',
      category: 'engagement',
      label: 'discount_waitlist'
    });
  },

  // Contact events
  contactSeller: (listingId: string) => {
    event({
      action: 'contact_seller',
      category: 'engagement',
      label: listingId
    });
  },

  // Navigation events
  changeLanguage: (language: string) => {
    event({
      action: 'change_language',
      category: 'navigation',
      label: language
    });
  }
};
