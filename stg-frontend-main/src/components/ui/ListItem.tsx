import clsx from 'clsx';

type Props = {
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly imageBackgroundColor?: string;
  readonly title: string;
  readonly description?: string;
  readonly className?: string;
  readonly onClick?: () => void;
  readonly children?: React.ReactNode;
};

export default function ListItem(props: Props) {
  const {
    imageUrl,
    imageAlt,
    imageBackgroundColor,
    title,
    description,
    onClick,
    className,
    children,
  } = props;
  return (
    <div
      className={clsx(
        'd-flex align-items-center py-2 px-2 rounded border',
        className,
      )}
      {...(onClick && {role: 'button'})}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className="rounded-circle me-3"
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          ...(imageBackgroundColor && {backgroundColor: imageBackgroundColor}),
        }}
      />
      <div>
        <h5 className="mb-0">{title}</h5>
        <p className="mb-0">{description}</p>
      </div>
      <div className="ms-auto me-1">{children}</div>
    </div>
  );
}
