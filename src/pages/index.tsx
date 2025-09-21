import { Box, Heading, HStack, Text, Skeleton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ListingCard } from '@/components/listing/listing-card';
import { getListings, ListingResponse } from '@/api/getListings';
import { Listing } from '@/lib/interfaces/Listing';

export default function Home() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedListings = async () => {
      try {
        const response: ListingResponse | undefined = await getListings(1, 10);
        if (response) {
          setListings(response.listings);
        }
      } catch (error) {
        console.error('Error fetching suggested listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedListings();
  }, []);

  const handleListingClick = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  return (
    <Box padding={{ base: 4, md: 8 }}>
      <Heading size="xl" mb={2}>
        Welcome to TLC Shift
      </Heading>
      <Text color="gray.600" mb={8} fontSize="lg">
        Find the perfect rental car for your needs
      </Text>

      <Box>
        <Heading size="lg" mb={4}>
          Latest Rentals
        </Heading>

        <Box overflowX="auto" pb={4}>
          <HStack spacing={4}>
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <Box key={`skeleton-${index}`} minWidth={250} flexShrink={0}>
                    <Skeleton height={200} borderRadius="md" />
                  </Box>
                ))
              : listings.map((listing) => (
                  <Box key={listing._id}>
                    <ListingCard
                      listing={listing}
                      onClick={() => handleListingClick(listing._id!)}
                    />
                  </Box>
                ))}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
