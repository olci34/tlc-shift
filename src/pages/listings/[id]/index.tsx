import { getListing } from '@/api/getListing';
import { Listing } from '@/lib/interfaces/Listing';
import { ArrowLeftIcon, ArrowRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  Show,
  VStack
} from '@chakra-ui/react';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/router';
import { FC, useEffect, useState, useMemo } from 'react';
import { FaCar, FaHammer, FaRoad, FaGasPump, FaLocationDot } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';

const ListingViewPage: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing>();
  const { id } = router.query;
  const [imageIdx, setImageIdx] = useState<number>(0);
  const loggedInUserId = useMemo(() => (session?.user as any)?.id, [session]);
  const editBtnBg = useColorModeValue('green.600', 'green.300');
  const deleteBtnBg = useColorModeValue('red.600', 'red.300');

  useEffect(() => {
    const fetchListing = async () => {
      const resp = await getListing(id as string);
      setListing(resp);
    };

    fetchListing();
  }, [id]);

  return (
    <Box padding={{ base: 0, sm: 4 }}>
      <HStack>
        <Box>
          <Heading size="lg">{listing?.title}</Heading>
          <Text color="#888D8B" fontSize="sm">
            Listed on April 20
          </Text>
        </Box>
        <Box ml="auto">
          <Show above="sm">
            {listing?.user_id && loggedInUserId === listing.user_id && (
              <HStack>
                <Button
                  leftIcon={<EditIcon />}
                  backgroundColor={editBtnBg}
                  onClick={() => router.push(`/listings/${listing?._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  backgroundColor={deleteBtnBg}
                  onClick={() => {
                    // TODO: implement delete
                  }}
                >
                  Delete
                </Button>
              </HStack>
            )}
          </Show>
        </Box>
      </HStack>
      <Box width={'full'} my={4}>
        <Box
          position="relative"
          height={[200, 300, 400]}
          maxW={775}
          overflow="hidden"
          borderRadius="lg"
        >
          {listing?.images && listing.images.length ? (
            <>
              <CldImage
                src={listing?.images[imageIdx].cld_public_id ?? ''}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 40vw"
                aspectRatio="fill_pad"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                alt="Listing Image"
              />

              <Button
                leftIcon={<ArrowLeftIcon />}
                onClick={() => setImageIdx(imageIdx - 1)}
                disabled={imageIdx === 0}
                position="absolute"
                backgroundColor="gray.600"
                top="45%"
                display={{ base: 'none', sm: 'inline' }}
                opacity={0.3}
                left={0}
              ></Button>

              <Button
                onClick={() => setImageIdx(imageIdx + 1)}
                disabled={imageIdx + 1 === listing?.images.length}
                rightIcon={<ArrowRightIcon />}
                hideBelow="md"
                position="absolute"
                top="45%"
                display={{ base: 'none', sm: 'inline' }}
                backgroundColor="gray.600"
                opacity={0.3}
                right={0}
              ></Button>
            </>
          ) : (
            <Skeleton width="full" height="full" />
          )}
        </Box>

        <Box
          width="full"
          height={100}
          display="flex"
          flexDirection="row"
          gap={2}
          my={2}
          overflowX="scroll"
        >
          {listing?.images && listing.images.length ? (
            <>
              {listing?.images.map((img, idx) => (
                <Box
                  key={img.cld_public_id}
                  overflow="hidden"
                  flexShrink={0}
                  m={0}
                  borderRadius="lg"
                  onClick={() => setImageIdx(idx)}
                  cursor="pointer"
                  border={idx === imageIdx ? '2px' : 'none'}
                  boxShadow={idx == imageIdx ? 'outline' : ''}
                  width={100}
                >
                  <CldImage
                    src={listing?.images[idx].cld_public_id ?? ''}
                    width={100}
                    height={100}
                    crop="fill"
                    alt="Listing Image"
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 50vw, 10vw"
                  />
                </Box>
              ))}
            </>
          ) : (
            <>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={`sm-skt-${idx}`} height={100} width={100} />
              ))}
            </>
          )}
        </Box>
      </Box>

      <Stack direction={{ base: 'column', md: 'row' }} marginY={{ base: 6, sm: 10 }} rowGap={6}>
        <Stack
          direction={{ base: 'row', md: 'column' }}
          minWidth={{ base: 'full', sm: 300 }}
          columnGap={8}
        >
          <Stack>
            <HStack>
              <Icon as={FaCar} boxSize={{ md: 6 }} />
              <Text>
                {listing?.item.make} - {listing?.item.model}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaRoad} boxSize={{ md: 6 }} />
              <Text>{listing?.item.mileage?.toLocaleString()} mil.</Text>
            </HStack>
          </Stack>
          <Stack>
            <HStack>
              <Icon as={FaHammer} boxSize={{ md: 6 }} />
              <Text>{listing?.item.year}</Text>
            </HStack>
            <HStack>
              <Icon as={FaGasPump} boxSize={{ md: 6 }} />
              <Text>{listing?.item.fuel}</Text>
            </HStack>
          </Stack>
        </Stack>
        <Box>
          <Heading size="md">Details</Heading>
          <Box justifyContent="space-between">
            <Text marginTop={2} whiteSpace="pre-wrap">
              {listing?.description}
            </Text>
            <Text fontSize="sm" color="#888D8B" position="relative">
              <Icon as={FaLocationDot} display="inline" /> {listing?.location.county}{' '}
              {listing?.location.state}
            </Text>
          </Box>
          <Show below="sm">
            {listing?.user_id && loggedInUserId === listing.user_id && (
              <VStack mt={3} align="stretch">
                <Button
                  leftIcon={<EditIcon />}
                  backgroundColor={editBtnBg}
                  onClick={() => router.push(`/listings/${listing?._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  backgroundColor={deleteBtnBg}
                  onClick={() => {
                    // TODO: implement delete
                  }}
                >
                  Delete
                </Button>
              </VStack>
            )}
          </Show>
        </Box>
      </Stack>

      <Divider />
    </Box>
  );
};

export default ListingViewPage;
