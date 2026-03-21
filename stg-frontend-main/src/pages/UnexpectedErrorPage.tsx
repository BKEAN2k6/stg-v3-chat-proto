import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import {CenterAligned} from '@/components/ui/CenterAligned';

export default function UnexpectedErrorPage() {
  return (
    <CenterAligned>
      <div className="d-flex flex-column justify-content-center align-items-center text-center px-5">
        <img
          src="/images/error-image.png"
          alt="Whoops!"
          className="img-fluid mb-5"
        />
        <h1 className="title fs-2">
          <Trans>Unexpected Error</Trans>
        </h1>
        <p>
          <Trans>Sorry, an unexpected occurred.</Trans>
        </p>
        <p>
          <Trans>
            If the problem persists, please contact
            <br />
            support@positive.fi
          </Trans>
        </p>
        <Link to="/">
          <Button variant="primary" className="mt-2">
            <Trans>Go back home</Trans>
          </Button>
        </Link>
        <Link to="/logout">
          <Button variant="outline-primary" className="mt-2">
            <Trans>Log out</Trans>
          </Button>
        </Link>
      </div>
    </CenterAligned>
  );
}
