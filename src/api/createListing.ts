import { Listing } from '@/lib/interfaces/Listing';
import apiClient from './interceptors/apiClient';

export const createListing = async (listing: Listing) => {
  try {
    const resp = await apiClient.post<Listing>(`/listings`, listing);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred while creating listing. Error: ${ex}`);
  }
};
