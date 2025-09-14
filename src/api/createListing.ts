import { Listing, ListingContact, ListingItem, ListingLocation } from '@/lib/interfaces/Listing';
import apiClient from './interceptors/apiClient';

export interface CreateListingRequest {
  title: string;
  description: string;
  transaction_type?: 'Rental' | 'Sale';
  listing_category?: 'Vehicle' | 'Plate';
  item: ListingItem;
  price: number;
  location: ListingLocation;
  contact: ListingContact;
  active: boolean;
}

export const createListing = async (listing: Listing) => {
  const data = new FormData();

  // Create listing data without File objects for JSON serialization
  const { images, ...listingWithoutImages } = listing;
  const listingForJson: CreateListingRequest = {
    ...listingWithoutImages
  };

  data.append('listing', JSON.stringify(listingForJson));

  // Add all image files to the 'images' field
  listing.images.forEach((img) => {
    if (img.file && img.file instanceof File) {
      // Security: Validate file type and size
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(img.file.type)) {
        throw new Error(
          `Invalid file type: ${img.file.type}. Only JPEG, PNG, and WebP are allowed.`
        );
      }

      if (img.file.size > maxSize) {
        throw new Error(`File too large: ${img.file.name}. Maximum size is 10MB.`);
      }
    }

    data.append('images', img.file, img.name);
  });

  try {
    const resp = await apiClient.post<Listing>(`/listings`, data);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred while creating listing. Error: ${ex}`);
    throw ex;
  }
};
