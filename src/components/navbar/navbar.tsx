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
  Icon,
  Switch,
  HStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavLinkItem from './nav-link-item';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useSession } from 'next-auth/react';
import { AUTH_STATUS } from '@/lib/utils/auth';
import AccountMenu from './account-menu';
import LanguageSwitcher from './language-switcher';
import { useTranslations } from 'next-intl';

const NavBar = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const isHamburger = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  const t = useTranslations();

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
              aria-label={t('nav.openNavigation')}
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
                  <Text size="lg">{t('common.appName')}</Text>
                </DrawerHeader>
                <DrawerBody>
                  <Stack direction="column" spacing={4}>
                    <NavLinkItem href="/" path={router.asPath} prefetch={false} onClick={onClose}>
                      {t('nav.home')}
                    </NavLinkItem>
                    <NavLinkItem
                      href="/trips"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      {t('nav.trips')}
                    </NavLinkItem>
                    {/* <NavLinkItem
                      href="/earnings"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      {t('nav.earnings')}
                    </NavLinkItem> */}
                    {/* <NavLinkItem
                      href="/about"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      {t('nav.about')}
                    </NavLinkItem> */}
                    <NavLinkItem
                      href="/listings"
                      path={router.asPath}
                      prefetch={false}
                      onClick={onClose}
                    >
                      {t('nav.listings')}
                    </NavLinkItem>
                    <HStack p={2} justify="space-between">
                      <HStack>
                        <Icon as={MoonIcon} boxSize={6} />
                        <Switch
                          aria-label={t('nav.toggleColorMode')}
                          size="lg"
                          onChange={toggleColorMode}
                        />
                        <Icon as={SunIcon} boxSize={6} />
                      </HStack>
                      <LanguageSwitcher />
                    </HStack>
                  </Stack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Heading size="lg" display="inline">
              {t('common.appName')}
            </Heading>
          </>
        ) : (
          <Flex gap={4}>
            <Heading size="lg" display="inline">
              {t('common.appName')}
            </Heading>
            <NavLinkItem href="/" path={router.asPath} prefetch={false} onClick={onClose}>
              {t('nav.home')}
            </NavLinkItem>
            <NavLinkItem href="/trips" path={router.asPath} prefetch={false} onClick={onClose}>
              {t('nav.trips')}
            </NavLinkItem>
            {/* <NavLinkItem href="/earnings" path={router.asPath} prefetch={false} onClick={onClose}>
              {t('nav.earnings')}
            </NavLinkItem>
            <NavLinkItem href="/about" path={router.asPath} prefetch={false} onClick={onClose}>
              {t('nav.about')}
            </NavLinkItem> */}
            <NavLinkItem href="/listings" path={router.asPath} prefetch={false} onClick={onClose}>
              {t('nav.listings')}
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
              {t('common.login')}
            </NavLinkItem>
          ) : (
            <AccountMenu />
          )}
          {!isHamburger && (
            <>
              <LanguageSwitcher />
              <IconButton
                aria-label={t('nav.toggleColorMode')}
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                variant="ghost"
                colorScheme="gray"
                size="md"
                onClick={toggleColorMode}
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
