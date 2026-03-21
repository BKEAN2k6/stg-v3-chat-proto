import {Trans} from '@lingui/react/macro';

type Properties = {
  readonly email: string;
};

export default function EmailSent(properties: Properties) {
  const {email} = properties;

  return (
    <div className="w-100 text-center">
      <div className="text-start w-100 m-auto mb-5" style={{maxWidth: 300}}>
        <h1 className="display-6 my-5 text-center">
          <Trans>Check your email</Trans>
        </h1>
      </div>
      <Trans>
        <p>An email has been sent to {email}.</p>
        <p>Please check your inbox to log in.</p>
      </Trans>
    </div>
  );
}
