import {Link, type LinkProps} from 'react-router-dom';
import {track} from '@/helpers/analytics.js';

export default function MarkdownLink(properties: LinkProps) {
  const {children, ...rest} = properties;

  return (
    <Link
      onClick={() => {
        track('Click link in markdown', {
          href:
            typeof properties.to === 'string'
              ? properties.to
              : properties.to.pathname,
        });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
