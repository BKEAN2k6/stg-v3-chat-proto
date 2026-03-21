import {useRef, useEffect} from 'react';
import ReactPlayer, {type VimeoPlayerProps} from 'react-player/vimeo';
import {usePlayerContext} from '@/context/Video/PlayerProvider';

type VideoPlayeProps = {
  readonly isOnlyVideoPlaying?: boolean;
  readonly vimeoProps: VimeoPlayerProps;
};

function VideoPlayer(props: VideoPlayeProps): JSX.Element {
  const playerRef = useRef<ReactPlayer>(null);
  const {addPlayer, removePlayer, stopOtherPlayers} = usePlayerContext();

  useEffect(() => {
    addPlayer(playerRef);

    return () => {
      removePlayer(playerRef);
    };
  }, [addPlayer, removePlayer]);

  const {isOnlyVideoPlaying, vimeoProps} = props;

  const onPlay = isOnlyVideoPlaying
    ? () => {
        props.vimeoProps.onPlay?.();
        stopOtherPlayers(playerRef);
      }
    : props.vimeoProps.onPlay;

  return <ReactPlayer ref={playerRef} {...vimeoProps} onPlay={onPlay} />;
}

export default VideoPlayer;
