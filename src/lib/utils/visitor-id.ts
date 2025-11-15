/**
 * Visitor ID utility for tracking anonymous visitors
 * Generates and manages a GUID stored in localStorage
 */

const VISITOR_ID_KEY = 'tlc_visitor_id';

/**
 * Generate a UUID v4 GUID
 */
export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a visitor ID from localStorage
 * Returns the existing visitor ID if found, otherwise generates a new one
 */
export function getOrCreateVisitorId(): string {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return generateGUID(); // Return temporary ID for SSR
  }

  try {
    // Try to get existing visitor ID
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);

    // If no visitor ID exists, create one
    if (!visitorId) {
      visitorId = generateGUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    return visitorId;
  } catch (error) {
    // Fallback if localStorage is not available
    console.error('Error accessing localStorage for visitor ID:', error);
    return generateGUID();
  }
}

/**
 * Get the current visitor ID without creating a new one
 * Returns null if no visitor ID exists
 */
export function getVisitorId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(VISITOR_ID_KEY);
  } catch (error) {
    console.error('Error accessing localStorage for visitor ID:', error);
    return null;
  }
}

/**
 * Get visitor ID with guarantee
 * Returns existing visitor ID, or creates one if it doesn't exist
 * Use this when you need to ensure you have a visitor ID
 */
export function getVisitorIdSafe(): string {
  const existingId = getVisitorId();
  return existingId || getOrCreateVisitorId();
}

/**
 * Clear the visitor ID from localStorage
 * Useful for testing or when user logs out
 */
export function clearVisitorId(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(VISITOR_ID_KEY);
  } catch (error) {
    console.error('Error clearing visitor ID from localStorage:', error);
  }
}
