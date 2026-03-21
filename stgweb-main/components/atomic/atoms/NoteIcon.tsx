export const NoteIcon = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 6.914V13a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 13V3a1.5 1.5 0 011.5-1.5h3.086a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 1.75V5.5a1 1 0 001 1h3.75M5.5 9h5M5.5 11.5h5"
      />
    </svg>
  );
};

export default NoteIcon;
