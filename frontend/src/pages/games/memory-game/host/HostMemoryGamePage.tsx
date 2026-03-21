import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect, useCallback, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import {useParams} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {
  type GetHostMemoryGameResponse,
  type PatchMemoryGameEvent,
} from '@client/ApiTypes';
import Cards from '../Cards.js';
import HighestScores from '../HighestScores.js';
import {Loader} from '@/components/ui/Loader.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {useToasts} from '@/components/toasts/index.js';

export default function HostMemoryGamePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {gameId} = useParams();
  const [memoryGame, setMemoryGame] = useState<GetHostMemoryGameResponse>();
  const gameReference = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const {width, height} = entries[0].contentRect;

        const newSize = Math.min(width - 30, height - 140);
        setCardSize(newSize);
      }
    });

    if (gameReference.current) {
      observer.observe(gameReference.current);
    }

    const currentGameReference = gameReference.current;

    return () => {
      if (currentGameReference) {
        observer.unobserve(currentGameReference);
      }
    };
  });

  const onMemoryGamePatch = useCallback(async (patch: PatchMemoryGameEvent) => {
    setMemoryGame((previous) => {
      if (!previous) return previous;

      if (
        new Date(patch.updatedAt).getTime() <
        new Date(previous.updatedAt).getTime()
      ) {
        return previous;
      }

      return {...previous, ...patch};
    });
  }, []);

  const joinMemoryGameRoom = useCallback(() => {
    socket.emit(JOIN, `/memory-games/${gameId}`);
  }, [gameId]);

  const getMemoryGame = useCallback(async () => {
    if (!gameId) {
      return;
    }

    try {
      const memoryGame = await api.getHostMemoryGame({id: gameId});
      setMemoryGame(memoryGame);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while loading the game`),
      });
    }
  }, [gameId, toasts, _]);

  const skipPlayer = async () => {
    try {
      if (!memoryGame) {
        return;
      }

      await api.skipPlayer({id: memoryGame.id});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while skipping the player`),
      });
    }
  };

  useEffect(() => {
    joinMemoryGameRoom();
    socket.on('PatchMemoryGameEvent', onMemoryGamePatch);
    socket.on(CONNECT, joinMemoryGameRoom);
    return () => {
      socket.emit(LEAVE, `/memory-games/${gameId}/host`);
      socket.off('PatchMemoryGameEvent', onMemoryGamePatch);
      socket.off(CONNECT, joinMemoryGameRoom);
    };
  }, [gameId, joinMemoryGameRoom, onMemoryGamePatch]);

  useEffect(() => {
    void getMemoryGame();
  }, [gameId, getMemoryGame]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void getMemoryGame();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameId, getMemoryGame]);

  const handleEndMemoryGame = async () => {
    try {
      if (!memoryGame) {
        return;
      }

      await api.updateMemoryGame(
        {id: memoryGame.id},
        {
          isEnded: true,
        },
      );

      setMemoryGame({...memoryGame, isEnded: true});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while ending sprint`),
      });
    }
  };

  if (!memoryGame) {
    return (
      <CenterAligned>
        <Loader />
      </CenterAligned>
    );
  }

  if (!memoryGame.isEnded) {
    const currentPlayer = memoryGame.players.find(
      (player) => player.id === memoryGame.currentPlayer,
    );

    return (
      <div
        className="w-100 h-100 p-5"
        style={{
          backgroundColor: 'var(--primary-darker-1)',
          backgroundImage: 'url(/images/backgrounds/balloons.png)',
        }}
      >
        <div ref={gameReference} className="bg-white h-100 rounded">
          <div className="d-flex flex-column justify-content-center align-items-center p-3 gap-3">
            <Cards
              size={cardSize}
              cards={memoryGame.cards.map(({id, strength}) => {
                return {
                  id,
                  slug: strength,
                  isFlipped:
                    memoryGame.currentlyRevealedCards.includes(id) ||
                    memoryGame.foundPairs.some(
                      (pair) => pair.card1 === id || pair.card2 === id,
                    ),

                  isClickable: false,
                };
              })}
            />
            {currentPlayer ? (
              <span className="fs-4 fw-bold">
                Current player: {currentPlayer.nickname}{' '}
                <Button onClick={skipPlayer}>
                  <Trans>Skip</Trans>
                </Button>
              </span>
            ) : null}
            <Button style={{width: 120}} onClick={handleEndMemoryGame}>
              <Trans>End Game</Trans>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-100 h-100 p-5"
      style={{
        backgroundColor: 'var(--primary-darker-1)',
        backgroundImage: 'url(/images/backgrounds/balloons.png)',
      }}
    >
      <div className="bg-white h-100 rounded d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column p-3">
          <HighestScores game={memoryGame} />
        </div>
      </div>
    </div>
  );
}
