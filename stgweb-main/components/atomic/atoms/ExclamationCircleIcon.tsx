export const ExclamationCircleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke={props.color || '#282C34'}
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M17.5 10c0-4.14-3.36-7.5-7.5-7.5-4.14 0-7.5 3.36-7.5 7.5 0 4.14 3.36 7.5 7.5 7.5 4.14 0 7.5-3.36 7.5-7.5z"
    />
    <path
      stroke={props.color || '#282C34'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9.776 6.486L10 11.25l.224-4.764a.223.223 0 00-.226-.234v0a.224.224 0 00-.222.234v0z"
    />
    <path
      fill={props.color || '#282C34'}
      d="M10 14.372a.78.78 0 110-1.562.78.78 0 010 1.562z"
    />
  </svg>
);
