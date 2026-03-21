import React, {useEffect, useRef} from 'react';

type ContextMenuProps = {
  readonly isShown: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly position: {top: number; right: number};
};

export const ContextMenu = ({
  isShown,
  onClose,
  children,
  position,
}: ContextMenuProps) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => {
          onClose();
        }, 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isShown) {
    return null;
  }

  return (
    <div
      ref={contextMenuRef}
      className="fixed z-50 mt-2 w-48 border border-gray-200 bg-white shadow-lg"
      style={{top: position.top, right: position.right}}
    >
      <ul>{children}</ul>
    </div>
  );
};
