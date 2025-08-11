import { getUserListings } from '@/api/getUserListings';
import { Listing } from '@/lib/interfaces/Listing';
import { Box, Heading, Skeleton, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useMemo, useState } from 'react';
import { ListingCard } from '@/components/listing/listing-card';

const UserListingsPage: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>([]);

  const userId = useMemo(() => session?.user && (session.user as any).id, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signup-login');
      return;
    }
    if (status === 'authenticated' && userId) {
      const fetchListings = async () => {
        setIsLoading(true);
        const resp = await getUserListings(userId);
        if (resp) {
          setListings(resp.listings);
        }
        setIsLoading(false);
      };
      fetchListings();
    }
  }, [status, userId, router]);

  return (
    <Box>
      <Heading my={4}>My Listings</Heading>
      <Stack spacing={3}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={`skt-${idx}`} height={150} borderRadius="md" />
            ))
          : listings.map((listing) => (
              <Box key={listing._id} borderWidth="1px" borderRadius="md" overflow="hidden">
                <ListingCard
                  listing={listing}
                  onClick={() => listing._id && router.push(`/listings/${listing._id}`)}
                />
              </Box>
            ))}
      </Stack>
    </Box>
  );
};

export default UserListingsPage;
