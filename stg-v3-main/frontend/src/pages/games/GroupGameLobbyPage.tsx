import {useState, useMemo, useCallback, useEffect} from 'react';
import {Trans, Plural} from '@lingui/react/macro';
import api from '@client/ApiClient';
import Button from 'react-bootstrap/Button';
import QRCode from 'react-qr-code';
import {PersonFill, X} from 'react-bootstrap-icons';
import {
  type PatchHostQuizEvent,
  type GetGroupGameWithIdResponse,
} from '@client/ApiTypes';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {useNavigate, useParams} from 'react-router-dom';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {useToasts} from '@/components/toasts/index.js';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';
import BounsingBalls from '@/components/ui/BounsingBalls.js';
import {confirm} from '@/components/ui/confirm.js';

const getGameRoom = (gameId: string) => `/group-games/${gameId}/host`;

export default function GroupGameLobbyPage() {
  const {gameId} = useParams();
  const [game, setGame] = useState<GetGroupGameWithIdResponse>();
  const toasts = useToasts();
  const navigate = useNavigate();
  const {_} = useLingui();

  const codeLink = `${globalThis.location.origin}/games/join?code=${game?.code}`;

  const getGroupGameById = useCallback(
    async (id: string) => {
      try {
        const game = await api.getGroupGameWithId({id});
        setGame(game);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while loading the game`),
        });
      }
    },
    [toasts, _],
  );

  const ballsData = useMemo(() => {
    if (!game) return [];

    return game?.players.map((player) => ({
      id: player.id,
      label: player.nickname,
      ballColor: player.color,
      percentage: 100,
      lottiePath: `/animations/avatars/${player.avatar}.json`,
    }));
  }, [game]);

  const joinGroupGameRoom = useCallback(() => {
    if (!game) return;
    console.log('Joining room', getGameRoom(game.id));
    socket.emit(JOIN, getGameRoom(game.id));
  }, [game]);

  const onGamePatch = useCallback((patch: PatchHostQuizEvent) => {
    setGame((previous) => {
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

  useEffect(() => {
    if (!gameId) return;
    joinGroupGameRoom();
    socket.on('PatchHostGroupGameEvent', onGamePatch);
    socket.on(CONNECT, joinGroupGameRoom);

    return () => {
      socket.emit(LEAVE, getGameRoom(gameId));
      socket.off('PatchHostGroupGameEvent', onGamePatch);
      socket.off(CONNECT, joinGroupGameRoom);
    };
  }, [gameId, joinGroupGameRoom, onGamePatch]);

  useEffect(() => {
    void getGroupGameById(gameId!);
  }, [gameId, getGroupGameById]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible')
        void getGroupGameById(gameId!);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [getGroupGameById, gameId]);

  const handleStartGame = useCallback(async () => {
    if (!game) return;
    await api.updateGroupGame({id: game.id}, {isStarted: true});
    navigate(`/games/${game.gameType}s/${game.id}/host`);
  }, [game, navigate]);

  const handleRemovePlayer = useCallback(
    async (playerId: string) => {
      try {
        if (!game) return;
        const confirmed = await confirm({
          title: _(msg`Remove player`),
          text: _(msg`Are you sure you want to remove the player.`),
          cancel: _(msg`No, cancel`),
          confirm: _(msg`Yes, remove`),
        });
        if (!confirmed) return;

        await api.removeGroupGamePlayer({id: game.id, playerId});
        setGame((previous) =>
          previous
            ? {
                ...previous,
                players: previous.players.filter((p) => p.id !== playerId),
              }
            : previous,
        );
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
    },
    [game, toasts, _],
  );

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="w-100 position-absolute top-0 start-0 h-100"
      style={{
        backgroundColor: 'var(--primary-darker-1)',
      }}
    >
      {/* Background layer */}
      <div
        className="position-absolute"
        aria-hidden="true"
        style={{
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
        }}
      >
        <BounsingBalls
          data={ballsData}
          ballScale={Math.min(30 / ballsData.length, 2)}
          textScale={0.7}
        />
      </div>

      {/* SCROLL LAYER (full width/height) */}
      <div
        className="h-100 w-100 d-flex flex-column overflow-auto pb-5 pb-lg-0"
        style={{position: 'relative', zIndex: 1}}
      >
        {/* Centered content container with maxWidth */}
        <div className="w-100 mx-auto" style={{maxWidth: 1200}}>
          <div className="d-flex flex-column flex-lg-row">
            <div
              style={{backgroundColor: 'rgba(255 255 255 / 0.8)'}}
              className="w-75 w-lg-100 mx-auto me-lg-4 ms-lg-5 my-3 p-3 d-flex flex-column justify-content-center align-items-center rounded"
            >
              <div className="d-flex flex-column align-items-center h-100">
                <span className="h2 text-center">
                  {game.isCodeActive ? <Trans>Scan QR</Trans> : null}
                </span>
                <div
                  className="bg-white p-3 rounded"
                  style={{opacity: game.isCodeActive ? 1 : 0.3}}
                >
                  <div
                    style={{
                      height: 'auto',
                      margin: '0 auto',
                      maxWidth: 256,
                      width: '100%',
                    }}
                  >
                    <QRCode
                      size={256}
                      style={{height: 'auto', maxWidth: '100%', width: '100%'}}
                      value={codeLink}
                      viewBox="0 0 256 256"
                    />
                  </div>
                </div>

                {game.isCodeActive ? (
                  <>
                    <span className="h2 mt-3 text-center">
                      <Trans>or enter code at</Trans>
                      <br />
                      <span className="text-primary fw-bold fs-5">
                        {globalThis.location.host}/games/join
                      </span>
                    </span>
                    <span className="display-1 fw-bold mt-3">
                      {`${game.code.slice(0, 3)}-${game.code.slice(3)}`}
                    </span>
                  </>
                ) : (
                  <span className="h2 mt-3 text-center">
                    <Trans>The game has expired.</Trans>
                  </span>
                )}
              </div>
              <div className="mt-3">
                <GlobalLanguagePicker />
              </div>
            </div>

            <div
              style={{backgroundColor: 'rgba(255 255 255 / 0.8)'}}
              className="w-75 w-lg-100 mx-auto ms-lg-4 me-lg-5 my-3 p-3 d-flex flex-column justify-content-between align-items-center rounded"
            >
              <div className="d-flex flex-column align-items-center">
                <span className="display-5 fw-bold mt-3">
                  {game.players.length}
                </span>
                <span className="h4">
                  <PersonFill />{' '}
                  <Plural
                    value={game.players.length}
                    one="participant"
                    other="participants"
                  />
                </span>
                {game.players.length === 0 && (
                  <span className="h2 mt-5 text-center">
                    <Trans>Waiting for participants to join...</Trans>
                  </span>
                )}
                <div className="d-flex flex-wrap align-items-center mt-3 justify-content-center">
                  {game.players.map((player) => (
                    <div
                      key={player.id}
                      className="rounded px-3 py-2 m-2 cursor-pointer"
                      style={{backgroundColor: player.color}}
                      role="button"
                      onClick={async () => handleRemovePlayer(player.id)}
                    >
                      <span className="fs-4 fw-bolder">
                        {player.nickname} <X size={24} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/tablet inline start button */}
              <div className="d-none d-lg-block">
                <Button
                  key="start-button"
                  style={{width: 120, backgroundColor: '#fff'}}
                  className="text-primary fw-semibold"
                  disabled={game.players.length < 2}
                  onClick={handleStartGame}
                >
                  <Trans>Start</Trans>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div
        className="d-lg-none position-fixed bottom-0 start-0 end-0 p-2"
        style={{
          zIndex: 2,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'saturate(180%) blur(8px)',
          boxShadow: '0 -6px 16px rgba(0,0,0,0.2)',
        }}
      >
        <Button
          key="start-button-mobile"
          className="w-100 text-primary fw-semibold"
          style={{backgroundColor: '#fff'}}
          disabled={game.players.length < 2}
          onClick={handleStartGame}
        >
          <Trans>Start</Trans>
        </Button>
      </div>
    </div>
  );
}
