import apiClient from './interceptors/apiClient';
import { AxiosError } from 'axios';
import { Listing } from '@/lib/interfaces/Listing';

export const deleteListing = async (listingId: string): Promise<Listing> => {
  try {
    const resp = await apiClient.delete<Listing>(`/listings/${listingId}`);
    return resp.data;
  } catch (err: AxiosError | any) {
    console.log(`Delete listing error: ${err.message}`);
    throw err;
  }
};
