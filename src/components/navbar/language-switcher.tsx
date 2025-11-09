import { Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Change language"
        icon={<FaGlobe />}
        variant="ghost"
        colorScheme="gray"
        size="md"
      />
      <MenuList zIndex={1001}>
        <MenuItem
          onClick={() => changeLanguage('en')}
          fontWeight={locale === 'en' ? 'bold' : 'normal'}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage('es')}
          fontWeight={locale === 'es' ? 'bold' : 'normal'}
        >
          Español
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
