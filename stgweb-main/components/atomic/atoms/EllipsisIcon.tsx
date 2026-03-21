export const EllipsisIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill={props.color || '#282C34'}
      stroke={props.color || '#282C34'}
      d="M11.375 10a1.375 1.375 0 11-2.75 0 1.375 1.375 0 012.75 0zM17.625 10a1.375 1.375 0 11-2.75 0 1.375 1.375 0 012.75 0z"
    />
    <path
      fill={props.color || '#282C34'}
      d="M3.75 11.875a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
    />
  </svg>
);
