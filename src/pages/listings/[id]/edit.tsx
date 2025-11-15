import { getListing } from '@/api/getListing';
import ListingForm from '@/components/form/listing-form';
import type { Listing } from '@/lib/interfaces/Listing';
import { updateListing } from '@/api/updateListing';
import { Box, Heading, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

const EditListingPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      setIsLoading(true);
      const resp = await getListing(id as string);
      setListing(resp ?? null);
      setIsLoading(false);
    };
    fetchListing();
  }, [id]);

  const onSave = async (payload: Listing) => {
    if (!id) return;
    try {
      const resp = await updateListing(payload);
      if (resp) {
        // Cleanup object URLs for new images
        payload.images.forEach((img) => {
          if (!img.cld_public_id && img.src) {
            URL.revokeObjectURL(img.src);
          }
        });
        router.push(`/listings/${id}`);
      }
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  return (
    <Box>
      <Heading my={4}>Edit Listing</Heading>
      {isLoading || !listing ? (
        <Skeleton height={300} />
      ) : (
        <ListingForm listing={listing} onSubmit={onSave} />
      )}
    </Box>
  );
};

export default EditListingPage;
