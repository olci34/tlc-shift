import { Listing } from '@/lib/interfaces/Listing';
import { CarFilter } from '@/pages/listings';
import apiClient from './interceptors/apiClient';

export interface ListingResponse {
  listings: Listing[];
  total: number;
}

export const getListings = async (page: number, perPage: number, carFilter: CarFilter = {}) => {
  const url = '/listings';
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    q: JSON.stringify(carFilter)
  });

  try {
    const resp = await apiClient.get<ListingResponse>(`${url}?${params.toString()}`);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Errorr: ${ex}`);
  }
};
