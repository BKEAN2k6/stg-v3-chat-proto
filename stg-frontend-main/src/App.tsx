import {RouterProvider} from 'react-router-dom';
import {useTracking} from 'react-tracking';
import {ErrorBoundary} from 'react-error-boundary';
import {ToastsProvider} from './components/toasts';
import {router} from './router';
import {LanguageProvider} from './context/languageContext';
import reportMetrics from './reportMetrics';
import {PlayerProvider} from './context/Video/PlayerProvider';
import UnexpectedErrorPage from './pages/UnexpectedErrorPage';

export default function App() {
  const {Track} = useTracking<Trackables>(
    {app: 'stg-frontend'},
    {
      dispatch(data) {
        reportMetrics(data);
      },
    },
  );

  return (
    <ErrorBoundary fallback={<UnexpectedErrorPage />}>
      <Track>
        <LanguageProvider>
          <ToastsProvider>
            <PlayerProvider>
              <RouterProvider router={router} />
            </PlayerProvider>
          </ToastsProvider>
        </LanguageProvider>
      </Track>
    </ErrorBoundary>
  );
}
