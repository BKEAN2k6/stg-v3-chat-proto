import SyncLoader from 'react-spinners/SyncLoader';

type Props = {
  readonly size?: number;
};

export function Loader(props: Props) {
  const {size} = props;
  return <SyncLoader size={size ?? 10} color="#ccc" />;
}
