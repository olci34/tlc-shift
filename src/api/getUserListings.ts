import apiClient from './interceptors/apiClient';
import type { ListingResponse } from './getListings';

export const getUserListings = async (userId: string, page: number, perPage: number) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString()
  });
  try {
    const resp = await apiClient.get<ListingResponse>(
      `/listings/user/${encodeURIComponent(userId)}?${params.toString()}`
    );

    return resp.data;
  } catch (error) {
    console.error('Failed to fetch user listings', error);
  }
};
