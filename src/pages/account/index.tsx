import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Icon,
  HStack,
  Badge,
  Avatar,
  Stack,
  useColorModeValue,
  Button,
  Spinner,
  Center
} from '@chakra-ui/react';
import { MdEmail, MdPerson, MdLock } from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';
import { getSubscriptionInfo, SubscriptionInfoResponse } from '@/api/payments';

const Account = () => {
  const t = useTranslations('account');
  const session = useSession();
  const user = session.data?.user;

  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfoResponse | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const linkColor = useColorModeValue('green.600', 'green.300');
  const noteBg = useColorModeValue('green.50', 'green.900');
  const noteBorderColor = useColorModeValue('green.200', 'green.700');
  const noteTextColor = useColorModeValue('green.800', 'green.200');

  useEffect(() => {
    const loadSubscriptionInfo = async () => {
      if (!session.data?.user) {
        return;
      }

      try {
        setIsLoadingSubscription(true);
        const data = await getSubscriptionInfo();
        setSubscriptionInfo(data);
        setSubscriptionError(null);
      } catch (error) {
        console.error('Failed to load subscription info:', error);
        setSubscriptionError('Failed to load subscription information');
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    loadSubscriptionInfo();
  }, [session.data?.user]);

  const handleChangePassword = () => {
    console.log('Change password clicked');
  };

  return (
    <Box maxW="container.lg" mx="auto" py={8} px={4}>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            {t('title')}
          </Heading>
          <Text color={labelColor}>{t('subtitle')}</Text>
        </Box>

        {/* Profile Section */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={`${user?.firstName} ${user?.lastName}`}
                bg="green.500"
                color="white"
              />
              <VStack align="start" spacing={0}>
                <Heading size="md">
                  {user?.firstName} {user?.lastName}
                </Heading>
                <Text color={labelColor} fontSize="sm">
                  {t('memberSince')}
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Email */}
              <HStack spacing={3}>
                <Icon as={MdEmail} boxSize={5} color={labelColor} />
                <Box flex={1}>
                  <Text fontSize="sm" color={labelColor} mb={1}>
                    {t('email')}
                  </Text>
                  <Text fontWeight="medium">{user?.email}</Text>
                </Box>
              </HStack>

              <Divider />

              {/* Name */}
              <HStack spacing={3}>
                <Icon as={MdPerson} boxSize={5} color={labelColor} />
                <Box flex={1}>
                  <Text fontSize="sm" color={labelColor} mb={1}>
                    {t('fullName')}
                  </Text>
                  <Text fontWeight="medium">
                    {user?.firstName} {user?.lastName}
                  </Text>
                </Box>
              </HStack>

              <Divider />

              {/* Change Password */}
              <HStack spacing={3}>
                <Icon as={MdLock} boxSize={5} color={labelColor} />
                <Box flex={1}>
                  <Text fontSize="sm" color={labelColor} mb={1}>
                    {t('password')}
                  </Text>
                  <Link
                    color={linkColor}
                    fontWeight="semibold"
                    onClick={handleChangePassword}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {t('changePassword')}
                  </Link>
                </Box>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Subscription/Billing Section */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaMoneyBillWave} boxSize={6} color="green.500" />
              <Heading size="md">{t('subscriptionTitle')}</Heading>
            </HStack>
          </CardHeader>
          <Divider />
          <CardBody>
            {isLoadingSubscription ? (
              <Center py={8}>
                <VStack spacing={3}>
                  <Spinner size="lg" color="green.500" thickness="3px" />
                  <Text fontSize="sm" color={labelColor}>
                    Loading subscription info...
                  </Text>
                </VStack>
              </Center>
            ) : subscriptionError ? (
              <Center py={8}>
                <Text fontSize="sm" color="red.500">
                  {subscriptionError}
                </Text>
              </Center>
            ) : (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold" fontSize="lg">
                      {t('currentPlan')}
                    </Text>
                    <Text fontSize="sm" color={labelColor}>
                      {subscriptionInfo && subscriptionInfo.paid_listings_count > 0
                        ? `Paying for ${subscriptionInfo.paid_listings_count} listing${subscriptionInfo.paid_listings_count > 1 ? 's' : ''}`
                        : t('planDescription')}
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme={
                      subscriptionInfo && subscriptionInfo.monthly_charge > 0 ? 'blue' : 'green'
                    }
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {subscriptionInfo && subscriptionInfo.monthly_charge > 0
                      ? 'PAID'
                      : t('freePlan')}
                  </Badge>
                </HStack>

                <Divider />

                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  justify="space-between"
                  align="start"
                >
                  <Box>
                    <Text fontSize="sm" color={labelColor} mb={1}>
                      {t('monthlyCharge')}
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color={
                        subscriptionInfo && subscriptionInfo.monthly_charge > 0
                          ? 'blue.500'
                          : 'green.500'
                      }
                    >
                      ${subscriptionInfo?.monthly_charge.toFixed(2) ?? '0.00'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={labelColor} mb={1}>
                      {t('activeListings')}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {subscriptionInfo?.active_listings_count ?? 0}
                    </Text>
                  </Box>
                </Stack>

                <Box
                  p={4}
                  bg={noteBg}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={noteBorderColor}
                >
                  <Text fontSize="sm" color={noteTextColor}>
                    {subscriptionInfo && subscriptionInfo.monthly_charge === 0
                      ? t('freeFeatureNote')
                      : `You are being charged $${subscriptionInfo?.price_per_listing.toFixed(2)}/month per listing after your first ${subscriptionInfo?.free_listings_limit} free listings.`}
                  </Text>
                </Box>
              </VStack>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Account;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: await getMessages(locale ?? 'en')
    }
  };
};
