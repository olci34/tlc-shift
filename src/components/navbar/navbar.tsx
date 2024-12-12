import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavLinkItem from './nav-link-item';

const NavBar = () => {
  const router = useRouter();
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
      <NavLinkItem href="/" path={router.asPath} prefetch={false}>
        Trips
      </NavLinkItem>

      <NavLinkItem href="/earnings" path={router.asPath} prefetch={false}>
        Earnings
      </NavLinkItem>
    </Box>
  );
};

export default NavBar;
