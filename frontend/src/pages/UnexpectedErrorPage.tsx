import {Link, useRouteError} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import api from '@client/ApiClient';
import {useEffect} from 'react';
import {CenterAligned} from '@/components/ui/CenterAligned.js';

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}

export default function UnexpectedErrorPage({
  error: errorProp,
}: {
  readonly error?: unknown;
}) {
  const routeError = useRouteError();
  const error = toError(errorProp ?? routeError);

  useEffect(() => {
    const reportError = async () => {
      try {
        await api.createClientError({
          error: {
            message: error.message,
            stack: error.stack,
          },
          environment: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            url: globalThis.location.href,
            referrer: document.referrer,
            screen: {
              width: window.screen.width,
              height: window.screen.height,
              availWidth: window.screen.availWidth,
              availHeight: window.screen.availHeight,
              colorDepth: window.screen.colorDepth,
              pixelDepth: window.screen.pixelDepth,
            },
          },
        });
      } catch (error) {
        console.error('Failed to report error', error);
      }
    };

    void reportError();
  }, [error]);

  return (
    <CenterAligned>
      <div className="d-flex flex-column justify-content-center align-items-center text-center px-5">
        <img
          src="/images/error-image.png"
          alt="Whoops!"
          className="img-fluid mb-5"
        />
        <h1 className="title fs-2">Unexpected Error</h1>
        <p>Sorry, an unexpected occurred.</p>
        <p>
          If the problem persists, please contact
          <br />
          support@positive.fi
        </p>
        <a href="/">
          <Button variant="primary" className="mt-2">
            Go back home
          </Button>
        </a>
        <Link to="/logout">
          <Button variant="outline-primary" className="mt-2">
            Log out
          </Button>
        </Link>
      </div>
    </CenterAligned>
  );
}
