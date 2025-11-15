import '@/styles/globals.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import MainLayout from '@/layout/main-layout';
import theme from '@/styles/theme';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import React from 'react';
import { getOrCreateVisitorId } from '@/lib/utils/visitor-id';
import GoogleAnalytics from '@/lib/analytics/GoogleAnalytics';
import * as gtag from '@/lib/analytics/gtag';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  // Initialize visitor ID on app load
  React.useEffect(() => {
    getOrCreateVisitorId();
  }, []);

  // Track page views on route change
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Initialize messages from pageProps or empty object
  const [messages, setMessages] = React.useState(pageProps.messages || {});

  // Load messages dynamically when locale changes or messages are not provided
  React.useEffect(() => {
    // If messages are provided in pageProps, use them
    if (pageProps.messages) {
      setMessages(pageProps.messages);
      return;
    }

    // Otherwise, load messages dynamically for the current locale
    const locale = router.locale || 'en';
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const loadedMessages = await import(`../../messages/${locale}.json`);

        // Only update state if the effect hasn't been cancelled
        if (!cancelled) {
          setMessages(loadedMessages.default || loadedMessages);
        }
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);

        // Fallback to English if the locale messages fail to load
        if (locale !== 'en' && !cancelled) {
          try {
            const fallbackMessages = await import(`../../messages/en.json`);
            if (!cancelled) {
              setMessages(fallbackMessages.default || fallbackMessages);
            }
          } catch (fallbackError) {
            console.error('Failed to load fallback messages', fallbackError);
            if (!cancelled) {
              setMessages({});
            }
          }
        } else if (!cancelled) {
          setMessages({});
        }
      }
    };

    loadMessages();

    // Cleanup function to prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [router.locale, pageProps.messages]);

  return (
    <>
      <GoogleAnalytics />
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
    </>
  );
}
