import {Loader} from './ui/Loader.js';

type Properties = {
  readonly children?: React.ReactNode;
};

export default function CenteredLoader({children}: Properties) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        marginTop: '-100px',
        height: '100vh',
      }}
    >
      <Loader />

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
