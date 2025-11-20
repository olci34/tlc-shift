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
  Center,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getListing } from '@/api/getListing';
import { createCheckoutSession } from '@/api/payments';
import type { Listing } from '@/lib/interfaces/Listing';
import * as gtag from '@/lib/analytics/gtag';
import { WarningIcon } from '@chakra-ui/icons';

const PaymentFailedPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listingId = router.query.listing_id as string;

    if (listingId) {
      loadListing(listingId);
      // Track payment cancellation
      gtag.trackEvent.paymentCancelled('listing');
    }
  }, [router.query.listing_id]);

  const loadListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const data = await getListing(listingId);
      setListing(data);
    } catch (err) {
      console.error('Failed to load listing:', err);
      setError('Failed to load listing details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!listing?._id) return;

    setIsRetrying(true);

    try {
      // Track payment retry
      gtag.trackEvent.paymentInitiated('listing', listing.price);

      // Create new checkout session
      const baseUrl = window.location.origin;
      const checkoutResponse = await createCheckoutSession({
        payment_type: 'listing',
        listing_id: listing._id,
        success_url: `${baseUrl}/listings/success`,
        cancel_url: `${baseUrl}/listings/payment-failed`
      });

      if (!checkoutResponse.success || !checkoutResponse.checkout_url) {
        throw new Error(checkoutResponse.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutResponse.checkout_url;
    } catch (err: any) {
      console.error('Failed to retry payment:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to start payment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setIsRetrying(false);
    }
  };

  const handleBackToListings = () => {
    router.push('/listings/create');
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="orange.500" thickness="4px" />
          <Text>Loading listing details...</Text>
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
        {/* Payment Failed Alert */}
        <Alert
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minH="200px"
          borderRadius="lg"
        >
          <WarningIcon boxSize="50px" mr={0} color="orange.500" />
          <AlertTitle mt={4} mb={1} fontSize="2xl">
            Payment Not Completed
          </AlertTitle>
          <AlertDescription maxWidth="sm" fontSize="md">
            Your payment was not completed. Your listing has been saved but is currently inactive.
            Complete the payment to make your listing visible to others.
          </AlertDescription>
        </Alert>

        {/* Listing Card */}
        <Card>
          <CardBody>
            <Stack spacing={4}>
              <HStack justify="space-between" align="flex-start">
                <Heading size="md">{listing.title}</Heading>
                <Badge colorScheme="gray" fontSize="sm">
                  INACTIVE
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
                  opacity={0.7}
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

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Payment Required</AlertTitle>
                  <AlertDescription fontSize="xs">
                    This listing requires a $5 payment to activate. Once activated, it will be
                    visible to all users.
                  </AlertDescription>
                </Box>
              </Alert>
            </Stack>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <HStack spacing={4} justify="center">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleRetryPayment}
            isLoading={isRetrying}
            loadingText="Redirecting to payment..."
          >
            Try Payment Again
          </Button>
          <Button variant="outline" size="lg" onClick={handleBackToListings}>
            Back to Listings
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PaymentFailedPage;
