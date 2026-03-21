import {StrengthPieChart, type StrengthPieChartItem} from './StrengthPieChart';
import {cn, getInitials} from '@/lib/utils';
import useGlobal from '@/hooks/useGlobal';

type Props = {
  readonly strengths?: StrengthPieChartItem[];
  readonly size?: number;
  readonly color?: string | undefined;
  readonly avatarFileId?: string | undefined;
  readonly avatarSlug?: string | undefined;
  readonly imageSizeMultiplier?: number;
  readonly singleColor?: string;
  readonly name: string;
  readonly placeholderClassName?: string;
};

const AvatarBySlug = ({slug}: any) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`/images/avatars/birds/${slug}.svg`}
    alt="Avatar"
    className="rounded-full"
    style={{
      width: '100%',
      height: '100%',
    }}
  />
);

const AvatarByFileId = ({fileId, authToken}: any) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`/data-api/assets/${fileId}?access_token=${authToken}`}
    alt="Avatar"
    className="rounded-full"
    style={{
      width: '100%',
      height: '100%',
    }}
  />
);

const AvatarPlaceholder = ({color, name, className}: any) => {
  return (
    <div
      className="mr-4 flex h-full w-full items-center justify-center overflow-hidden rounded-full border"
      style={{
        backgroundColor: color || '#ccc',
      }}
    >
      <span className={cn('-mb-1 text-xl font-bold text-white', className)}>
        {getInitials(name)}
      </span>
    </div>
  );
};

const AvatarImageRenderer = ({
  fileId,
  slug,
  color,
  name,
  placeholderClassName,
  authToken,
}: any) => {
  if (fileId && authToken) {
    return <AvatarByFileId fileId={fileId} authToken={authToken} />;
  }

  if (slug && !fileId) {
    return <AvatarBySlug slug={slug} />;
  }

  return (
    <AvatarPlaceholder
      color={color}
      name={name}
      className={placeholderClassName}
    />
  );
};

export const Avatar = (props: Props) => {
  const {
    strengths,
    size,
    color,
    avatarFileId,
    avatarSlug,
    singleColor,
    name,
    placeholderClassName,
  } = props;

  const {globalState} = useGlobal();
  const authToken = globalState.userAuthToken;

  const imageSizeMultiplier = props.imageSizeMultiplier ?? 0.9;

  let avatarSize: string | number = `${100 * imageSizeMultiplier}%`;
  if (size) {
    avatarSize = size * imageSizeMultiplier; // Make the avatar smaller than the size to leave room for strength colors
  }

  const pieChartSingleColor = strengths ? singleColor : '#eee';

  return (
    <div
      style={{
        position: 'relative',
        width: size ?? '100%',
        height: size ?? '100%',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      <StrengthPieChart
        strengths={strengths}
        singleColor={pieChartSingleColor}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          width: avatarSize,
          height: avatarSize,
          backgroundColor: color ?? '#fff',
          border: '1px solid #E2E8F0',
        }}
      >
        <AvatarImageRenderer
          fileId={avatarFileId}
          slug={avatarSlug}
          color={color}
          name={name}
          placeholderClassName={placeholderClassName}
          authToken={authToken}
        />
      </div>
    </div>
  );
};

export default Avatar;
