import { Box, IconButton, useColorMode, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavLinkItem from './nav-link-item';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const NavBar = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

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
        <Flex gap={4}>
          <NavLinkItem href="/" path={router.asPath} prefetch={false}>
            Trips
          </NavLinkItem>

          <NavLinkItem href="/earnings" path={router.asPath} prefetch={false}>
            Earnings
          </NavLinkItem>
        </Flex>

        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          colorScheme="gray"
          size="md"
        />
      </Flex>
    </Box>
  );
};

export default NavBar;
