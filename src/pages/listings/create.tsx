import ListingForm from '@/components/form/listing-form';
import { Heading, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { createListing } from '@/api/createListing';
import type { Listing } from '@/lib/interfaces/Listing';

const CreateListingPage = () => {
  const router = useRouter();

  const handleSubmit = async (listing: Listing) => {
    try {
      const result = await createListing(listing);
      if (result) {
        // Cleanup object URLs for new images
        listing.images.forEach((img) => {
          if (!img.cld_public_id && img.src) {
            URL.revokeObjectURL(img.src);
          }
        });
        router.push(`/listings/${result._id}`);
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  return (
    <Stack direction="column">
      <Heading>New Rental Listing</Heading>
      <ListingForm onSubmit={handleSubmit} />
    </Stack>
  );
};

export default CreateListingPage;
