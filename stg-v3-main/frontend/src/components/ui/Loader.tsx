import SyncLoader from 'react-spinners/SyncLoader';

type Properties = {
  readonly size?: number;
};

export function Loader(properties: Properties) {
  const {size} = properties;
  return <SyncLoader size={size ?? 10} color="#ccc" />;
}
