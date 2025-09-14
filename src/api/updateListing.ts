import apiClient from './interceptors/apiClient';
import type { Listing } from '@/lib/interfaces/Listing';

export const updateListing = async (listing: Listing) => {
  try {
    if (!listing._id) {
      throw new Error('Listing ID is required for updating');
    }

    const data = new FormData();
    const { images, ...listingWithoutImages } = listing;
    const oldImages = images.filter((img) => !!img.cld_public_id);
    const newImages = images.filter((img) => !img.cld_public_id);

    data.append('listing', JSON.stringify({ ...listingWithoutImages, images: oldImages }));

    newImages.forEach((img) => {
      if (img.file && img.file instanceof File) {
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

        data.append('images', img.file, img.file.name);
      }
    });

    const resp = await apiClient.put(`/listings/${encodeURIComponent(listing._id)}`, data);
    return resp.data;
  } catch (error) {
    console.error('Failed to update listing', error);
    throw error;
  }
};
