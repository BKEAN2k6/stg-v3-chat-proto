import clsx from 'clsx';

type Properties = {
  readonly title?: string;
  readonly className?: string;
  readonly children: React.ReactNode;
};

export default function Callout(properties: Properties) {
  const {title, className, children} = properties;
  return (
    <div className={clsx('callout', className)}>
      {title ? <div className="callout-header">{title}</div> : null}
      <div className="callout-body">{children}</div>
    </div>
  );
}
