import { Box, Container, Stack, Text, useColorModeValue, HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const linkColor = useColorModeValue('green.600', 'green.300');

  return (
    <Box bg={bgColor} color={textColor} width="100vw" py={4} mt={4}>
      <Container maxW="6xl">
        <Stack spacing={4} justify="center" align="center">
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            <HStack spacing={6}>
              <Link as={NextLink} href="/about" color={linkColor}>
                About
              </Link>
              <Link as={NextLink} href="/contact" color={linkColor}>
                Contact
              </Link>
              <Link as={NextLink} href="/privacy" color={linkColor}>
                Privacy
              </Link>
              <Link as={NextLink} href="/terms" color={linkColor}>
                Terms
              </Link>
            </HStack>
          </Stack>
          <Text fontSize="sm">© {new Date().getFullYear()} TLC Shift. All rights reserved.</Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
