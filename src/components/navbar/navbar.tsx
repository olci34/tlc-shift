import {
  Box,
  IconButton,
  useColorMode,
  Flex,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Text,
  Heading,
  VStack,
  Icon,
  Switch,
  HStack,
  Button
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavLinkItem from './nav-link-item';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { signOut, useSession } from 'next-auth/react';
import { AUTH_STATUS } from '@/lib/utils/auth';

const NavBar = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const isHamburger = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  const logout = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    signOut({ callbackUrl: API_URL });
  };

  return (
    <Box
      pos="sticky"
      as="nav"
      w="100%"
      zIndex={2}
      borderBottom="1px"
      borderColor="gray.400"
      alignContent="center"
      height="4rem"
      py={2}
    >
      <Flex justify="space-between" align="center" height="100%">
        {isHamburger ? (
          <>
            <IconButton
              aria-label="Open Navigation"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              colorScheme="gray"
              size="md"
            />
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                  <Text size="lg">TLC Shift</Text>
                </DrawerHeader>
                <DrawerBody>
                  <Stack direction="column" spacing={4}>
                    <NavLinkItem href="/" path={router.asPath} prefetch={false} onClick={onClose}>
                      Trips
                    </NavLinkItem>
                    <NavLinkItem
                      href="/earnings"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      Earnings
                    </NavLinkItem>
                    <NavLinkItem
                      href="/about"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      About
                    </NavLinkItem>
                    <NavLinkItem
                      href="/listings"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      Listings
                    </NavLinkItem>
                    <HStack p={2}>
                      <Icon as={MoonIcon} boxSize={6} />
                      <Switch aria-label="Toggle color mode" size="lg" onChange={toggleColorMode} />
                      <Icon as={SunIcon} boxSize={6} />
                    </HStack>
                  </Stack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Heading size="lg" display="inline">
              TLC Shift
            </Heading>
          </>
        ) : (
          <Flex gap={4}>
            <Heading size="lg" display="inline">
              TLC Shift
            </Heading>
            <NavLinkItem href="/" path={router.asPath} prefetch={false} onClick={onClose}>
              Trips
            </NavLinkItem>
            <NavLinkItem href="/earnings" path={router.asPath} prefetch={false} onClick={onClose}>
              Earnings
            </NavLinkItem>
            <NavLinkItem href="/about" path={router.asPath} prefetch={false} onClick={onClose}>
              About
            </NavLinkItem>
            <NavLinkItem href="/listings" path={router.asPath} prefetch={false} onClick={onClose}>
              Listings
            </NavLinkItem>
          </Flex>
        )}
        <Box>
          {status !== AUTH_STATUS.Authenticated ? (
            <NavLinkItem
              href="/signup-login"
              path={router.asPath}
              prefetch={false}
              onClick={onClose}
            >
              Login
            </NavLinkItem>
          ) : (
            <Button onClick={logout}>Logout</Button>
          )}
          {!isHamburger && (
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              variant="ghost"
              colorScheme="gray"
              size="md"
              onClick={toggleColorMode}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
