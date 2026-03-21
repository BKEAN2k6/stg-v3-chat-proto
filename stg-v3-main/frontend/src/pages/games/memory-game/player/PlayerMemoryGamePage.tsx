import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect, useCallback, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import api, {ApiError} from '@client/ApiClient';
import {
  type GetPlayerMemoryGameResponse,
  type PatchMemoryGameEvent,
} from '@client/ApiTypes';
import Cards from '../Cards.js';
import HighestScores from '../HighestScores.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {useToasts} from '@/components/toasts/index.js';

export default function PlayerMemoryGamePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const navigate = useNavigate();
  const {gameId} = useParams();
  const [memoryGame, setMemoryGame] = useState<GetPlayerMemoryGameResponse>();
  const gameReference = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(0);

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

  const handleCardClick = async ({id}: {id: string}) => {
    if (!gameId) {
      return;
    }

    try {
      await api.createMemoryGamePick(
        {
          id: gameId,
        },
        {
          cardId: id,
        },
      );
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while flipping the card`),
      });
    }
  };

  useEffect(() => {
    joinMemoryGameRoom();
    socket.on('PatchMemoryGameEvent', onMemoryGamePatch);
    socket.on(CONNECT, joinMemoryGameRoom);
    return () => {
      socket.emit(LEAVE, `/memory-games/${gameId}`);
      socket.off('PatchMemoryGameEvent', onMemoryGamePatch);
      socket.off(CONNECT, joinMemoryGameRoom);
    };
  }, [joinMemoryGameRoom, onMemoryGamePatch, gameId]);

  const fetchMemoryGameData = useCallback(async () => {
    try {
      if (!gameId) {
        return;
      }

      const fetchedMemoryGame = await api.getPlayerMemoryGame({id: gameId});
      setMemoryGame(fetchedMemoryGame);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        navigate('/games/join');
        return;
      }

      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while fetching the memoryGame`),
      });
    }
  }, [gameId, toasts, _, navigate]);

  useEffect(() => {
    void fetchMemoryGameData();
  }, [memoryGame?.isEnded, fetchMemoryGameData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchMemoryGameData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchMemoryGameData]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const {width, height} = entries[0].contentRect;

        const newSize = Math.min(width, height - 40);
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

  if (
    memoryGame &&
    !memoryGame.players.some((player) => player.id === memoryGame.player.id)
  ) {
    navigate('/games/join');
    return null;
  }

  if (!memoryGame) {
    return (
      <CenterAligned>
        <h1>
          <Trans>Loading...</Trans>
        </h1>
      </CenterAligned>
    );
  }

  if (!memoryGame.isEnded) {
    const currentPlayer = memoryGame.players.find(
      (player) => player.id === memoryGame.currentPlayer,
    );

    return (
      <div
        ref={gameReference}
        className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-3 gap-2"
      >
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

              isClickable:
                !memoryGame.currentlyRevealedCards.includes(id) &&
                !memoryGame.foundPairs.some(
                  (pair) => pair.card1 === id || pair.card2 === id,
                ) &&
                memoryGame.currentlyRevealedCards.length < 2 &&
                memoryGame.currentPlayer === memoryGame.player.id,
            };
          })}
          handleCardClick={handleCardClick}
        />
        <span className="fs-4 fw-bold">
          Current player: {currentPlayer?.nickname}
        </span>
      </div>
    );
  }

  return (
    <CenterAligned>
      <div className="d-flex flex-column justify-content-between px-3">
        <HighestScores game={memoryGame} />
      </div>
    </CenterAligned>
  );
}
