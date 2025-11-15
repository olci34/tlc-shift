import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer';
import ReactNodeChildrenProps from '@/lib/interfaces/ReactNodeChildrenProps';
import { Box, Container, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

const MainLayout: FC<ReactNodeChildrenProps> = ({ children }) => {
  return (
    <VStack height="100vh" spacing={0}>
      <Container as="main" flex="1" maxW="container.lg" width="full">
        <VStack height="full" spacing={0}>
          <NavBar />
          <Box padding={{ base: 0, sm: 4 }} flex="1" width="full">
            {children}
          </Box>
        </VStack>
      </Container>
      <Footer />
    </VStack>
  );
};

export default MainLayout;
