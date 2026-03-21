import BadgeBubbles from './BadgeBubbles.js';

type AchievementItemProperties = {
  readonly icon: React.ReactNode;
  readonly count: number;
  readonly label?: React.ReactNode;
  readonly bgColor: string;
  readonly iconColor: string;
  readonly isBubbling: boolean;
  readonly zIndex: number;
  readonly onClick?: () => void;
  readonly size?: 'default' | 'large';
};

export default function AchievementItem({
  icon,
  count,
  label,
  bgColor,
  iconColor,
  isBubbling,
  zIndex,
  onClick,
  size = 'default',
}: AchievementItemProperties) {
  const scale = size === 'large' ? 1.5 : 1;

  return (
    <div
      role="button"
      tabIndex={0}
      className="d-flex flex-column align-items-center mb-1"
      style={{position: 'relative', zIndex, cursor: 'pointer'}}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div
        style={{
          width: 64 * scale,
          height: 64 * scale,
        }}
      >
        <div
          className="position-relative"
          style={{
            width: 64,
            height: 64,
            transform: scale === 1 ? undefined : `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {isBubbling ? <BadgeBubbles color={iconColor} /> : null}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm border border-white border-4"
            style={{
              position: 'relative',
              zIndex: 1,
              width: 64,
              height: 64,
              backgroundColor: bgColor,
              color: '#000',
              fontSize: '1.5rem',
            }}
          >
            <span style={{opacity: count === 0 ? 0.2 : 1}}>{icon}</span>
          </div>
          <span
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              bottom: -4,
              right: -4,
              width: 24,
              height: 24,
              paddingTop: 3,
              fontSize: '0.7rem',
              backgroundColor: '#b8b3d4',
              color: '#fff',
              zIndex: 2,
            }}
          >
            {count}
          </span>
        </div>
      </div>
      {label ? (
        <small
          className="text-muted text-uppercase mt-2 fw-semibold"
          style={{opacity: count === 0 ? 0.5 : 1}}
        >
          {label}
        </small>
      ) : undefined}
    </div>
  );
}
