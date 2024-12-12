import '@/styles/globals.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import MainLayout from '@/layout/main-layout';
import theme from '@/styles/theme';
import { useEffect } from 'react';
import wakeServerUp from '@/api/wakeServerUp';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const wakeServer = async () => {
      await wakeServerUp();
    };
    wakeServer();
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ChakraProvider>
  );
}
