import {
  type SyntheticEvent,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import ReactPlayer from 'react-player';
import {type ReactPlayerProps} from 'react-player/types';
import Button from 'react-bootstrap/Button';
import api from '@client/ApiClient';
import {Loader} from './Loader.js';
import {
  usePlayerContext,
  type Pausable,
} from '@/context/Video/PlayerProvider.js';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type VideoPlayerProperties = {
  readonly isOnlyVideoPlaying?: boolean;
  readonly vimeoProps: ReactPlayerProps;
};

function normalizeVimeoSource(source: string): string {
  let parsedSource: URL;
  try {
    parsedSource = new URL(source);
  } catch {
    return source;
  }

  const host = parsedSource.hostname.toLowerCase();
  if (host !== 'vimeo.com' && host !== 'www.vimeo.com') {
    return source;
  }

  if (parsedSource.searchParams.has('h')) {
    return parsedSource.toString();
  }

  const pathSegments = parsedSource.pathname.split('/').filter(Boolean);

  let idIndex = 0;
  if (pathSegments[0] === 'video' || pathSegments[0] === 'event') {
    idIndex = 1;
  }

  const videoId = pathSegments[idIndex];
  const privateHash = pathSegments[idIndex + 1];

  if (!videoId || !/^\d+$/.test(videoId) || !privateHash) {
    return parsedSource.toString();
  }

  parsedSource.searchParams.set('h', privateHash);
  return parsedSource.toString();
}

function VimeoPlayer(properties: VideoPlayerProperties) {
  const {_} = useLingui();
  const {isOnlyVideoPlaying, vimeoProps} = properties;
  const playerReference = useRef<HTMLVideoElement>(null);
  const {addPlayer, removePlayer, stopOtherPlayers} = usePlayerContext();
  const [isLoading, setIsLoading] = useState(true);
  const [consentUpdating, setConsentUpdating] = useState(false);
  const {currentUser, setCurrentUser} = useCurrentUser();
  const toasts = useToasts();
  const player = useMemo<Pausable>(
    () => ({
      pause() {
        playerReference.current?.pause();
      },
    }),
    [],
  );

  useEffect(() => {
    addPlayer(player);
    return () => {
      removePlayer(player);
    };
  }, [addPlayer, removePlayer, player]);

  const source = useMemo(() => {
    if (typeof vimeoProps.src !== 'string') {
      return vimeoProps.src;
    }

    return normalizeVimeoSource(vimeoProps.src);
  }, [vimeoProps.src]);

  const resolvedVimeoProps = useMemo<ReactPlayerProps>(
    () => ({
      ...vimeoProps,
      src: source,
      config: {
        ...vimeoProps.config,
        vimeo: {
          ...vimeoProps.config?.vimeo,
          dnt: true,
          cc: false,
          transcript: false,
          pip: false,
        },
      },
    }),
    [source, vimeoProps],
  );

  const markAsLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, [source]);

  const onPlay = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      markAsLoaded();
      resolvedVimeoProps.onPlay?.(event);
      if (isOnlyVideoPlaying) {
        stopOtherPlayers(player);
      }
    },
    [
      isOnlyVideoPlaying,
      markAsLoaded,
      player,
      resolvedVimeoProps,
      stopOtherPlayers,
    ],
  );

  const onLoadedMetadata = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      markAsLoaded();
      resolvedVimeoProps.onLoadedMetadata?.(event);
    },
    [markAsLoaded, resolvedVimeoProps],
  );

  const onCanPlay = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      markAsLoaded();
      resolvedVimeoProps.onCanPlay?.(event);
    },
    [markAsLoaded, resolvedVimeoProps],
  );

  const onPlaying = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      markAsLoaded();
      resolvedVimeoProps.onPlaying?.(event);
    },
    [markAsLoaded, resolvedVimeoProps],
  );

  const onError = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      markAsLoaded();
      resolvedVimeoProps.onError?.(event);
    },
    [markAsLoaded, resolvedVimeoProps],
  );

  const onReady = useCallback(() => {
    markAsLoaded();
    resolvedVimeoProps.onReady?.();
  }, [markAsLoaded, resolvedVimeoProps]);

  if (!currentUser) {
    return null;
  }

  if (!currentUser.consents.vimeo) {
    const handleConsentUpdate = async () => {
      setConsentUpdating(true);
      try {
        const updatedUser = await api.updateMe({
          consents: {
            ...currentUser.consents,
            vimeo: true,
          },
        });

        setCurrentUser({...currentUser, ...updatedUser});
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(
            msg`Something went wrong while saving your consent settings.`,
          ),
        });
      } finally {
        setConsentUpdating(false);
      }
    };

    return (
      <div className="ratio ratio-16x9">
        <div className="d-flex flex-column align-items-center justify-content-center text-center p-1 p-sm-5">
          <img
            className="d-none d-lg-block"
            src="/images/strengths/selfRegulation.png"
            alt="Strength sprint is fun!"
            style={{width: 200}}
          />

          <p>
            <Trans>
              We use{' '}
              <a href="https://vimeo.com" target="_blank" rel="noreferrer">
                Vimeo
              </a>{' '}
              to host videos on our site. To view this video, you need to enable
              Vimeo cookies. You can later update this setting in your profile.
            </Trans>
          </p>
          <Button
            variant="primary"
            disabled={consentUpdating}
            onClick={handleConsentUpdate}
          >
            {consentUpdating ? (
              <Trans>Updating...</Trans>
            ) : (
              <Trans>Enable Vimeo cookies</Trans>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-container">
      <div className="video-loader">
        <Loader />
      </div>
      <div style={{visibility: isLoading ? 'hidden' : 'visible'}}>
        <ReactPlayer
          ref={playerReference}
          className="video-fade-in"
          {...resolvedVimeoProps}
          onPlay={onPlay}
          onReady={onReady}
          onLoadedMetadata={onLoadedMetadata}
          onCanPlay={onCanPlay}
          onPlaying={onPlaying}
          onError={onError}
        />
      </div>
    </div>
  );
}

export default VimeoPlayer;
