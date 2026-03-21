export const BookIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    style={{color: 'var(--icon-color)'}}
    {...props}
  >
    <path
      stroke="currentColor"
      // stroke={props.color || "#282C34"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 7.5c.75-2.96 3.583-4.472 9.75-4.5a.747.747 0 01.75.75v13.5a.75.75 0 01-.75.75c-6 0-8.318 1.21-9.75 3-1.424-1.781-3.75-3-9.75-3-.463 0-.75-.377-.75-.84V3.75A.747.747 0 012.25 3c6.167.028 9 1.54 9.75 4.5zM12 7.5V21"
    />
  </svg>
);
