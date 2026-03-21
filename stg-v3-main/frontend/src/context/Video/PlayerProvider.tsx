import React, {
  createContext,
  useContext,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {Howler} from 'howler';

export type Pausable = {
  pause: () => void;
  shouldIgnoreStop?: () => boolean;
};

type PlayerContextType = {
  addPlayer: (player: Pausable) => void;
  removePlayer: (player: Pausable) => void;
  stopOtherPlayers: (current: Pausable) => void;
  stopAllPlayers: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (v: number) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error('usePlayerContext must be inside PlayerProvider');
  return context;
};

export function PlayerProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const players = useRef<Pausable[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(Howler.volume());

  useEffect(() => {
    const handleVisibilityChange = () => {
      const state = document.visibilityState;

      if (state === 'hidden') {
        Howler.mute(true);
      } else if (state === 'visible') {
        setTimeout(() => {
          if (!isMuted) {
            Howler.mute(false);
          }
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (!isMuted) {
        Howler.mute(false);
      }
    };
  }, [isMuted]);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
  }, []);

  const addPlayer = useCallback((p: Pausable) => {
    if (!players.current.includes(p)) {
      players.current.push(p);
    }
  }, []);

  const removePlayer = useCallback((p: Pausable) => {
    players.current = players.current.filter((x) => x !== p);
  }, []);

  const stopOtherPlayers = useCallback((current: Pausable) => {
    for (const p of players.current) {
      if (p === current) {
        continue;
      }

      const ignore = p.shouldIgnoreStop?.() ?? false;
      if (ignore) continue;
      try {
        p.pause();
      } catch {}
    }
  }, []);

  const stopAllPlayers = useCallback(() => {
    for (const p of players.current) {
      const ignore = p.shouldIgnoreStop?.() ?? false;

      if (!ignore) {
        try {
          p.pause();
        } catch {}
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      addPlayer,
      removePlayer,
      stopOtherPlayers,
      stopAllPlayers,
      isMuted,
      toggleMute,
      volume,
      setVolume(v: number) {
        setVolume(v);
      },
    }),
    [
      isMuted,
      volume,
      addPlayer,
      removePlayer,
      stopOtherPlayers,
      stopAllPlayers,
      toggleMute,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
