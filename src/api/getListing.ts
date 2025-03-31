import { Listing } from '@/lib/interfaces/Listing';
import apiClient from './interceptors/apiClient';

export const getListing = async (id: string) => {
  const url = `/listings/${id}`;
  try {
    const resp = await apiClient.get<Listing>(url);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred when fetching listing. Error: ${ex}`);
  }
};
