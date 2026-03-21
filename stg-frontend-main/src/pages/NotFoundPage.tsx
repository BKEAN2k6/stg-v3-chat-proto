import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import {CenterAligned} from '@/components/ui/CenterAligned';

export default function NotFoundPage() {
  return (
    <CenterAligned>
      <div className="d-flex flex-column justify-content-center align-items-center text-center px-5">
        <img
          src="/images/error-image.png"
          alt="Whoops!"
          className="img-fluid mb-5"
        />
        <h1 className="title fs-2">
          <Trans>Page Not Found</Trans>
        </h1>
        <p>
          <Trans>Sorry, the page you are looking for does not exist.</Trans>
        </p>
        <Link to="/">
          <Button variant="primary" className="mt-2">
            <Trans>Go back home</Trans>
          </Button>
        </Link>
      </div>
    </CenterAligned>
  );
}
