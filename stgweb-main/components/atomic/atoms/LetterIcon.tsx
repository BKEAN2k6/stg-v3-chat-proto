export const LetterIcon = (props: any) => (
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
      d="M19.875 4.5H4.125c-1.036 0-1.875.84-1.875 1.875v11.25c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875V6.375c0-1.036-.84-1.875-1.875-1.875z"
    />
    <path
      stroke="currentColor"
      // stroke={props.color || "#282C34"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.25 7.5L12 12.75l6.75-5.25"
    />
  </svg>
);
