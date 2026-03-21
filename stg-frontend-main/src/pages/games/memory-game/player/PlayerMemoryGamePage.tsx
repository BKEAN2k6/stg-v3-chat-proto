import {useState, useEffect, useCallback, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import {Trans, msg} from '@lingui/macro';
import Cards from '../Cards';
import HighestScores from '../HighestScores';
import {CenterAligned} from '@/components/ui/CenterAligned';
import {Loader} from '@/components/ui/Loader';
import api, {ApiError} from '@/api/ApiClient';
import {socket} from '@/socket';
import {
  type GetPlayerMemoryGameResponse,
  type PatchMemoryGameEvent,
} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';

export default function PlayerMemoryGamePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const navigate = useNavigate();
  const {gameId} = useParams();
  const [memoryGame, setMemoryGame] = useState<GetPlayerMemoryGameResponse>();
  const gameRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(0);

  const onMemoryGamePatch = useCallback(async (patch: PatchMemoryGameEvent) => {
    setMemoryGame((memoryGame) => {
      if (!memoryGame) {
        return;
      }

      return {...memoryGame, ...patch};
    });
  }, []);

  const joinMemoryGameRoom = useCallback(() => {
    socket.emit('join', `/memory-games/${gameId}`);
  }, [gameId]);

  const handleCardClick = async ({_id}: {_id: string}) => {
    if (!gameId) {
      return;
    }

    try {
      await api.createMemoryGamePick(
        {
          id: gameId,
        },
        {
          cardId: _id,
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
    socket.on('connect', joinMemoryGameRoom);
    return () => {
      socket.emit('leave', `/memory-games/${gameId}`);
      socket.off('PatchMemoryGameEvent', onMemoryGamePatch);
      socket.off('connect', joinMemoryGameRoom);
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
        navigate('/games/memory-game/join');
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
  }, [memoryGame?.isStarted, memoryGame?.isEnded, fetchMemoryGameData]);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const {width, height} = entries[0].contentRect;

        const newSize = Math.min(width, height - 40);
        setCardSize(newSize);
      }
    });

    if (gameRef.current) {
      observer.observe(gameRef.current);
    }

    const currentGameRef = gameRef.current;

    return () => {
      if (currentGameRef) {
        observer.unobserve(currentGameRef);
      }
    };
  });

  if (
    memoryGame &&
    !memoryGame.players.some((player) => player._id === memoryGame.player._id)
  ) {
    navigate('/games/memory-games/join');
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

  let screen = 'pick';
  if (!memoryGame.isStarted) screen = 'wait';
  if (memoryGame.isEnded) screen = 'result';

  switch (screen) {
    case 'wait': {
      return (
        <CenterAligned>
          <div>
            <h3
              style={{
                marginBottom: '2rem',
              }}
            >
              <Trans>You are ready to go!</Trans>
            </h3>
            <div
              className="rounded-circle mx-auto"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: memoryGame.player.color,
                margin: '0.5rem',
                border: 'none',
              }}
            />
            <h4 className="text-center mt-4">{memoryGame.player.nickname}</h4>
            <p className="mt-5">
              <Trans>Just a moment, waiting for the game to start.</Trans>
            </p>
            <div className="mt-5">
              <Loader />
            </div>
          </div>
        </CenterAligned>
      );
    }

    case 'pick': {
      const currentPlayer = memoryGame.players.find(
        (player) => player._id === memoryGame.currentPlayer,
      );

      return (
        <div
          ref={gameRef}
          className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-3 gap-2"
        >
          <Cards
            size={cardSize}
            cards={memoryGame.cards.map(({_id, strength}) => {
              return {
                _id,
                slug: strength,
                isFlipped:
                  memoryGame.currentlyRevealedCards.includes(_id) ||
                  memoryGame.foundPairs.some(
                    (pair) => pair.card1 === _id || pair.card2 === _id,
                  ),

                isClickable:
                  !memoryGame.currentlyRevealedCards.includes(_id) &&
                  !memoryGame.foundPairs.some(
                    (pair) => pair.card1 === _id || pair.card2 === _id,
                  ) &&
                  memoryGame.currentlyRevealedCards.length < 2 &&
                  memoryGame.currentPlayer === memoryGame.player._id,
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

    case 'result': {
      return (
        <CenterAligned>
          <div className="d-flex flex-column justify-content-between px-3">
            <HighestScores game={memoryGame} />
          </div>
        </CenterAligned>
      );
    }

    default: {
      return null;
    }
  }
}
