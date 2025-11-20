import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Divider
} from '@chakra-ui/react';
import { FC, useState, useEffect } from 'react';
import { createCheckoutSession, getStripeConfig } from '@/api/payments';
import * as gtag from '@/lib/analytics/gtag';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: 'listing' | 'promote_listing';
  listingId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentModal: FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentType,
  listingId,
  onSuccess,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricePerListing, setPricePerListing] = useState<number>(5.0);

  // Load pricing when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPricing();
    }
  }, [isOpen]);

  const loadPricing = async () => {
    try {
      const config = await getStripeConfig();
      setPricePerListing(config.price_per_listing);
    } catch (err) {
      console.error('Failed to load pricing:', err);
      setError('Failed to load payment configuration. Please try again.');
    }
  };

  const handleProceedToPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Track payment initiation
      gtag.trackEvent.paymentInitiated(paymentType, pricePerListing);

      // Get current URL for success/cancel redirects
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/listings/create?payment=success`;
      const cancelUrl = `${baseUrl}/listings/create?payment=cancelled`;

      // Create checkout session
      const response = await createCheckoutSession({
        payment_type: paymentType,
        listing_id: listingId,
        success_url: successUrl,
        cancel_url: cancelUrl
      });

      if (!response.success || !response.checkout_url) {
        throw new Error(response.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe-hosted checkout page
      window.location.href = response.checkout_url;
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      gtag.trackEvent.paymentFailed(paymentType, errorMessage);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      gtag.trackEvent.paymentCancelled(paymentType);
      if (onCancel) {
        onCancel();
      }
      onClose();
    }
  };

  const getPaymentTitle = () => {
    switch (paymentType) {
      case 'listing':
        return 'Complete Your Listing Payment';
      case 'promote_listing':
        return 'Promote Your Listing';
      default:
        return 'Complete Payment';
    }
  };

  const getPaymentDescription = () => {
    switch (paymentType) {
      case 'listing':
        return 'You have used your 2 free listing slots. Additional listings require a monthly payment to keep them active.';
      case 'promote_listing':
        return 'Promote your listing to reach more potential customers.';
      default:
        return 'Complete your payment to continue.';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" closeOnOverlayClick={!isLoading}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getPaymentTitle()}</ModalHeader>
        {!isLoading && <ModalCloseButton />}
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              {getPaymentDescription()}
            </Text>

            <Divider />

            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="semibold">Payment Type:</Text>
                  <Text>{paymentType.replace('_', ' ').toUpperCase()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="semibold">Amount:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    ${pricePerListing.toFixed(2)}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  Billed monthly while listing is active
                </Text>
              </VStack>
            </Box>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="sm">Secure Payment</AlertTitle>
                <AlertDescription fontSize="xs">
                  You&apos;ll be redirected to Stripe&apos;s secure checkout page. We support
                  credit/debit cards, Apple Pay, and Google Pay.
                </AlertDescription>
              </Box>
            </Alert>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Payment Error</AlertTitle>
                  <AlertDescription fontSize="xs">{error}</AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleProceedToPayment}
              isLoading={isLoading}
              loadingText="Redirecting to Stripe..."
              leftIcon={isLoading ? <Spinner size="sm" /> : undefined}
            >
              Proceed to Payment
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
