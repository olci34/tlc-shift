import { Menu, MenuButton, MenuList, MenuItem, IconButton, Button } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const AccountMenu = () => {
  const logout = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    signOut({ callbackUrl: API_URL });
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Account menu"
        icon={<FaUserCircle />}
        variant="ghost"
        size="lg"
      />
      <MenuList zIndex={1001}>
        <Link href="/account" style={{ textDecoration: 'none' }} prefetch={false}>
          <MenuItem>Account</MenuItem>
        </Link>
        <Link href="/my-listings" style={{ textDecoration: 'none' }} prefetch={false}>
          <MenuItem>My Listings</MenuItem>
        </Link>{' '}
        <MenuItem>
          <Button onClick={logout}>Logout</Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;
