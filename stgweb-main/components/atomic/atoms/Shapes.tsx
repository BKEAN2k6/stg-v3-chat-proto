import * as React from 'react';

export const Circle = ({title, titleId, ...props}: any) => (
  <svg
    width={400}
    height={400}
    viewBox="0 0 400 400"
    aria-labelledby={titleId}
    {...props}
  >
    <title id={titleId}>{title}</title>
    <circle fill="#EF7570" cx={200} cy={200} r={200} fillRule="evenodd" />
  </svg>
);

export const Square = ({title, titleId, ...props}: any) => (
  <svg
    aria-labelledby={titleId}
    height={400}
    viewBox="0 0 400 400"
    width={400}
    {...props}
  >
    <title id={titleId}>{title}</title>
    <rect fill="#A5D7D5" width={400} height={400} rx={24} fillRule="evenodd" />
  </svg>
);

export const Triangle = ({title, titleId, ...props}: any) => (
  <svg
    width={430}
    height={430}
    viewBox="0 0 430 430"
    aria-labelledby={titleId}
    {...props}
  >
    <title id={titleId}>{title}</title>
    <path
      d="m236.466 42.933 176.167 352.334c5.928 11.855 1.123 26.272-10.733 32.2A24 24 0 0 1 391.167 430H38.833c-13.255 0-24-10.745-24-24a24 24 0 0 1 2.534-10.733L193.534 42.933c5.927-11.856 20.344-16.661 32.2-10.734a24 24 0 0 1 10.732 10.734Z"
      fill="#FDD662"
      fillRule="evenodd"
    />
  </svg>
);
