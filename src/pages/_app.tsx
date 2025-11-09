import '@/styles/globals.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import MainLayout from '@/layout/main-layout';
import theme from '@/styles/theme';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import React from 'react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  // Load messages synchronously on the server, async on the client
  const [messages, setMessages] = React.useState(() => {
    if (pageProps.messages) {
      return pageProps.messages;
    }
    // For client-side navigation, load messages
    if (typeof window !== 'undefined') {
      return {};
    }
    // For SSR, try to load messages synchronously
    try {
      return require(`../../messages/${router.locale || 'en'}.json`);
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    // Load messages dynamically on client if not already loaded
    if (!pageProps.messages && Object.keys(messages).length === 0) {
      import(`../../messages/${router.locale || 'en'}.json`)
        .then((module) => setMessages(module.default))
        .catch(() => setMessages({}));
    }
  }, [router.locale, pageProps.messages, messages]);

  return (
    <NextIntlClientProvider
      locale={router.locale || 'en'}
      messages={messages}
      timeZone="America/New_York"
      onError={() => {
        // Silently ignore missing translation errors
      }}
      getMessageFallback={({ key }) => key}
    >
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SessionProvider session={session}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </SessionProvider>
      </ChakraProvider>
    </NextIntlClientProvider>
  );
}
