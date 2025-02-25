import { Button, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import React, { FC } from 'react';

type NavLinkItemProps = {
  href: string;
  target?: '_blank' | '_self';
  path: string;
  prefetch: boolean;
  children: React.ReactNode;
};

const NavLinkItem: FC<NavLinkItemProps> = ({ href, target, path, prefetch, children }) => {
  const isActive = href === path;

  return (
    <Link
      href={href}
      target={target}
      scroll={false}
      style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem' }}
      prefetch={prefetch}
    >
      <Button
        textDecoration={isActive ? 'underline' : 'none'}
        textUnderlineOffset={6}
        textDecorationThickness="2px"
        textDecorationColor={useColorModeValue('green.600', 'green.300')}
        display="inline-flex"
        alignItems="center"
        whiteSpace="nowrap"
        padding={2}
      >
        {children}
      </Button>
    </Link>
  );
};

export default NavLinkItem;
