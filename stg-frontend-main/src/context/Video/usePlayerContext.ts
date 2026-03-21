import type React from 'react';
import {createContext, useContext} from 'react';
import type ReactPlayer from 'react-player/vimeo';

type PlayerContextType = {
  addPlayer: (ref: React.RefObject<ReactPlayer>) => void;
  removePlayer: (ref: React.RefObject<ReactPlayer>) => void;
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
