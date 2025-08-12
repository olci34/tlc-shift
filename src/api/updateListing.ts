import apiClient from './interceptors/apiClient';
import type { Listing } from '@/lib/interfaces/Listing';

export const updateListing = async (id: string, payload: Listing) => {
  try {
    const resp = await apiClient.put(`/listings/${encodeURIComponent(id)}`, payload);
    return resp.data;
  } catch (error) {
    console.error('Failed to update listing', error);
  }
};
