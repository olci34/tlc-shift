import {
  Box,
  Heading,
  HStack,
  Text,
  Skeleton,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  VStack,
  SimpleGrid,
  Icon,
  List,
  ListItem,
  ListIcon,
  Badge,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ListingCard } from '@/components/listing/listing-card';
import { getListings, ListingResponse } from '@/api/getListings';
import { Listing } from '@/lib/interfaces/Listing';
import { AddIcon, EmailIcon, CheckCircleIcon, SearchIcon } from '@chakra-ui/icons';
import { FaCar, FaMapMarkedAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';
import { joinWaitlist } from '@/api/joinWaitlist';
import { submitFeedback } from '@/api/submitFeedback';
import { getVisitorIdSafe } from '@/lib/utils/visitor-id';
import * as gtag from '@/lib/analytics/gtag';

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [featureRequest, setFeatureRequest] = useState('');
  const [joiningWaitlist, setJoiningWaitlist] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
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

  const handleNewsletter = async () => {
    const email = newsletterEmail.current?.value;

    if (!email || !emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    setJoiningWaitlist(true);

    try {
      await joinWaitlist(email);

      gtag.trackEvent.joinWaitlist();

      toast({
        title: t('home.waitlistSuccess'),
        description: t('home.waitlistSuccessDescription'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });

      if (newsletterEmail.current) {
        newsletterEmail.current.value = '';
      }
    } catch (error: any) {
      // Handle duplicate entry (409 Conflict) as a warning
      if (error?.response?.status === 409) {
        toast({
          title: t('home.waitlistAlreadyJoined'),
          description: t('home.waitlistAlreadyJoinedDescription'),
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
      } else {
        // Handle other errors
        toast({
          title: t('home.waitlistError'),
          description: error?.response?.data?.detail || t('home.waitlistErrorDescription'),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
      }
    } finally {
      setJoiningWaitlist(false);
    }
  };

  const handleFeatureRequest = async () => {
    if (featureRequest.trim().length === 0) {
      toast({
        title: t('home.feedbackWarning'),
        description: t('home.feedbackWarningDescription'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    setSubmittingFeedback(true);

    try {
      // Get existing visitor_id that was created on app load
      const visitorId = getVisitorIdSafe();
      await submitFeedback(featureRequest, visitorId);

      gtag.trackEvent.submitFeedback();

      toast({
        title: t('home.feedbackSuccess'),
        description: t('home.feedbackSuccessDescription'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      setFeatureRequest('');
    } catch (error: any) {
      toast({
        title: t('home.feedbackError'),
        description: error?.response?.data?.detail || t('home.feedbackErrorDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setSubmittingFeedback(false);
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
            {t('home.badge')}
          </Badge>
          <Heading size={{ base: 'xl', md: '2xl' }} fontWeight="bold">
            {t('home.heroTitle')}
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color={textColor} maxW="2xl">
            {t('home.heroDescription')}
          </Text>
          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="green"
              leftIcon={<SearchIcon />}
              onClick={() => router.push('/listings')}
            >
              {t('home.browseRentals')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="green"
              leftIcon={<AddIcon />}
              onClick={() => router.push('/listings/create')}
            >
              {t('home.listYourVehicle')}
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
                  : listings.slice(0, 6).map((listing) => (
                      <Box
                        key={listing._id}
                        minWidth={{ base: '160px', sm: '220px', md: '250px' }}
                        maxWidth={{ base: '180px', sm: '280px', md: '320px' }}
                        flexShrink={0}
                      >
                        <ListingCard
                          listing={listing}
                          onClick={() => handleListingClick(listing._id!)}
                        />
                      </Box>
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
              {t('home.waitlistBadge')}
            </Badge>
            <Heading size={{ base: 'lg', md: 'xl' }}>{t('home.waitlistTitle')}</Heading>
            <Text fontSize="lg" color={textColor}>
              {t('home.waitlistDescription')}
            </Text>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  {t('home.waitlistBenefit1')}
                </Text>{' '}
                - {t('home.waitlistBenefit1Detail')}
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  {t('home.waitlistBenefit2')}
                </Text>{' '}
                - {t('home.waitlistBenefit2Detail')}
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  {t('home.waitlistBenefit3')}
                </Text>{' '}
                - {t('home.waitlistBenefit3Detail')}
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="medium">
                  {t('home.waitlistBenefit4')}
                </Text>{' '}
                - {t('home.waitlistBenefit4Detail')}
              </ListItem>
            </List>
          </VStack>

          <Box bg={featureBg} p={6} borderRadius="lg" shadow="lg">
            <VStack spacing={4} align="stretch">
              <Heading size="md" textAlign="center">
                {t('home.reserveSpot')}
              </Heading>
              <Text color={textColor} textAlign="center" fontSize="sm">
                {t('home.waitlistSubtext')}
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
                    placeholder={t('home.waitlistEmailPlaceholder')}
                    ref={newsletterEmail}
                    _focus={{ bg: useColorModeValue('white', 'gray.700') }}
                  />
                </InputGroup>
                <FormErrorMessage>{t('home.waitlistEmailError')}</FormErrorMessage>
              </FormControl>
              <Button
                colorScheme="green"
                size="lg"
                onClick={handleNewsletter}
                width="full"
                isLoading={joiningWaitlist}
                loadingText={t('home.joiningWaitlist')}
              >
                {t('home.joinWaitlist')}
              </Button>
              <Text fontSize="xs" color={textColor} textAlign="center">
                {t('home.waitlistPrivacy')}
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Main Features Grid */}
      <Box mb={12}>
        <Heading size="lg" mb={6} textAlign="center">
          {t('home.servicesTitle')}
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
              <Heading size="md">{t('home.feature1Title')}</Heading>
              <Text color={textColor}>{t('home.feature1Description')}</Text>
              <Button variant="link" color={accentColor} rightIcon={<SearchIcon />}>
                {t('home.feature1Action')}
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
              <Heading size="md">{t('home.feature2Title')}</Heading>
              <Text color={textColor}>{t('home.feature2Description')}</Text>
              <Button variant="link" color={accentColor} rightIcon={<SearchIcon />}>
                {t('home.feature2Action')}
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
              <Heading size="md">{t('home.feature3Title')}</Heading>
              <Text color={textColor}>{t('home.feature3Description')}</Text>
              <Button variant="link" color={accentColor} rightIcon={<AddIcon />}>
                {t('home.feature3Action')}
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
            <Heading size="lg">{t('home.feedbackTitle')}</Heading>
            <Text color={textColor}>{t('home.feedbackDescription')}</Text>
          </VStack>

          <FormControl>
            <Textarea
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              placeholder={t('home.feedbackPlaceholder')}
              rows={4}
              resize="vertical"
              maxLength={500}
              bg={useColorModeValue('white', 'gray.700')}
            />
            <Text fontSize="xs" color={textColor} textAlign="right" mt={1}>
              {t('home.feedbackCharCount', { count: featureRequest.length })}
            </Text>
          </FormControl>

          <Button
            colorScheme="green"
            size="lg"
            onClick={handleFeatureRequest}
            width={{ base: 'full', sm: 'auto' }}
            alignSelf="center"
            isLoading={submittingFeedback}
            loadingText={t('home.feedbackSubmitting')}
          >
            {t('home.feedbackSubmit')}
          </Button>

          <Text fontSize="xs" color={textColor} textAlign="center">
            {t('home.feedbackDisclaimer')}
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: await getMessages(locale ?? 'en')
    }
  };
};
