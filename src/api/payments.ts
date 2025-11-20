import apiClient from './interceptors/apiClient';

export interface CheckPaymentRequirementResponse {
  requires_payment: boolean;
  active_listings_count: number;
  free_listings_remaining: number;
  message: string;
}

export interface CreateCheckoutSessionRequest {
  payment_type: 'listing' | 'promote_listing';
  listing_id: string; // Required - the inactive listing to be activated on payment success
  success_url: string;
  cancel_url: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  payment_id?: string;
  session_id?: string;
  checkout_url?: string; // URL to redirect to Stripe-hosted checkout
  requires_payment?: boolean;
}

export interface StripeConfigResponse {
  publishable_key: string;
  price_per_listing: number;
}

export interface SubscriptionInfoResponse {
  active_listings_count: number;
  monthly_charge: number;
  price_per_listing: number;
  currency: string;
  free_listings_limit: number;
  paid_listings_count: number;
}

/**
 * Check if the user needs to pay to create a new listing.
 * First 2 active listings are free.
 */
export const checkPaymentRequirement = async (): Promise<CheckPaymentRequirementResponse> => {
  try {
    const resp = await apiClient.get<CheckPaymentRequirementResponse>(
      '/payments/check-requirement'
    );
    return resp.data;
  } catch (error) {
    console.error('Error checking payment requirement:', error);
    throw error;
  }
};

/**
 * Create a Stripe checkout session for payment.
 * This session supports Apple Pay, Google Pay, and manual card entry.
 */
export const createCheckoutSession = async (
  request: CreateCheckoutSessionRequest
): Promise<PaymentResponse> => {
  try {
    const resp = await apiClient.post<PaymentResponse>(
      '/payments/create-checkout-session',
      request
    );
    return resp.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Get Stripe configuration (publishable key and pricing).
 * This is safe to expose publicly.
 */
export const getStripeConfig = async (): Promise<StripeConfigResponse> => {
  try {
    const resp = await apiClient.get<StripeConfigResponse>('/payments/config');
    return resp.data;
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    throw error;
  }
};

/**
 * Get user's payment history.
 */
export const getPaymentHistory = async (
  page: number = 1,
  perPage: number = 20
): Promise<any> => {
  try {
    const resp = await apiClient.get('/payments/history', {
      params: { page, per_page: perPage }
    });
    return resp.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

/**
 * Get user's subscription and billing information.
 * Returns active listings count and calculated monthly charge.
 */
export const getSubscriptionInfo = async (): Promise<SubscriptionInfoResponse> => {
  try {
    const resp = await apiClient.get<SubscriptionInfoResponse>('/payments/subscription-info');
    return resp.data;
  } catch (error) {
    console.error('Error fetching subscription info:', error);
    throw error;
  }
};
