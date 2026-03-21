import {type RefObject, createContext, useContext} from 'react';

type PlayerContextType = {
  addPlayer: (reference: RefObject<HTMLVideoElement>) => void;
  removePlayer: (reference: RefObject<HTMLVideoElement>) => void;
  stopAllPlayers: () => void;
};

const playerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(playerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }

  return context;
};
