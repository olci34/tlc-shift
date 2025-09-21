import {
  Box,
  Heading,
  HStack,
  Text,
  Skeleton,
  Stack,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ListingCard } from '@/components/listing/listing-card';
import { getListings, ListingResponse } from '@/api/getListings';
import { Listing } from '@/lib/interfaces/Listing';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const textColor = useColorModeValue('gray.600', 'gray.400');

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
    <Box>
      <Heading size="xl" mb={2}>
        Welcome to TLC Shift
      </Heading>
      <Text color={textColor} mb={6}>
        Rental cars, discounts for car service and auto parts are in one place.
      </Text>

      <Stack gap={{ base: 6, sm: 8 }}>
        <Box>
          <Heading size="lg" mb={2}>
            Latest Rentals
          </Heading>

          <Box overflowX="auto">
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

        <Box>
          <Heading size="lg" mb={2}>
            Find Busy Areas
          </Heading>
          <HStack gap={4}>
            <Image
              onClick={() => router.push('/trips')}
              src="/mock-map.png"
              alt="NYC busy areas heat map"
              maxHeight="200px"
              borderRadius="md"
              objectFit="contain"
            />
            <Box color={textColor}>
              <Text mb={2}>Is it slow today?</Text>
              <Text mb={2}>
                Check out our map that shows busy areas based on historic Uber and Lyft data.
              </Text>
              <Box color={useColorModeValue('green.600', 'green.300')}>
                <Link href="/trips">Go to Map</Link>
              </Box>
            </Box>
          </HStack>
        </Box>

        <Box>
          <Heading size="lg">Discounts</Heading>
          <Text color={textColor} mb={2}>
            Register to get discounts on maintenance, repairs, auto parts, road assistance.
          </Text>

          <Box color={useColorModeValue('green.600', 'green.300')}>
            <Link href="/signup-login">Register</Link>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
