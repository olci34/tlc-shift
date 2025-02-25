import ListingForm from '@/components/form/listing-form';
import { Heading, Stack } from '@chakra-ui/react';
import React from 'react';

const CreateListingPage = () => {
  return (
    <Stack direction="column">
      <Heading>New Listing</Heading>
      <ListingForm />
    </Stack>
  );
};

export default CreateListingPage;
