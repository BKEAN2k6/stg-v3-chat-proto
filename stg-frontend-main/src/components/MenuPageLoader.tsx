import {Loader} from './ui/Loader';

export default function MenuPageLoader() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        marginTop: '-100px',
        height: '100vh',
      }}
    >
      <Loader />
    </div>
  );
}
