import '@/styles/globals.css';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import MainLayout from '@/layout/main-layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </ChakraProvider>
  );
}
