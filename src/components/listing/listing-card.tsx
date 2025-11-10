import { Listing } from '@/lib/interfaces/Listing';
import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Badge
} from '@chakra-ui/react';
import CldImageWithFallback from '../cloudinary/cld-image-with-fallback';
import React from 'react';
import { useTranslations } from 'next-intl';

export interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const t = useTranslations();
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const priceColor = useColorModeValue('green.600', 'green.300');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Card
      width="full"
      maxWidth="320px"
      direction="column"
      borderRadius="lg"
      overflow="hidden"
      onClick={onClick}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-2px)'
      }}
      borderWidth="1px"
      borderColor={borderColor}
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Box
        height={{ base: '120px', sm: '140px', md: '160px' }}
        width="full"
        position="relative"
        flexShrink={0}
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        <CldImageWithFallback
          src={listing.images[0].cld_public_id ?? ''}
          alt={`Listing Image ${listing.images[0].name}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          aspectRatio="fill_pad"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {listing.listing_category === 'Plate' && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="blue"
            fontSize={{ base: '2xs', sm: 'xs' }}
          >
            {t('listings.plateBadge')}
          </Badge>
        )}
      </Box>
      <CardBody p={{ base: 2, sm: 3 }} width="full">
        <VStack align="stretch" spacing={{ base: 1, sm: 2 }}>
          <Heading size={{ base: 'xs', sm: 'sm' }} fontWeight="semibold" noOfLines={1}>
            {listing.title}
          </Heading>

          <HStack spacing={1} align="baseline">
            <Text fontSize={{ base: 'md', sm: 'lg' }} color={priceColor} fontWeight="bold">
              ${listing.price}
            </Text>
            <Text fontSize={{ base: '2xs', sm: 'xs' }} color={subTextColor}>
              {t('listings.pricePerWeek')}
            </Text>
          </HStack>

          {listing.listing_category === 'Vehicle' && (
            <VStack alignItems="flex-start" spacing={0.5} mt={1}>
              <Text fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="medium" noOfLines={1}>
                {`${listing.item.make} ${listing.item.model}`}
              </Text>
              <HStack
                fontSize={{ base: '2xs', sm: 'xs' }}
                color={subTextColor}
                spacing={{ base: 1, sm: 2 }}
                flexWrap="wrap"
              >
                <Text>{listing.item.year}</Text>
                <Text>•</Text>
                <Text>{listing.item.fuel}</Text>
                <Text>•</Text>
                <Text noOfLines={1}>{`${listing.item.mileage?.toLocaleString()} mi`}</Text>
              </HStack>
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};
