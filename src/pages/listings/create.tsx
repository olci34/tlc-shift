import ListingForm from '@/components/form/listing-form';
import { Heading, Stack, useToast, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { createListing } from '@/api/createListing';
import { checkPaymentRequirement, createCheckoutSession } from '@/api/payments';
import type { Listing } from '@/lib/interfaces/Listing';
import * as gtag from '@/lib/analytics/gtag';

const CreateListingPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [requiresPayment, setRequiresPayment] = useState(false);
  const [paymentCheckMessage, setPaymentCheckMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load payment requirement on mount
  useEffect(() => {
    loadPaymentInfo();
  }, []);

  const loadPaymentInfo = async () => {
    try {
      const requirement = await checkPaymentRequirement();
      setRequiresPayment(requirement.requires_payment);
      setPaymentCheckMessage(requirement.message);
    } catch (error) {
      console.error('Failed to load payment info:', error);
    }
  };

  const handleSubmit = async (listing: Listing) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Check if payment is required
      const requirement = await checkPaymentRequirement();

      if (requirement.requires_payment) {
        // Create listing as INACTIVE
        const inactiveListing = { ...listing, active: false };
        const result = await createListing(inactiveListing);

        if (!result?._id) {
          throw new Error('Failed to create listing');
        }

        // Track payment initiation
        gtag.trackEvent.paymentInitiated('listing', listing.price);

        // Create checkout session
        const baseUrl = window.location.origin;
        const checkoutResponse = await createCheckoutSession({
          payment_type: 'listing',
          listing_id: result._id,
          success_url: `${baseUrl}/listings/success`,
          cancel_url: `${baseUrl}/listings/payment-failed`
        });

        if (!checkoutResponse.success || !checkoutResponse.checkout_url) {
          throw new Error(checkoutResponse.message || 'Failed to create checkout session');
        }

        // Redirect to Stripe checkout
        window.location.href = checkoutResponse.checkout_url;
      } else {
        // No payment required, create listing as active
        await submitListing(listing);
      }
    } catch (error) {
      console.error('Failed to process listing submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit listing. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setIsSubmitting(false);
    }
  };

  const submitListing = async (listing: Listing) => {
    try {
      const result = await createListing(listing);
      if (result && listing.listing_category) {
        // Track listing creation in Google Analytics
        gtag.trackEvent.createListing(listing.listing_category, listing.price);

        // Cleanup object URLs for new images
        listing.images.forEach((img) => {
          if (!img.cld_public_id && img.src) {
            URL.revokeObjectURL(img.src);
          }
        });

        toast({
          title: 'Listing Created!',
          description: 'Your listing has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });

        router.push(`/listings/${result._id}`);
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
      throw error;
    }
  };

  // Get submit button text based on payment requirement
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return requiresPayment ? 'Creating listing...' : 'Creating...';
    }
    return requiresPayment ? 'Go to Payment' : 'Create Listing';
  };

  return (
    <Stack direction="column">
      <Heading>New Rental Listing</Heading>

      {paymentCheckMessage && (
        <Alert
          status={requiresPayment ? 'warning' : 'info'}
          borderRadius="md"
          variant="left-accent"
        >
          <AlertIcon />
          <AlertDescription>{paymentCheckMessage}</AlertDescription>
        </Alert>
      )}

      <ListingForm
        onSubmit={handleSubmit}
        submitButtonText={getSubmitButtonText()}
        isSubmitting={isSubmitting}
      />
    </Stack>
  );
};

export default CreateListingPage;
