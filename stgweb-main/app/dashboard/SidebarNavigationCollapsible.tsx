'use client';

import {ChevronDown, ChevronRight} from 'lucide-react';
import {useEffect, useState} from 'react';
import {cn} from '@/lib/utils';

type Props = {
  readonly title: string; // Assuming title is unique for each collapsible
  readonly icon?: React.ReactNode;
  readonly isActive?: boolean;
  readonly children: React.ReactNode;
};

export const SidebarNavigationCollapsible = (props: Props) => {
  const {title, icon, isActive, children} = props;
  const localStorageKey = `sidebar-${title}`; // Create a unique key for localStorage

  // Initialize state from localStorage or default to false
  const [isOpen, setIsOpen] = useState(() => {
    const storedState = localStorage.getItem(localStorageKey);
    return storedState ? JSON.parse(storedState) : false;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(isOpen));
  }, [isOpen, localStorageKey]);

  return (
    <div className="my-2">
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between rounded-md p-2 text-left text-gray-600 hover:bg-gray-100',
          isActive && 'bg-primary-lighter-3',
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center justify-center space-x-2">
          {icon && <div>{icon}</div>}
          <div>{title}</div>
        </div>
        <span>
          {isOpen || isActive ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </span>
      </button>
      {(isOpen || isActive) && <div className="mt-2 pl-4">{children}</div>}
    </div>
  );
};
