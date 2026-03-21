import React, {createContext, useContext, useRef, useMemo} from 'react';
import type ReactPlayer from 'react-player/vimeo';

type PlayerContextType = {
  addPlayer: (ref: React.RefObject<ReactPlayer>) => void;
  removePlayer: (ref: React.RefObject<ReactPlayer>) => void;
  stopOtherPlayers: (ref: React.RefObject<ReactPlayer>) => void;
  stopAllPlayers: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }

  return context;
};

type PlayerProviderProps = {
  readonly children: React.ReactNode;
};

export function PlayerProvider({children}: PlayerProviderProps): JSX.Element {
  const playersRef = useRef<Array<React.RefObject<ReactPlayer>>>([]);

  const addPlayer = (ref: React.RefObject<ReactPlayer>) => {
    if (ref.current && !playersRef.current.includes(ref)) {
      playersRef.current.push(ref);
    }
  };

  const removePlayer = (ref: React.RefObject<ReactPlayer>) => {
    playersRef.current = playersRef.current.filter(
      (playerRef) => playerRef !== ref,
    );
  };

  const stopOtherPlayers = (ref: React.RefObject<ReactPlayer>) => {
    for (const playerRef of playersRef.current) {
      if (playerRef !== ref) {
        playerRef.current?.getInternalPlayer()?.pause?.(); // eslint-disable-line @typescript-eslint/no-unsafe-call
      }
    }
  };

  const stopAllPlayers = () => {
    for (const playerRef of playersRef.current) {
      playerRef.current?.getInternalPlayer()?.pause?.(); // eslint-disable-line @typescript-eslint/no-unsafe-call
    }
  };

  // Use useMemo to memoize the context value
  const contextValue = useMemo(
    () => ({
      addPlayer,
      removePlayer,
      stopAllPlayers,
      stopOtherPlayers,
    }),
    [],
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}
