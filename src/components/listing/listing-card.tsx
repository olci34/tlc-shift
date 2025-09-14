import { Listing } from '@/lib/interfaces/Listing';
import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import CldImageWithFallback from '../cloudinary/cld-image-with-fallback';
import React from 'react';

export interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <Card
      minWidth={250}
      maxWidth={{ base: 'full', sm: '32%' }}
      flex={1}
      direction={{ base: 'row', sm: 'column' }}
      borderTopLeftRadius="0.5rem"
      borderTopRightRadius="0.5rem"
      overflow="hidden"
      onClick={onClick}
      cursor="pointer"
    >
      <Box height={150} width={{ base: '40%', sm: 'full' }} position="relative" flexShrink={0}>
        <CldImageWithFallback
          src={listing.images[0].cld_public_id ?? ''}
          alt={`Listing Image ${listing.images[0].name}`}
          fill
          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 50vw, 10vw"
          aspectRatio="fill_pad"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </Box>
      <CardBody padding={2} width="full">
        <Heading size="sm" fontWeight="normal" noOfLines={1} marginBottom={2}>
          {listing.title}
        </Heading>
        <Text display="inline" color={useColorModeValue('green.600', 'green.300')} fontWeight={800}>
          {`$${listing.price}`}
          <span style={{ color: '#888D8B', fontWeight: 'normal' }}> / week</span>
        </Text>
        {listing.listing_category === 'Vehicle' && (
          <VStack alignItems="flex-start" gap={0}>
            <Text>{`${listing.item.make} ${listing.item.model}`}</Text>
            <HStack color="#888D8B" fontSize="sm">
              <Text>{listing.item.year}</Text>
              <Text>{listing.item.fuel}</Text>
              <Text>{`${listing.item.mileage?.toLocaleString()} mil.`}</Text>
            </HStack>
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};
