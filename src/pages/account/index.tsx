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
  Grid,
  GridItem,
  Link,
  Icon,
  HStack
} from '@chakra-ui/react';
import { MdOutlinePermIdentity } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';

const Account = () => {
  // const [userInfo, setUserInfo] = useState<UserInfo>();
  const t = useTranslations();
  const session = useSession();
  const user = session.data?.user;

  return (
    <Box maxW="container.md" mx="auto" py={8} px={4}>
      <VStack>
        <VStack spacing={2} width="100%" p={2} align="stretch">
          <Card>
            <HStack>
              <Icon as={MdOutlinePermIdentity} boxSize={6}></Icon>
              <VStack>
                <Text>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text>{user?.email}</Text>
              </VStack>
            </HStack>
          </Card>
          <Box p={2}>
            <Icon boxSize={6} as={MdOutlinePermIdentity} />
            <Text>
              {user?.firstName} {user?.lastName}
            </Text>
          </Box>

          <Box p={2}>
            <Text fontWeight="bold" mb={2}>
              {t('account.email')}
            </Text>
            <Text>{user?.email}</Text>
          </Box>

          <Box p={2}>
            <Link href="/change-password" color="green">
              {t('account.changePassword')}
            </Link>
          </Box>
        </VStack>
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
