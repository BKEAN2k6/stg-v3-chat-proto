import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import constants from '@/constants.js';
import {
  usePlayerContext,
  type Pausable,
} from '@/context/Video/PlayerProvider.js';

type VideoSegment = {
  filename: string;
  loop: boolean;
  showToolbar: boolean;
  autoplay: boolean;
};

type LottieSegment = {
  start: number;
  stop: number;
  autoplay: boolean;
  loop: boolean;
  showToolbar: boolean;
};

type Manifest = {
  video: {
    file: string;
    segments: VideoSegment[];
  };
  lottie?: {
    file: string;
    segments: LottieSegment[];
  };
  background: string;
  cover: string;
  loop: boolean;
};

const host = constants.FILE_HOST;
type VideoWithControlsList = HTMLVideoElement & {
  controlsList?: DOMTokenList;
};

export default function ManifestVideoPlayer({
  url,
  isFullScreenAllowed,
  isClickable,
  onEnded,
}: {
  readonly url: string;
  readonly isFullScreenAllowed: boolean;
  readonly isClickable: boolean;
  readonly onEnded?: () => void;
}) {
  const playerReference = useRef<HTMLVideoElement>(null);
  const {addPlayer, removePlayer, stopOtherPlayers} = usePlayerContext();

  const [manifest, setManifest] = useState<Manifest>();
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);
    setHasError(false);
    setManifest(undefined);
    setPlaying(false);

    (async () => {
      try {
        const response = await fetch(`${url}/manifest.json`);
        if (!response.ok)
          throw new Error(`Failed to fetch manifest: ${response.status}`);
        const json = (await response.json()) as Manifest;
        if (!cancelled) {
          setManifest(json);
        }
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  const source = useMemo(() => {
    if (!manifest) return undefined;

    const segments = manifest.video?.segments ?? [];
    const last = segments.at(-1);
    const source_ = last?.filename
      ? `${host}${last.filename}`
      : manifest.video?.file
        ? `${host}${manifest.video.file}`
        : undefined;

    return source_;
  }, [manifest]);

  const cover = useMemo(() => {
    const c = manifest?.cover ? `${host}${manifest.cover}` : undefined;

    return c;
  }, [manifest]);
  const applyControlsList = useCallback(() => {
    const mediaElement = (playerReference.current ?? undefined) as
      | VideoWithControlsList
      | undefined;
    const controlsList = mediaElement?.controlsList;

    if (!controlsList) {
      return;
    }

    if (isFullScreenAllowed) {
      controlsList.remove('nofullscreen');
      return;
    }

    controlsList.add('nofullscreen');
  }, [isFullScreenAllowed]);

  useEffect(() => {
    applyControlsList();
  }, [applyControlsList, source]);

  // ---- Pausable registration
  const pausableReference = useRef<Pausable | undefined>(undefined);
  pausableReference.current ??= {
    pause() {
      setPlaying(false);
      playerReference.current?.pause();
    },
    shouldIgnoreStop() {
      const ignore = false;

      return ignore;
    },
  };

  useEffect(() => {
    const p = pausableReference.current!;

    addPlayer(p);
    return () => {
      removePlayer(p);
    };
  }, [addPlayer, removePlayer]);

  if (isFetching) {
    return null;
  }

  if (hasError || !source) {
    return (
      <div style={{position: 'relative', width: '100%', paddingTop: '56.25%'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Something went wrong while loading the content.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        pointerEvents: isClickable ? 'auto' : 'none',
      }}
    >
      <ReactPlayer
        ref={playerReference}
        playsInline
        controls
        src={source}
        playing={playing}
        light={cover}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onReady={applyControlsList}
        onPlay={() => {
          setPlaying(true);
          stopOtherPlayers(pausableReference.current!);
        }}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onClickPreview={() => {
          setPlaying(true);
          stopOtherPlayers(pausableReference.current!);
        }}
      />

      {!isClickable && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'not-allowed',
            background: 'transparent',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
