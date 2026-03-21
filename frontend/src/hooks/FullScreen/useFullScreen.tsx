// (forked from https://github.com/snakesilk/react-fullscreen, MIT License)

import React, {useCallback, useState, useRef, useEffect, useMemo} from 'react';
import fscreen from 'fscreen';
import './useFullScreen.scss';

export type FullScreenHandle = {
  active: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  node: React.RefObject<HTMLDivElement | null>;
};

export type FullScreenProperties = {
  readonly handle: FullScreenHandle;
  readonly children: any;
  readonly onChange?: (state: boolean, handle: FullScreenHandle) => void;
  readonly className?: string;
};

export function useFullScreenHandle(): FullScreenHandle {
  const [active, setActive] = useState<boolean>(false);
  const node = useRef<HTMLDivElement>(null);
  const supported = useMemo(() => Boolean(fscreen.fullscreenEnabled), []);

  useEffect(() => {
    if (supported) {
      const handleChange = () => {
        setActive(fscreen.fullscreenElement === node.current);
      };

      fscreen.addEventListener('fullscreenchange', handleChange);
      return () => {
        fscreen.removeEventListener('fullscreenchange', handleChange);
      };
    }
  }, [supported]);

  const enter = useCallback(async () => {
    if (!supported) {
      setActive(true);
      document.documentElement.classList.add('fullscreen-active');
      document.body.classList.add('fullscreen-active');
      return;
    }

    if (fscreen.fullscreenElement) {
      fscreen.exitFullscreen();
      if (node.current) {
        fscreen.requestFullscreen(node.current);
      }

      return;
    }

    if (node.current) {
      fscreen.requestFullscreen(node.current);
    }
  }, [supported]);

  const exit = useCallback(async () => {
    if (!supported) {
      setActive(false);
      document.documentElement.classList.remove('fullscreen-active');
      document.body.classList.remove('fullscreen-active');
      return;
    }

    if (fscreen.fullscreenElement === node.current) {
      fscreen.exitFullscreen();
    }
  }, [supported]);

  return useMemo(
    () => ({
      active,
      enter,
      exit,
      node,
    }),
    [active, enter, exit],
  );
}

export function FullScreen({
  handle,
  onChange,
  children,
  className,
}: FullScreenProperties) {
  const classNames = [];
  const supported = useMemo(() => Boolean(fscreen.fullscreenEnabled), []);
  if (className) {
    classNames.push(className);
  }

  classNames.push('fullscreen');

  if (handle.active) {
    classNames.push('fullscreen-enabled');
  }

  if (handle.active) {
    if (supported) {
      classNames.push('fullscreen-native');
    } else {
      classNames.push('fullscreen-fallback');
    }
  }

  useEffect(() => {
    if (!supported && handle.active) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          void handle.exit();
        }
      };

      globalThis.addEventListener('keydown', onKeyDown);
      return () => {
        globalThis.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [supported, handle]);

  useEffect(() => {
    if (onChange) {
      onChange(handle.active, handle);
    }
  }, [handle.active, handle, onChange]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('fullscreen-active');
      document.body.classList.remove('fullscreen-active');
    };
  }, []);

  return (
    <div ref={handle.node} className={classNames.join(' ')}>
      {children}
    </div>
  );
}
