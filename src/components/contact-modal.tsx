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
import { useTranslations } from 'next-intl';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ListingContact;
}

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, contact }) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const contactCardBg = useColorModeValue('gray.50', 'gray.700');

  const handleLoginClick = (): void => {
    onClose();
    router.push('/signup-login');
  };

  const handleSignupClick = (): void => {
    onClose();
    router.push('/signup-login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'sm', md: 'md' }}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>{t('contactModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {session ? (
            <VStack spacing={5} align="stretch">
              {/* Email Section */}
              <Box
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                bg={contactCardBg}
                _hover={{ shadow: 'md', borderColor: 'blue.400' }}
                transition="all 0.2s"
              >
                <HStack spacing={3} mb={2}>
                  <Icon as={FaEnvelope} color="blue.500" boxSize={5} />
                  <Text fontWeight="semibold" fontSize="sm">
                    {t('contactModal.email')}
                  </Text>
                </HStack>
                {contact?.email ? (
                  <Button
                    as="a"
                    href={`mailto:${contact.email}`}
                    variant="link"
                    colorScheme="blue"
                    fontSize="md"
                    fontWeight="medium"
                    ml={8}
                    textDecoration="underline"
                    _hover={{ color: 'blue.600' }}
                  >
                    {contact.email}
                  </Button>
                ) : (
                  <Text ml={8} color={descriptionColor} fontSize="sm" fontStyle="italic">
                    {t('contactModal.noEmail')}
                  </Text>
                )}
              </Box>

              {/* Phone Section */}
              <Box
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                bg={contactCardBg}
                _hover={{ shadow: 'md', borderColor: 'green.400' }}
                transition="all 0.2s"
              >
                <HStack spacing={3} mb={2}>
                  <Icon as={FaPhone} color="green.500" boxSize={5} />
                  <Text fontWeight="semibold" fontSize="sm">
                    {t('contactModal.phone')}
                  </Text>
                </HStack>
                {contact?.phone ? (
                  <Button
                    as="a"
                    href={`tel:${contact.phone}`}
                    variant="link"
                    colorScheme="green"
                    fontSize="md"
                    fontWeight="medium"
                    ml={8}
                    textDecoration="underline"
                    _hover={{ color: 'green.600' }}
                  >
                    {contact.phone}
                  </Button>
                ) : (
                  <Text ml={8} color={descriptionColor} fontSize="sm" fontStyle="italic">
                    {t('contactModal.noPhone')}
                  </Text>
                )}
              </Box>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Text textAlign="center" color={descriptionColor}>
                {t('contactModal.loginPrompt')}
              </Text>
              <HStack spacing={3} width="full">
                <Button colorScheme="blue" variant="outline" flex={1} onClick={handleLoginClick}>
                  {t('contactModal.login')}
                </Button>
                <Button colorScheme="blue" flex={1} onClick={handleSignupClick}>
                  {t('contactModal.signUp')}
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
