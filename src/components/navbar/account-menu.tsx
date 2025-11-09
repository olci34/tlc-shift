import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  LinkBox,
  MenuDivider
} from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';

const AccountMenu = () => {
  const t = useTranslations();
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
          <MenuItem>{t('nav.myAccount')}</MenuItem>
        </Link>
        <Link href="/my-listings" style={{ textDecoration: 'none' }} prefetch={false}>
          <MenuItem>{t('nav.myListings')}</MenuItem>
        </Link>{' '}
        <Link href="/listings/create" style={{ textDecoration: 'none' }} prefetch={false}>
          <MenuItem icon={<AddIcon />}>{t('nav.newListing')}</MenuItem>
        </Link>{' '}
        <MenuDivider />
        <MenuItem>
          <LinkBox onClick={logout}>{t('common.logout')}</LinkBox>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;
