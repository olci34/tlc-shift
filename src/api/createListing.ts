import { Listing } from '@/lib/interfaces/Listing';
import axios from 'axios';

export const createListing = async (listing: Listing) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const resp = await axios.post<Listing>(`${API_URL}/listings`, listing);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred while creating listing. Error: ${ex}`);
  }
};
