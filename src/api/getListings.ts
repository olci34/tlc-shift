import { Listing } from '@/lib/interfaces/Listing';
import { CarFilter } from '@/pages/listings';
import apiClient from './interceptors/apiClient';

export interface ListingResponse {
  listings: Listing[];
  total: number;
}

export const getListings = async (page: number, perPage: number, carFilter: CarFilter = {}) => {
  const url = new URL(`/listings`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', perPage.toString());
  url.searchParams.set('q', JSON.stringify(carFilter));

  try {
    const resp = await apiClient.get<ListingResponse>(url.toString());
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};
