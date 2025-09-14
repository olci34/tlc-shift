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
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import CldImageWithFallback from '@/components/cloudinary/cld-image-with-fallback';
import { useRouter } from 'next/router';
import { FC, useEffect, useState, useMemo } from 'react';
import { FaCar, FaHammer, FaRoad, FaGasPump, FaLocationDot, FaEnvelope } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import ContactModal from '@/components/contact-modal';

const ListingViewPage: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing>();
  const { id } = router.query;
  const [imageIdx, setImageIdx] = useState<number>(0);
  const loggedInUserId = useMemo(() => (session?.user as any)?.id, [session]);
  const editBtnBg = useColorModeValue('green.600', 'green.300');
  const deleteBtnBg = useColorModeValue('red.600', 'red.300');
  const priceColor = useColorModeValue('green.600', 'green.300');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const formatDate = (date?: Date) => {
    if (!date) return '';

    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  useEffect(() => {
    const fetchListing = async () => {
      const resp = await getListing(id as string);
      console.log('Listing data:', resp);
      console.log('Images:', resp?.images);
      setListing(resp);
    };

    fetchListing();
  }, [id]);

  return (
    <Box padding={{ base: 0, sm: 4 }}>
      <HStack>
        <Box flex={1}>
          <Heading size="lg">{listing?.title}</Heading>
          <Text color="#888D8B" fontSize="sm">
            Listed on {formatDate(listing?.created_at)}
          </Text>
          <Show below="md">
            <Text color={priceColor} fontWeight={800} fontSize="2xl" mt={2}>
              ${listing?.price}
              <Text as="span" color="#888D8B" fontWeight="normal" fontSize="lg">
                {' / week'}
              </Text>
            </Text>
          </Show>
        </Box>
        <Show above="md">
          <Box>
            <Text color={priceColor} fontWeight={800} fontSize="2xl">
              ${listing?.price}
              <Text as="span" color="#888D8B" fontWeight="normal" fontSize="lg">
                {' / week'}
              </Text>
            </Text>
          </Box>
        </Show>
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
              <CldImageWithFallback
                key={`main-image-${imageIdx}`}
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
                  onClick={() => {
                    console.log('Selecting image index:', idx, 'Image data:', img);
                    setImageIdx(idx);
                  }}
                  cursor="pointer"
                  border={idx === imageIdx ? '2px' : 'none'}
                  boxShadow={idx == imageIdx ? 'outline' : ''}
                  width={100}
                >
                  <CldImageWithFallback
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
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="md">Details</Heading>
            <Button
              leftIcon={<Icon as={FaEnvelope} />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={onOpen}
            >
              Contact
            </Button>
          </HStack>
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

      <ContactModal isOpen={isOpen} onClose={onClose} contact={listing?.contact} />
    </Box>
  );
};

export default ListingViewPage;
