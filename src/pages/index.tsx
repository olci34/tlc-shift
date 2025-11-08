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
  InputRightElement,
  VStack,
  SimpleGrid,
  Container,
  Icon,
  List,
  ListItem,
  ListIcon,
  Flex,
  Badge,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ListingCard } from '@/components/listing/listing-card';
import { getListings, ListingResponse } from '@/api/getListings';
import { Listing } from '@/lib/interfaces/Listing';
import Link from 'next/link';
import { AddIcon, EmailIcon, CheckCircleIcon, SearchIcon } from '@chakra-ui/icons';
import { FaCar, FaMapMarkedAlt, FaTags } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [featureRequest, setFeatureRequest] = useState('');
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

  const handleFeatureRequest = () => {
    if (featureRequest.trim().length > 0) {
      console.log('Feature request:', featureRequest);
      toast({
        title: 'Thank you for your feedback!',
        description: 'We appreciate your input and will consider your request.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      setFeatureRequest('');
    } else {
      toast({
        title: 'Please enter a feature request',
        description: "Tell us what you'd like to see in TLC Shift.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const bgGradient = useColorModeValue(
    'linear(to-r, green.50, teal.50)',
    'linear(to-r, gray.800, gray.700)'
  );
  const featureBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('green.600', 'green.300');

  return (
    <VStack spacing={0} align="stretch" w="full">
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
        borderRadius="lg"
        mb={12}
      >
        <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
          <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
            TLC Driver&apos;s Marketplace
          </Badge>
          <Heading size={{ base: 'xl', md: '2xl' }} fontWeight="bold">
            Your Complete TLC Business Solution
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color={textColor} maxW="2xl">
            Find rental vehicles, discover busy areas with historic data, and unlock exclusive
            discounts on auto parts, maintenance, and services.
          </Text>
          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="green"
              leftIcon={<SearchIcon />}
              onClick={() => router.push('/listings')}
            >
              Browse Rentals
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="green"
              leftIcon={<AddIcon />}
              onClick={() => router.push('/listings/create')}
            >
              List Your Vehicle
            </Button>
          </HStack>
        </VStack>

        {/* Featured Listings in Hero */}
        <Box mt={8} maxW="100%" overflow="hidden">
          <Box overflowX="auto" pb={4}>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -40, 0] }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                delay: 0.5
              }}
            >
              <HStack
                spacing={{ base: 3, sm: 4 }}
                align="stretch"
                justify="flex-start"
                px={{ base: 2, md: 4 }}
              >
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <Box
                        key={`skeleton-${index}`}
                        minWidth={{ base: '160px', sm: '220px', md: '250px' }}
                        maxWidth={{ base: '180px', sm: '280px', md: '320px' }}
                        flexShrink={0}
                      >
                        <Skeleton
                          height={{ base: '200px', sm: '220px', md: '240px' }}
                          borderRadius="lg"
                        />
                      </Box>
                    ))
                  : listings
                      .slice(0, 6)
                      .map((listing) => (
                        <ListingCard
                          key={listing._id}
                          listing={listing}
                          onClick={() => handleListingClick(listing._id!)}
                        />
                      ))}
              </HStack>
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Discount Waitlist Section - Prominent CTA */}
      <Box
        id="waitlist-section"
        bg={useColorModeValue('green.50', 'gray.700')}
        py={{ base: 10, md: 12 }}
        px={{ base: 6, md: 8 }}
        borderRadius="lg"
        mb={12}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
          <VStack align="start" spacing={4}>
            <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
              Limited Time Offer
            </Badge>
            <Heading size={{ base: 'lg', md: 'xl' }}>
              Join the Waitlist for Exclusive Discounts
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Get early access to significant savings on:
            </Text>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  Auto parts & tires
                </Text>{' '}
                - Up to 30% off
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  Maintenance & repairs
                </Text>{' '}
                - Exclusive partner rates
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  Insurance & registration
                </Text>{' '}
                - Special member pricing
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  Car wash & detailing
                </Text>{' '}
                - Monthly discounts
              </ListItem>
            </List>
          </VStack>

          <Box bg={featureBg} p={6} borderRadius="lg" shadow="lg">
            <VStack spacing={4} align="stretch">
              <Heading size="md" textAlign="center">
                Reserve Your Spot
              </Heading>
              <Text color={textColor} textAlign="center" fontSize="sm">
                Join thousands of TLC drivers already saving money. No commitment required.
              </Text>
              <FormControl isRequired isInvalid={emailError}>
                <InputGroup size="lg">
                  <InputLeftElement>
                    <EmailIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    variant="filled"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    ref={newsletterEmail}
                    _focus={{ bg: useColorModeValue('white', 'gray.700') }}
                  />
                </InputGroup>
                <FormErrorMessage>Please enter a valid email address</FormErrorMessage>
              </FormControl>
              <Button colorScheme="green" size="lg" onClick={handleNewsletter} width="full">
                Join Waitlist
              </Button>
              <Text fontSize="xs" color={textColor} textAlign="center">
                We respect your privacy. Unsubscribe anytime.
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Main Features Grid */}
      <Box mb={12}>
        <Heading size="lg" mb={6} textAlign="center">
          Our Services
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {/* Feature 1: Browse Rentals */}
          <Box
            bg={featureBg}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => router.push('/listings')}
          >
            <VStack align="start" spacing={4}>
              <Icon as={FaCar} boxSize={10} color={accentColor} />
              <Heading size="md">Find Your Perfect Rental</Heading>
              <Text color={textColor}>
                Browse hundreds of TLC-plated vehicles available for rent. Filter by make, model,
                year, and mileage to find exactly what you need.
              </Text>
              <Button variant="link" color={accentColor} rightIcon={<SearchIcon />}>
                Browse Listings
              </Button>
            </VStack>
          </Box>

          {/* Feature 2: Find Busy Areas */}
          <Box
            bg={featureBg}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => router.push('/trips')}
          >
            <VStack align="start" spacing={4}>
              <Icon as={FaMapMarkedAlt} boxSize={10} color={accentColor} />
              <Heading size="md">Find Busy Areas</Heading>
              <Text color={textColor}>
                Maximize your earnings with our heat map showing high-demand areas based on
                historical Uber and Lyft trip data across NYC.
              </Text>
              <Button variant="link" color={accentColor} rightIcon={<SearchIcon />}>
                View Map
              </Button>
            </VStack>
          </Box>

          {/* Feature 3: List Your Car */}
          <Box
            bg={featureBg}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => router.push('/listings/create')}
          >
            <VStack align="start" spacing={4}>
              <Icon as={AddIcon} boxSize={10} color={accentColor} />
              <Heading size="md">List Your Vehicle</Heading>
              <Text color={textColor}>
                Have a spare car or TLC plate? List it in minutes and start earning passive income
                by renting to verified drivers.
              </Text>
              <Button variant="link" color={accentColor} rightIcon={<AddIcon />}>
                Create Listing
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Feature Request Section */}
      <Box
        bg={featureBg}
        borderWidth="1px"
        borderColor={borderColor}
        p={{ base: 6, md: 8 }}
        borderRadius="lg"
      >
        <VStack spacing={4} align="stretch" maxW="2xl" mx="auto">
          <VStack spacing={2} textAlign="center">
            <Heading size="lg">Tell Us What You Need</Heading>
            <Text color={textColor}>
              Your feedback helps us build features that matter most to TLC drivers. Share your
              ideas and suggestions with us.
            </Text>
          </VStack>

          <FormControl>
            <Textarea
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              placeholder="I want to see..."
              rows={4}
              resize="vertical"
              maxLength={500}
              bg={useColorModeValue('white', 'gray.700')}
            />
            <Text fontSize="xs" color={textColor} textAlign="right" mt={1}>
              {featureRequest.length}/500 characters
            </Text>
          </FormControl>

          <Button
            colorScheme="green"
            size="lg"
            onClick={handleFeatureRequest}
            width={{ base: 'full', sm: 'auto' }}
            alignSelf="center"
          >
            Submit Feedback
          </Button>

          <Text fontSize="xs" color={textColor} textAlign="center">
            We review all feedback and use it to improve TLC Shift for our community.
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}
