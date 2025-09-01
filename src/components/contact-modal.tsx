import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { ListingContact } from '@/lib/interfaces/Listing';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ListingContact;
}

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, contact }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const contactValueColor = useColorModeValue('gray.700', 'gray.300');

  const handleLoginClick = (): void => {
    onClose();
    router.push('/signup-login');
  };

  const handleSignupClick = (): void => {
    onClose();
    router.push('/signup-login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {session ? (
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color={descriptionColor}>
                Contact the seller using the information below:
              </Text>
              <Box>
                <HStack spacing={3} mb={2}>
                  <Icon as={FaEnvelope} color="blue.500" />
                  <Text fontWeight="medium">Email</Text>
                </HStack>
                <Text ml={7} color={contactValueColor}>
                  {contact?.email || 'No email provided'}
                </Text>
              </Box>
              <Box>
                <HStack spacing={3} mb={2}>
                  <Icon as={FaPhone} color="green.500" />
                  <Text fontWeight="medium">Phone</Text>
                </HStack>
                <Text ml={7} color={contactValueColor}>
                  {contact?.phone || 'No phone provided'}
                </Text>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Text textAlign="center" color={descriptionColor}>
                Please sign in or create an account to view contact information
              </Text>
              <HStack spacing={3} width="full">
                <Button colorScheme="blue" variant="outline" flex={1} onClick={handleLoginClick}>
                  Login
                </Button>
                <Button colorScheme="blue" flex={1} onClick={handleSignupClick}>
                  Sign Up
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContactModal;