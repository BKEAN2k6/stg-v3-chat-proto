export const ImageIcon = (props: any) => (
  <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.2"
      d="M13 2.5H3A1.5 1.5 0 001.5 4v8A1.5 1.5 0 003 13.5h10a1.5 1.5 0 001.5-1.5V4A1.5 1.5 0 0013 2.5z"
    />
    <path
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="1.2"
      d="M10.5 6.5a1 1 0 100-2 1 1 0 000 2z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      d="M9.5 10.494L6.667 7.666a1 1 0 00-1.371-.04L1.5 11M7 13.5l3.854-3.854a1 1 0 011.348-.063L14.5 11.5"
    />
  </svg>
);

export default ImageIcon;
