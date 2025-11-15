import { useSession } from 'next-auth/react';
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
  Button
} from '@chakra-ui/react';
import { MdEmail, MdPerson, MdLock } from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';

const Account = () => {
  const t = useTranslations('account');
  const session = useSession();
  const user = session.data?.user;

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const linkColor = useColorModeValue('green.600', 'green.300');

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
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold" fontSize="lg">
                    {t('currentPlan')}
                  </Text>
                  <Text fontSize="sm" color={labelColor}>
                    {t('planDescription')}
                  </Text>
                </VStack>
                <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="md">
                  {t('freePlan')}
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
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    $0.00
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={labelColor} mb={1}>
                    {t('activeListings')}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    0
                  </Text>
                </Box>
              </Stack>

              <Box
                p={4}
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="md"
                borderWidth="1px"
                borderColor={useColorModeValue('green.200', 'green.700')}
              >
                <Text fontSize="sm" color={useColorModeValue('green.800', 'green.200')}>
                  {t('freeFeatureNote')}
                </Text>
              </Box>
            </VStack>
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
