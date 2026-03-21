import {useState, useEffect, useCallback, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import {PersonFill, X} from 'react-bootstrap-icons';
import {useLingui} from '@lingui/react';
import {Trans, Plural, msg} from '@lingui/macro';
import Cards from '../Cards';
import HighestScores from '../HighestScores';
import api from '@/api/ApiClient';
import {Loader} from '@/components/ui/Loader';
import {socket} from '@/socket';
import {
  type GetHostMemoryGameResponse,
  type PatchMemoryGameEvent,
} from '@/api/ApiTypes';
import {CenterAligned} from '@/components/ui/CenterAligned';
import {useToasts} from '@/components/toasts';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker';
import {confirm} from '@/components/ui/confirm';

export default function HostMemoryGamePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {gameId} = useParams();
  const [memoryGame, setMemoryGame] = useState<GetHostMemoryGameResponse>();
  const gameRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const {width, height} = entries[0].contentRect;

        const newSize = Math.min(width - 30, height - 140);
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

  const onMemoryGamePatch = useCallback(async (patch: PatchMemoryGameEvent) => {
    setMemoryGame((previous) => {
      if (!previous) {
        return;
      }

      return {...previous, ...patch};
    });
  }, []);

  const joinMemoryGameRoom = useCallback(() => {
    socket.emit('join', `/memory-games/${gameId}`);
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

  useEffect(() => {
    joinMemoryGameRoom();
    socket.on('PatchMemoryGameEvent', onMemoryGamePatch);
    socket.on('connect', joinMemoryGameRoom);
    return () => {
      socket.emit('leave', `/memory-games/${gameId}/host`);
      socket.off('PatchMemoryGameEvent', onMemoryGamePatch);
      socket.off('connect', joinMemoryGameRoom);
    };
  }, [gameId, joinMemoryGameRoom, onMemoryGamePatch]);

  useEffect(() => {
    void getMemoryGame();
  }, [gameId, memoryGame?.isStarted, getMemoryGame]);

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

  const handleStartMemoryGame = async () => {
    try {
      if (!memoryGame) {
        return;
      }

      await api.updateMemoryGame(
        {id: memoryGame._id},
        {
          isStarted: true,
          isEnded: false,
        },
      );

      setMemoryGame({...memoryGame, isStarted: true, isEnded: false});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while starting the game`),
      });
    }
  };

  const handleEndMemoryGame = async () => {
    try {
      if (!memoryGame) {
        return;
      }

      await api.updateMemoryGame(
        {id: memoryGame._id},
        {
          isStarted: true,
          isEnded: true,
        },
      );

      setMemoryGame({...memoryGame, isStarted: true, isEnded: true});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while ending sprint`),
      });
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      if (!memoryGame) {
        return;
      }

      const confirmed = await confirm({
        title: _(msg`Remove player`),
        text: _(msg`Are you sure you want to remove the player.`),
        cancel: _(msg`No, cancel`),
        confirm: _(msg`Yes, remove`),
      });

      if (!confirmed) {
        return;
      }

      await api.removeMemoryGamePlayer({id: memoryGame._id, playerId});
      setMemoryGame((previousMemoryGame) => {
        if (!previousMemoryGame) {
          return;
        }

        const updatedPlayers = previousMemoryGame.players.filter(
          (player) => player._id !== playerId,
        );
        return {...previousMemoryGame, players: updatedPlayers};
      });
      toasts.success({
        header: _(msg`Player removed`),
        body: _(msg`The player has been successfully removed from the game.`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Failed to remove player from the game.`),
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

  const codeLink = `${window.location.origin}/games/memory-game/join?code=${memoryGame.code}`;

  let screen = 'start';
  if (memoryGame.isStarted && !memoryGame.isEnded) screen = 'run';
  if (memoryGame.isStarted && memoryGame.isEnded) screen = 'result';

  switch (screen) {
    case 'start': {
      return (
        <div
          className="w-100"
          style={{
            backgroundColor: 'var(--primary-darker-1)',
            minHeight: '100%',
          }}
        >
          <div
            className="d-flex flex-column w-100 h-100 mx-auto"
            style={{maxWidth: 1200}}
          >
            <div className="d-flex w-100 justify-content-center p-5">
              <span className="text-white fs-6 fs-lg-4">
                <Trans>Memory Game</Trans>
              </span>
            </div>
            <div className="d-flex flex-column flex-lg-row">
              <div
                style={{backgroundColor: '#fff'}}
                className="w-75 w-lg-100 mx-auto me-lg-4 ms-lg-5 my-3 mb-5 p-5 d-flex flex-column justify-content-center align-items-center rounded"
              >
                <div className="d-flex flex-column align-items-center h-100">
                  <span className="h2 text-center">
                    <Trans>Scan QR</Trans>
                  </span>
                  <QRCode value={codeLink} />
                  <span className="h2 mt-3 text-center">
                    <Trans>or enter code at</Trans>{' '}
                    <span className="text-primary fw-bold fs-5">
                      {window.location.host}/games/memory-game/join
                    </span>
                  </span>
                  <span className="display-1 fw-bold mt-3">
                    {memoryGame.code}
                  </span>
                </div>
                <div className="mt-3">
                  <GlobalLanguagePicker />
                </div>
              </div>
              <div
                style={{backgroundColor: '#fff'}}
                className="w-75 w-lg-100 mx-auto ms-lg-4 me-lg-5 my-3 mb-5 p-5 d-flex flex-column justify-content-between align-items-center rounded"
              >
                <div className="d-flex flex-column align-items-center">
                  <span className="display-5 fw-bold mt-3">
                    {memoryGame.players.length}
                  </span>
                  <span className="h4">
                    <PersonFill />{' '}
                    <Plural
                      value={memoryGame.players.length}
                      one="player"
                      other="players"
                    />
                  </span>
                  {memoryGame.players.length === 0 && (
                    <span className="h2 mt-5 text-center">
                      <Trans>Waiting for players to join...</Trans>
                    </span>
                  )}
                  <div className="d-flex flex-wrap align-items-center mt-3 mb-5">
                    {memoryGame.players.map((player) => (
                      <div
                        key={player._id}
                        className="rounded px-3 py-2 m-2 cursor-pointer"
                        style={{backgroundColor: player.color}}
                        role="button"
                        onClick={async () => handleRemovePlayer(player._id)}
                      >
                        <span className="fs-4 fw-bolder">
                          {player.nickname} <X size={24} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Button
                    key="start-button"
                    style={{width: 120, backgroundColor: '#fff'}}
                    className="text-primary fw-semibold"
                    disabled={memoryGame.players.length < 2}
                    onClick={handleStartMemoryGame}
                  >
                    <Trans>Start game</Trans>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'run': {
      const currentPlayer = memoryGame.players.find(
        (player) => player._id === memoryGame.currentPlayer,
      );

      return (
        <div
          className="w-100 h-100 p-5"
          style={{
            backgroundColor: 'var(--primary-darker-1)',
            backgroundImage: 'url(/images/backgrounds/balloons.png)',
          }}
        >
          <div ref={gameRef} className="bg-white h-100 rounded">
            <div className="d-flex flex-column justify-content-center align-items-center p-3 gap-3">
              <Cards
                size={cardSize} // Dynamically set the card size
                cards={memoryGame.cards.map(({_id, strength}) => {
                  return {
                    _id,
                    slug: strength,
                    isFlipped:
                      memoryGame.currentlyRevealedCards.includes(_id) ||
                      memoryGame.foundPairs.some(
                        (pair) => pair.card1 === _id || pair.card2 === _id,
                      ),

                    isClickable: false,
                  };
                })}
              />
              <span className="fs-4 fw-bold">
                Current player: {currentPlayer?.nickname}
              </span>
              <Button
                key="end-button"
                style={{width: 120}}
                onClick={handleEndMemoryGame}
              >
                <Trans>End Game</Trans>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    case 'result': {
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

    default: {
      return null;
    }
  }
}
