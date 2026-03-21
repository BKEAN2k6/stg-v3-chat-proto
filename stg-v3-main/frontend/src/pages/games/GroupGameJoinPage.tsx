import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  type ChangeEvent,
} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {
  type PatchPlayerGroupGameEvent,
  type GetGroupGameWithCodeResponse,
} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';
import {avatarColors, avatarSlugs} from '@/helpers/avatars.js';
import CodeInput from '@/components/ui/CodeInput.js';
import Logo from '@/components/ui/Logo.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {Loader} from '@/components/ui/Loader.js';

type WrapperProperties = {readonly children: ReactNode};
type Screen = 'join' | 'name' | 'color' | 'avatar' | 'wait';

const getGameRoom = (gameId: string) => `/group-games/${gameId}/player`;

function Wrapper({children}: WrapperProperties) {
  return (
    <div className="w-100 h-100">
      <div
        className="d-flex flex-column w-100 h-100 mx-auto"
        style={{maxWidth: 1200}}
      >
        <div className="d-flex flex-column justify-content-between h-100 px-3">
          <div className="mx-auto mt-5">
            <Logo className="mb-5" color="#fdd662" height={64} width={64} />
          </div>
          <div>{children}</div>
          <div className="mx-auto py-5">
            <GlobalLanguagePicker />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GroupGameJoinPage() {
  const {_} = useLingui();
  const navigate = useNavigate();
  const toasts = useToasts();
  const [searchParameters, setSearchParameters] = useSearchParams();

  const [game, setGame] = useState<GetGroupGameWithCodeResponse>();
  const [errorType, setErrorType] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState('');
  const [avatar, setAvatar] = useState('');
  const [screen, setScreen] = useState<Screen>('join');

  const joinGroupGameRoom = useCallback(() => {
    if (!game) return;
    socket.emit(JOIN, getGameRoom(game.id));
  }, [game]);

  const onGamePatch = useCallback((patch: PatchPlayerGroupGameEvent) => {
    setGame((previous) => {
      if (!previous) return previous;
      if (
        new Date(patch.updatedAt).getTime() <
        new Date(previous.updatedAt).getTime()
      ) {
        return previous; // ignore out-of-order patches
      }

      // Patch merges players/isStarted/updatedAt (never `player`)
      return {...previous, ...patch};
    });
  }, []);

  const getGameWithCode = useCallback(
    async (joinCode: string) => {
      try {
        const fetched = await api.getGroupGameWithCode({code: joinCode});
        setGame(fetched);

        setSearchParameters((parameters) => {
          const next = new URLSearchParams(parameters);
          next.set('code', joinCode);
          return next;
        });

        // 1) If no player in initial response → form; otherwise → wait
        setScreen(fetched.player ? 'wait' : 'name');
        setErrorType('');
      } catch (error) {
        const {message} = error as Error;
        if (message === 'Game not found') {
          setErrorType('not-found');
        } else {
          toasts.danger({
            header: _(msg`Oops!`),
            body: _(msg`Something went wrong while joining the game`),
          });
        }
      }
    },
    [toasts, _, setSearchParameters],
  );

  // Socket lifecycle tied to game id
  useEffect(() => {
    if (!game?.id) return;

    joinGroupGameRoom();
    socket.on('PatchPlayerGroupGameEvent', onGamePatch);
    socket.on(CONNECT, joinGroupGameRoom);

    return () => {
      socket.emit(LEAVE, getGameRoom(game.id));
      socket.off('PatchPlayerGroupGameEvent', onGamePatch);
      socket.off(CONNECT, joinGroupGameRoom);
    };
  }, [game?.id, joinGroupGameRoom, onGamePatch]);

  // Refresh when tab regains visibility
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') return;
      if (code?.length === 6) void getGameWithCode(code);
    };

    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [code, getGameWithCode]);

  // Pull code from URL and auto-fetch if present
  useEffect(() => {
    const initial = searchParameters.get('code');
    if (initial) {
      setCode(initial);
      void getGameWithCode(initial);
    }
  }, [getGameWithCode, searchParameters]);

  // Navigate when game starts and we have a local player
  useEffect(() => {
    if (game?.isStarted && game.player) {
      navigate(`/games/${game.gameType}s/${game.id}/player`);
    }
  }, [game?.isStarted, game?.player, game?.id, game?.gameType, navigate]);

  // 2) ANY patch where players omits our id → recreate (go back to form)
  useEffect(() => {
    const id = game?.player?.id;
    if (!id) return;
    if (!game.players.includes(id)) {
      setNickname('');
      setColor('');
      setAvatar('');
      setGame((previous) =>
        previous ? {...previous, player: undefined} : previous,
      );
      setScreen('name');
    }
  }, [game?.players, game?.player?.id]);

  const onCodeChange = (newCode: string) => {
    setErrorType('');
    setCode(newCode);
  };

  const onCodeSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length === 6) await getGameWithCode(code);
  };

  const onNameSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    setNickname(trimmed);
    if (!trimmed) return;
    setScreen('color');
  };

  const onColorSubmit = (pickedColor: string) => {
    setColor(pickedColor);
    setScreen('avatar');
  };

  const handleSave = useCallback(
    async ({
      nickname,
      color,
      avatar,
    }: {
      nickname: string;
      color: string;
      avatar: string;
    }) => {
      if (!game) return;
      try {
        const payload = {nickname, color, avatar};
        const player = await api.createGroupGamePlayer({id: game.id}, payload);

        // Optimistically set local player and append id
        setGame((previous) =>
          previous
            ? {
                ...previous,
                player,
                players: previous.players.includes(player.id)
                  ? previous.players
                  : [...previous.players, player.id],
              }
            : previous,
        );

        setScreen('wait');
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while joining the game`),
        });
      }
    },
    [game, toasts, _],
  );

  const onAvatarSubmit = (pickedAvatar: string) => {
    setAvatar(pickedAvatar);
    void handleSave({nickname, color, avatar: pickedAvatar});
  };

  switch (screen) {
    case 'join': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Enter code to join</Trans>
          </h3>
          <Form
            className="mt-4 d-flex flex-column align-items-center gap-4"
            onSubmit={onCodeSubmit}
          >
            <CodeInput controlId="shortCode" onChange={onCodeChange} />
            {errorType === 'not-found' && (
              <span className="text-danger">
                <Trans>Game with this code was not found</Trans>
              </span>
            )}
            <Button
              variant="primary"
              type="submit"
              style={{maxWidth: 325}}
              className="w-100"
              disabled={code.length !== 6 || errorType !== ''}
            >
              <Trans>Continue</Trans>
            </Button>
          </Form>
        </Wrapper>
      );
    }

    case 'name': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Add your name</Trans>
          </h3>
          <Form
            className="mt-4 d-flex flex-column align-items-center gap-4"
            onSubmit={onNameSubmit}
          >
            <Form.Control
              autoFocus
              required
              name="name"
              className="w-100"
              style={{maxWidth: 325}}
              maxLength={20}
              value={nickname}
              onBlur={() => {
                setNickname(nickname.trim());
              }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNickname(event.target.value);
              }}
            />
            <Button
              variant="primary"
              type="submit"
              style={{maxWidth: 325}}
              className="w-100"
            >
              <Trans>Continue</Trans>
            </Button>
          </Form>
        </Wrapper>
      );
    }

    case 'color': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Choose color</Trans>
          </h3>
          <div
            className="mt-4 d-flex flex-wrap justify-content-center mx-auto"
            style={{maxWidth: 325}}
          >
            {avatarColors.slice(0, 25).map((avatarColor) => (
              <Button
                key={avatarColor}
                className="rounded-circle"
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: avatarColor,
                  margin: '0.5rem',
                  border: 'none',
                }}
                aria-label={_(msg`Choose color ${avatarColor}`)}
                onClick={() => {
                  onColorSubmit(avatarColor);
                }}
              />
            ))}
          </div>
        </Wrapper>
      );
    }

    case 'avatar': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Choose avatar</Trans>
          </h3>
          <div
            className="mt-4 d-flex flex-wrap justify-content-center gap-3 mx-auto"
            style={{maxWidth: 325}}
          >
            {avatarSlugs.map((slug) => (
              <Button
                key={slug}
                variant={avatar === slug ? 'primary' : 'light'}
                className="d-flex align-items-center justify-content-center p-0 m-0"
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
                aria-label={_(msg`Choose avatar ${slug}`)}
                onClick={() => {
                  onAvatarSubmit(slug);
                }}
              >
                <SimpleLottiePlayer
                  src={`/animations/avatars/${slug}.json`}
                  style={{width: '5rem', height: '5rem'}}
                />
              </Button>
            ))}
          </div>
        </Wrapper>
      );
    }

    case 'wait': {
      if (!game?.player) return null;

      return (
        <CenterAligned>
          <div>
            <h3 style={{marginBottom: '2rem'}}>
              <Trans>You are ready to go!</Trans>
            </h3>
            <div
              className="rounded-circle mx-auto"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: game.player.color,
                margin: '0.5rem',
                border: 'none',
              }}
            >
              <SimpleLottiePlayer
                autoplay
                loop
                src={`/animations/avatars/${game.player.avatar}.json`}
              />
            </div>
            <h4 className="text-center mt-4">{game.player.nickname}</h4>
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
  }
}
