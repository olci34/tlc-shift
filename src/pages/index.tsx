import {
  Box,
  Heading,
  HStack,
  Text,
  Skeleton,
  Stack,
  Image,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ListingCard } from '@/components/listing/listing-card';
import { getListings, ListingResponse } from '@/api/getListings';
import { Listing } from '@/lib/interfaces/Listing';
import Link from 'next/link';
import { AddIcon, EmailIcon } from '@chakra-ui/icons';

export default function Home() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const newsletterEmail = useRef<HTMLInputElement>(null);
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const handleNewsletter = () => {
    const email = newsletterEmail.current?.value;
    if (email && emailRegex.test(email)) {
      setEmailError(false);
      console.log(email);
    } else {
      setEmailError(true);
    }
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
          <Heading size="lg">Join for Discounts</Heading>
          <Text color={textColor} mb={2}>
            Join to the waiting list to get discounts on many auto parts, tires, car services and
            more.
          </Text>

          <FormControl isRequired isInvalid={emailError} maxWidth="lg">
            <InputGroup>
              <InputLeftElement>
                <EmailIcon />
              </InputLeftElement>
              <Input
                variant="outline"
                name="email"
                type="email"
                placeholder="example@email.com"
                ref={newsletterEmail}
              />
              <InputRightElement width="4.5rem">
                <Button onClick={handleNewsletter} variant="ghost">
                  Join
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{'Invalid email address.'}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box>
          <Heading size="lg" mb={2}>
            Have a Car to Rent?
          </Heading>
          <Text color={textColor} mb={4}>
            List your vehicle and start earning extra income. Create a listing in minutes and reach
            thousands of potential renters.
          </Text>
          <Button
            leftIcon={<AddIcon />}
            backgroundColor={useColorModeValue('green.600', 'green.300')}
            color="white"
            _hover={{
              backgroundColor: useColorModeValue('green.700', 'green.400')
            }}
            onClick={() => router.push('/listings/create')}
          >
            Create New Listing
          </Button>
        </Box>

        <Box>
          <Heading size="lg" mb={2}>
            Latest Rentals
          </Heading>

          <Box overflowX="auto" mb={2}>
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
          <Button color={useColorModeValue('green.600', 'green.300')} variant="link">
            <Link href="/listings">See All Rentals</Link>
          </Button>
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
              <Button color={useColorModeValue('green.600', 'green.300')} variant="link">
                <Link href="/trips">Go to Map</Link>
              </Button>
            </Box>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
