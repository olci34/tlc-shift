import apiClient from './interceptors/apiClient';
import type { ListingResponse } from './getListings';

export const getUserListings = async (userId: string) => {
  try {
    const resp = await apiClient.get<ListingResponse>(
      `/listings/user/${encodeURIComponent(userId)}`
    );
    return resp.data;
  } catch (error) {
    console.error('Failed to fetch user listings', error);
  }
};
