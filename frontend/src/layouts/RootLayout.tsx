import {Outlet, ScrollRestoration} from 'react-router-dom';
import {ErrorBoundary} from 'react-error-boundary';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ToastsProvider from '@/components/toasts/toastsProvider.js';
import {LanguageProvider} from '@/context/languageContext.js';
import {PlayerProvider} from '@/context/Video/PlayerProvider.js';
import UnexpectedErrorPage from '@/pages/UnexpectedErrorPage.js';
import Tracking from '@/components/Tracking.js';
import UiVersionCheck from '@/components/UiVersionCheck.js';
import {PostsRefreshProvider} from '@/context/usePostsRefresh.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3_600_000,
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ErrorBoundary FallbackComponent={UnexpectedErrorPage}>
        <QueryClientProvider client={queryClient}>
          <Tracking>
            <ToastsProvider>
              <PlayerProvider>
                <UiVersionCheck>
                  <PostsRefreshProvider>
                    <ScrollRestoration />
                    <Outlet />
                  </PostsRefreshProvider>
                </UiVersionCheck>
              </PlayerProvider>
            </ToastsProvider>
          </Tracking>
        </QueryClientProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
