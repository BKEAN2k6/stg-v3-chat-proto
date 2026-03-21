import {track} from '@/helpers/analytics.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
type MarkdownAProperties = {
  readonly href?: string;
  readonly children: React.ReactNode;
  readonly target?: '_blank';
};

export default function MarkdownA(properties: MarkdownAProperties) {
  const {children, ...rest} = properties;

  return (
    <a // eslint-disable-line react/jsx-no-target-blank
      onClick={() => {
        if (!properties.href) {
          return;
        }

        track('Click link in markdown', {
          href: properties.href,
        });
      }}
      {...(properties.target === '_blank' ? {rel: 'noreferrer'} : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
