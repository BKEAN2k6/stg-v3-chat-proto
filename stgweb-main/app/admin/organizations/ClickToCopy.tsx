import toast from 'react-hot-toast';

type ClickToCopyProps = {
  readonly content: string;
  readonly textToCopy: string;
  readonly onCopy?: () => void;
};

export const ClickToCopy = ({
  content,
  textToCopy,
  onCopy,
}: ClickToCopyProps) => {
  const handleCopy = async (event: any) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Link copied to clipboard');
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <a href="#" onClick={handleCopy}>
      {content}
    </a>
  );
};
