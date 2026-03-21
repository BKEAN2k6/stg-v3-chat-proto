import clsx from 'clsx';

type Props = {
  readonly title?: string;
  readonly className?: string;
  readonly children: React.ReactNode;
};

export default function Callout(props: Props) {
  const {title, className, children} = props;
  return (
    <div className={clsx('callout', className)}>
      {title && <div className="callout-header">{title}</div>}
      <div className="callout-body">{children}</div>
    </div>
  );
}
