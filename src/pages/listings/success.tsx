import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  Image,
  Stack,
  Badge,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getListing } from '@/api/getListing';
import type { Listing } from '@/lib/interfaces/Listing';
import * as gtag from '@/lib/analytics/gtag';
import { CheckCircleIcon } from '@chakra-ui/icons';

const ListingSuccessPage = () => {
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listingId = router.query.listing_id as string;

    if (listingId) {
      loadListing(listingId);
      // Track successful payment
      gtag.trackEvent.paymentSuccess('listing', 5.0, listingId);
    }
  }, [router.query.listing_id]);

  const loadListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const data = await getListing(listingId);
      setListing(data || null);
    } catch (err) {
      console.error('Failed to load listing:', err);
      setError('Failed to load listing details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewListing = () => {
    if (listing?._id) {
      router.push(`/listings/${listing._id}`);
    }
  };

  const handleAddMoreListings = () => {
    router.push('/listings/create');
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="green.500" thickness="4px" />
          <Text>Loading your listing...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !listing) {
    return (
      <Box maxW="container.md" mx="auto" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertDescription>{error || 'Listing not found'}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Success Alert */}
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minH="200px"
          borderRadius="lg"
        >
          <CheckCircleIcon boxSize="50px" mr={0} color="green.500" />
          <AlertTitle mt={4} mb={1} fontSize="2xl">
            Success! Your listing is published.
          </AlertTitle>
          <AlertDescription maxWidth="sm" fontSize="md">
            Your payment was successful and your listing is now live. Other users can now see and
            contact you about your listing.
          </AlertDescription>
        </Alert>

        {/* Listing Card */}
        <Card>
          <CardBody>
            <Stack spacing={4}>
              <HStack justify="space-between" align="flex-start">
                <Heading size="md">{listing.title}</Heading>
                <Badge colorScheme="green" fontSize="sm">
                  ACTIVE
                </Badge>
              </HStack>

              {listing.images && listing.images.length > 0 && (
                <Image
                  src={listing.images[0].src}
                  alt={listing.title}
                  borderRadius="md"
                  objectFit="cover"
                  maxH="300px"
                  w="100%"
                />
              )}

              <Text color="gray.600" noOfLines={3}>
                {listing.description}
              </Text>

              <HStack justify="space-between">
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Price
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    ${listing.price}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Category
                  </Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {listing.listing_category}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Type
                  </Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {listing.transaction_type}
                  </Text>
                </VStack>
              </HStack>
            </Stack>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <HStack spacing={4} justify="center">
          <Button colorScheme="blue" size="lg" onClick={handleViewListing}>
            View My Listing
          </Button>
          <Button variant="outline" size="lg" onClick={handleAddMoreListings}>
            Add More Listings
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ListingSuccessPage;
