import { Button, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import React, { FC } from 'react';

type NavLinkItemProps = {
  href: string;
  target?: '_blank' | '_self';
  path: string;
  prefetch: boolean;
  children: React.ReactNode;
  variant?: 'unstyled' | 'ghost' | 'outline' | 'solid' | 'link';
  onClick: () => void;
};

const NavLinkItem: FC<NavLinkItemProps> = ({
  href,
  target,
  path,
  prefetch,
  children,
  variant = 'unstyled',
  onClick
}) => {
  const isActive = href === path;

  return (
    <Link
      href={href}
      target={target}
      scroll={false}
      style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem' }}
      prefetch={prefetch}
      onClick={onClick}
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
        variant={variant}
      >
        {children}
      </Button>
    </Link>
  );
};

export default NavLinkItem;
