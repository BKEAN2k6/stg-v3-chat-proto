import {type Metadata} from 'next';
import {cookies} from 'next/headers';
import {Toaster} from 'react-hot-toast';
import {AuthTokenMismatchRedirect} from './AuthTokenMismatchRedirect';
import {GlobalStateSetter} from './GlobalStateSetter';
import {ClientCookiesProvider} from '@/providers/ClientCookie';
import {GlobalContextProvider} from '@/providers/GlobalContext';
import {siteConfig} from '@/config/site';
import {fontSans} from '@/lib/fonts';
import {getCookieValueFromHeadersOrStorage} from '@/lib/server-only-utils';
import {cn} from '@/lib/utils';
import {TailwindIndicator} from '@/components/TailwindIndicator';
import {ThemeProvider} from '@/components/theme-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: 'white',
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  icons: {
    icon: '/images/icons/favicon.ico',
    shortcut: '/images/icons/favicon-16x16.png',
    apple: '/images/icons/apple-touch-icon.png',
  },
};

type RootLayoutProps = {
  readonly children: React.ReactNode;
};

const RootLayout = ({children}: RootLayoutProps) => {
  const authToken = getCookieValueFromHeadersOrStorage('auth_token');
  const hasAuthToken = Boolean(authToken);
  return (
    <html suppressHydrationWarning lang="en" className="h-full">
      <head>
        <link
          rel="preload"
          href="https://unpkg.com/@rive-app/canvas@1.2.1/rive.wasm"
          as="fetch"
        />
        <link
          rel="preload"
          href="/animations/loaders/seppoballs.riv"
          as="fetch"
        />
      </head>
      <body
        className={cn(
          'h-full bg-background font-sans antialiased',
          fontSans.variable,
          hasAuthToken && 'server-has-auth-token',
        )}
      >
        <GlobalContextProvider
          initialState={{
            inClient: false,
            userAuthToken: authToken,
          }}
        >
          <ClientCookiesProvider value={cookies().getAll()}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
            >
              {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
              {/* <MainNav items={siteConfig.mainNav} /> */}
              <div className="relative flex h-full flex-col">{children}</div>
              {process.env.NODE_ENV === 'development' && <TailwindIndicator />}
            </ThemeProvider>
            <Toaster />
            <AuthTokenMismatchRedirect />
            <GlobalStateSetter />
          </ClientCookiesProvider>
        </GlobalContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
