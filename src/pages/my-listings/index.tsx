import { getUserListings } from '@/api/getUserListings';
import { Listing } from '@/lib/interfaces/Listing';
import { Box, Heading, Skeleton, Stack, Button, useColorModeValue, HStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useMemo, useState } from 'react';
import { ListingCard } from '@/components/listing/listing-card';
import Paginator from '@/components/paginator/paginator';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';

const UserListingsPage: FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const numPerPage = 21;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / numPerPage);

  const userId = useMemo(() => session?.user && (session.user as any).id, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signup-login');
      return;
    }
    if (status === 'authenticated' && userId) {
      const fetchListings = async () => {
        setIsLoading(true);
        const resp = await getUserListings(userId, page, numPerPage);
        if (resp) {
          setListings(resp.listings);
          setTotal(resp.total);
        }
        setIsLoading(false);
      };
      fetchListings();
    }
  }, [status, userId, router, page]);

  return (
    <Box>
      <HStack justify="space-between" align="center" my={4}>
        <Heading>{t('myListings.title')}</Heading>
        <Button
          leftIcon={<AddIcon />}
          backgroundColor={useColorModeValue('green.600', 'green.300')}
          onClick={() => router.push('/listings/create')}
        >
          {t('myListings.newListing')}
        </Button>
      </HStack>
      <Box paddingY={2}>
        <Stack direction={{ base: 'column', sm: 'row' }} wrap="wrap" justify="flex-start">
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={`skt-${idx}`} height={150} borderRadius="md" />
              ))
            : listings?.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onClick={() => {
                    if (listing._id) router.push(`/listings/${listing._id}`);
                  }}
                />
              ))}
        </Stack>
      </Box>
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </Box>
  );
};

export default UserListingsPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: await getMessages(locale ?? 'en')
    }
  };
};
