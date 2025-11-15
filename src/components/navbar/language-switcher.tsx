import { Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaGlobe } from 'react-icons/fa';
import * as gtag from '@/lib/analytics/gtag';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const changeLanguage = (newLocale: string) => {
    const currentLocale = router.locale || 'en';
    let path = router.asPath;

    // Track language change in Google Analytics
    gtag.trackEvent.changeLanguage(newLocale);

    // Remove current locale prefix if it exists in the path
    if (currentLocale !== 'en' && path.startsWith(`/${currentLocale}`)) {
      path = path.substring(`/${currentLocale}`.length) || '/';
    }

    // Add new locale prefix if it's not the default locale (en)
    const newPath = newLocale === 'en' ? path : `/${newLocale}${path}`;

    // Use window.location for a full page reload to ensure all content updates
    window.location.href = newPath;
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
