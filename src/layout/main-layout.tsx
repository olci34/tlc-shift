import NavBar from '@/components/navbar/navbar';
import ReactNodeChildrenProps from '@/lib/interfaces/ReactNodeChildrenProps';
import { Box, Container, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

const MainLayout: FC<ReactNodeChildrenProps> = ({ children }) => {
  return (
    <Container as="main" backgroundColor="green.800" paddingBottom={10}>
      <VStack height="100vh">
        <NavBar />
        <Box height="full" width="full">
          {children}
        </Box>
      </VStack>
    </Container>
  );
};

export default MainLayout;
