import { Listing } from '@/lib/interfaces/Listing';
import axios from 'axios';

export const getListing = async (id: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = `${API_URL}/listings/${id}`;
  try {
    const resp = await axios.get<Listing>(url);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred when fetching listing. Error: ${ex}`);
  }
};
