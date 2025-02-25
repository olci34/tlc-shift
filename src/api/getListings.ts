import { Listing } from '@/lib/interfaces/Listing';
import { CarFilter } from '@/pages/listings';
import axios from 'axios';

export interface ListingResponse {
  listings: Listing[];
  total: number;
}

export const getListings = async (page: number, perPage: number, carFilter: CarFilter = {}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(`${API_URL}/listings`);
  console.log(carFilter);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', perPage.toString());
  url.searchParams.set('q', JSON.stringify(carFilter));

  try {
    const resp = await axios.get<ListingResponse>(url.toString());
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};
