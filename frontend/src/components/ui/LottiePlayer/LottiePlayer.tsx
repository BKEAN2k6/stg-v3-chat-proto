/* eslint-disable complexity */
import React, {useState, useEffect, useRef, type ChangeEvent} from 'react';
import {Form, Button} from 'react-bootstrap';
import {
  PlayFill,
  PauseFill,
  Fullscreen as FullscreenIcon,
  FullscreenExit,
  VolumeUp,
  VolumeMuteFill,
} from 'react-bootstrap-icons';
import {type AnimationItem} from 'lottie-web/build/player/lottie_light';
import {Howler} from 'howler';
import {type AnimationSegment} from '@client/ApiTypes.js';
import Player from './Player.js';
import './LottiePlayer.scss';
import {
  FullScreen,
  useFullScreenHandle,
} from '@/hooks/FullScreen/useFullScreen.js';
import {usePlayerContext} from '@/context/Video/PlayerProvider.js';
import {Loader} from '@/components/ui/Loader.js';

const {userAgent} = globalThis.navigator;
const isMobileApple = /ipad|iphone|ipod/i.test(userAgent);

export default function LottiePlayer({
  url,
  data,
  loop = false,
  isFullScreenAllowed = true,
  isAnimationClickable = true,
  isFrameNumberShown = false,
  onEnded,
}: {
  readonly url?: string;
  readonly data?: Record<string, unknown>;
  // eslint-disable-next-line react/boolean-prop-naming
  readonly loop?: boolean;
  readonly isFullScreenAllowed?: boolean;
  readonly isFrameNumberShown?: boolean;
  readonly isAnimationClickable?: boolean;
  readonly onEnded?: () => void;
}) {
  const fsHandle = useFullScreenHandle();
  const [animationData, setAnimationData] = useState<
    Record<string, unknown> | undefined
  >(data);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (data) {
      setAnimationData(data);
      setIsLoading(false);
      setHasError(false);
    }
  }, [data]);

  useEffect(() => {
    const fetchAnimationData = async () => {
      if (!url) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = (await response.json()) as Record<string, unknown>;
        setAnimationData(json);
      } catch (error) {
        console.error('Error fetching animation data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAnimationData();
  }, [url]);

  const customSegments: AnimationSegment[] = React.useMemo(
    () =>
      (animationData as any)?.customSegments &&
      Array.isArray((animationData as any).customSegments)
        ? ((animationData as any).customSegments as AnimationSegment[])
        : [],
    [animationData],
  );

  const {
    addPlayer,
    removePlayer,
    stopOtherPlayers,
    isMuted,
    toggleMute,
    volume,
    setVolume,
  } = usePlayerContext();
  const [animationInstance, setAnimationInstance] = useState<AnimationItem>();
  const [seekFrame, setSeekFrame] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const wrapperReference = useRef<
    {pause: () => void; play: () => void} | undefined
  >(undefined);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [nextRequested, setNextRequested] = useState(false);
  const wrapperDivReference = useRef<HTMLDivElement>(null);

  const hasLoopingAutoplayOrUpcoming = React.useCallback(() => {
    if (customSegments.length === 0) return false;
    for (let i = currentSegmentIndex; i < customSegments.length; i++) {
      const seg = customSegments[i];
      if (seg.autoplay && seg.loop) {
        return true;
      }
    }

    return false;
  }, [customSegments, currentSegmentIndex]);

  useEffect(() => {
    if (!animationInstance) return;
    const pausable = {
      play() {
        animationInstance.play();
        setIsPlaying(true);
      },
      pause() {
        animationInstance.pause();
        setIsPlaying(false);
      },
      shouldIgnoreStop: () => hasLoopingAutoplayOrUpcoming(),
    };
    wrapperReference.current = pausable;
    addPlayer(pausable);
    return () => {
      if (wrapperReference.current) removePlayer(wrapperReference.current);
    };
  }, [
    animationInstance,
    addPlayer,
    removePlayer,
    hasLoopingAutoplayOrUpcoming,
  ]);

  useEffect(() => {
    if (!animationInstance || customSegments.length === 0) return;
    const seg = customSegments[currentSegmentIndex];

    // Only stop others if this isn't an auto-starting *loop* segment.
    const shouldStopOthers = !(seg.autoplay && seg.loop);
    if (shouldStopOthers && wrapperReference.current) {
      stopOtherPlayers(wrapperReference.current);
    }

    if (seg.autoplay) {
      animationInstance.goToAndPlay(seg.start, true);
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      animationInstance.goToAndStop(seg.start, true);
      setIsPlaying(false);
    }
  }, [
    animationInstance,
    customSegments,
    currentSegmentIndex,
    stopOtherPlayers,
  ]);

  useEffect(() => {
    if (!animationInstance || customSegments.length === 0 || isSeeking) return;

    let rafId: number;
    const seg = customSegments[currentSegmentIndex];
    const last = customSegments.length - 1;

    const poll = () => {
      const f = animationInstance.currentFrame;
      if (f >= seg.stop) {
        if (nextRequested) {
          setNextRequested(false);
          setCurrentSegmentIndex((i) => (i < last ? i + 1 : i));
          return;
        }

        if (seg.loop) {
          animationInstance.goToAndPlay(seg.start, true);
        } else if (currentSegmentIndex < last) {
          setCurrentSegmentIndex(currentSegmentIndex + 1);
          return;
        } else if (loop || animationData?.loop) {
          onEnded?.();
          setCurrentSegmentIndex(0);
          return;
        } else {
          onEnded?.();
          animationInstance.pause();
          return;
        }
      }

      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [
    animationInstance,
    customSegments,
    currentSegmentIndex,
    nextRequested,
    loop,
    isSeeking,
    animationData?.loop,
    onEnded,
  ]);

  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarTimeoutReference = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const scheduleHideToolbar = () => {
    if (toolbarTimeoutReference.current) {
      clearTimeout(toolbarTimeoutReference.current);
    }

    toolbarTimeoutReference.current = setTimeout(() => {
      setShowToolbar(false);
    }, 5000);
  };

  useEffect(
    () => () => {
      if (toolbarTimeoutReference.current) {
        clearTimeout(toolbarTimeoutReference.current);
      }
    },
    [],
  );

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const sliderTimeoutReference = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const handleVolumeControlMouseEnter = () => {
    if (sliderTimeoutReference.current) {
      clearTimeout(sliderTimeoutReference.current);
    }

    setShowVolumeSlider(true);
  };

  const handleVolumeControlMouseLeave = () => {
    sliderTimeoutReference.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 200);
  };

  const handleVolumeSliderMouseEnter = () => {
    if (sliderTimeoutReference.current) {
      clearTimeout(sliderTimeoutReference.current);
    }
  };

  const handleVolumeSliderMouseLeave = () => {
    sliderTimeoutReference.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 200);
  };

  const isSeekingReference = useRef(isSeeking);
  useEffect(() => {
    isSeekingReference.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    if (!animationInstance) return;
    const onFrame = () => {
      if (!isSeekingReference.current) {
        setSeekFrame(Math.floor(animationInstance.currentFrame));
      }
    };

    try {
      animationInstance.addEventListener('enterFrame', onFrame);
    } catch {
      return;
    }

    return () => {
      try {
        animationInstance.removeEventListener('enterFrame', onFrame);
      } catch {}
    };
  }, [animationInstance]);

  useEffect(() => {
    if (!animationInstance) return;

    const wrapperNode = wrapperDivReference.current;

    const handleResize = () => {
      const wrapper = wrapperDivReference.current;
      if (!wrapper) return;

      if (!document.fullscreenElement) {
        if (wrapper.style.width !== '') {
          wrapper.style.width = '';
          wrapper.style.height = '';
          animationInstance.resize();
        }

        return;
      }

      setTimeout(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const aspectRatio = 16 / 9;

        let newWidth;
        let newHeight;

        if (viewportWidth / viewportHeight > aspectRatio) {
          newHeight = viewportHeight;
          newWidth = newHeight * aspectRatio;
        } else {
          newWidth = viewportWidth;
          newHeight = newWidth / aspectRatio;
        }

        wrapper.style.width = `${newWidth}px`;
        wrapper.style.height = `${newHeight}px`;
        animationInstance.resize();
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);

      if (wrapperNode) {
        wrapperNode.style.width = '';
        wrapperNode.style.height = '';
      }
    };
  }, [animationInstance]);

  const formatTime = (frame: number) => {
    const fr = (animationData as any).fr as number;
    if (!fr) return '00:00';
    const total = Math.floor(frame / fr);
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    return total >= 3600
      ? `${String(Math.floor(total / 3600)).padStart(2, '0')}:${mm}:${ss}`
      : `${mm}:${ss}`;
  };

  const handleTogglePlay = React.useCallback(() => {
    if (!animationInstance) return;
    if (animationInstance.isPaused) {
      if (wrapperReference.current) stopOtherPlayers(wrapperReference.current);
      animationInstance.play();
      setHasStarted(true);
      setIsPlaying(true);
    } else {
      animationInstance.pause();
      setIsPlaying(false);
    }
  }, [animationInstance, stopOtherPlayers]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === 'Space' &&
        animationInstance &&
        document.activeElement === wrapperDivReference.current
      ) {
        event.preventDefault();
        handleTogglePlay();
      }
    };

    globalThis.addEventListener('keydown', onKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', onKeyDown);
    };
  }, [animationInstance, handleTogglePlay]);

  const handleLoopControl = () => {
    if (!animationInstance) return;
    const seg = customSegments[currentSegmentIndex];
    if (!seg) return;

    if (seg.autoplay) {
      setNextRequested(true);
    } else if (isPlaying) {
      setNextRequested(true);
    } else {
      if (wrapperReference.current) stopOtherPlayers(wrapperReference.current);
      animationInstance.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  const handleSeekChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSeekFrame(Number(event.target.value));
  };

  const handleSeekStart = () => {
    if (isPlaying && animationInstance) {
      setWasPlaying(true);
      animationInstance.pause();
    } else {
      setWasPlaying(false);
    }

    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    if (!animationInstance) return;

    animationInstance.goToAndStop(seekFrame, true);

    const newIndex = customSegments.findIndex(
      (seg) => seekFrame >= seg.start && seekFrame <= seg.stop,
    );
    if (newIndex !== -1 && newIndex !== currentSegmentIndex) {
      setCurrentSegmentIndex(newIndex);
    }

    if (wasPlaying) {
      animationInstance.play();
      setIsPlaying(true);
    }

    setIsSeeking(false);
  };

  const handleContainerClick = () => {
    if (!isAnimationClickable) return;

    const seg = customSegments[currentSegmentIndex];
    if (seg?.loop) {
      setNextRequested(true);
    } else {
      handleTogglePlay();
    }

    wrapperDivReference.current?.focus();
  };

  const isLoopingSegment = Boolean(customSegments[currentSegmentIndex]?.loop);
  const segmentAllowsToolbar =
    customSegments[currentSegmentIndex]?.showToolbar ?? true;

  useEffect(() => {
    if (!segmentAllowsToolbar) {
      setShowToolbar(false);
      if (toolbarTimeoutReference.current) {
        clearTimeout(toolbarTimeoutReference.current);
      }
    }
  }, [currentSegmentIndex, segmentAllowsToolbar]);

  if (isLoading) {
    return (
      <div className="video-container">
        <div className="video-loader">
          <Loader />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="video-container">
        <div className="video-loader">
          Something went wrong while loading the content.
        </div>
      </div>
    );
  }

  const isFsActive = fsHandle.active;

  return (
    <FullScreen handle={fsHandle}>
      <div
        ref={wrapperDivReference}
        key={url ?? JSON.stringify(animationData)}
        tabIndex={0}
        style={{cursor: isLoopingSegment ? 'pointer' : 'default'}}
        className={`p-0 lottie-player-wrapper ${
          showToolbar ? 'toolbar-visible' : ''
        } ${hasStarted ? '' : 'initial-visible'}`}
        onClick={handleContainerClick}
        onMouseEnter={() => {
          if (!segmentAllowsToolbar) return;
          setShowToolbar(true);
          scheduleHideToolbar();
        }}
        onMouseMove={() => {
          if (!segmentAllowsToolbar) return;
          if (showToolbar) {
            scheduleHideToolbar();
          } else {
            setShowToolbar(true);
            scheduleHideToolbar();
          }
        }}
        onMouseLeave={() => {
          if (!segmentAllowsToolbar) return;
          setShowToolbar(false);
          if (toolbarTimeoutReference.current) {
            clearTimeout(toolbarTimeoutReference.current);
          }
        }}
      >
        <div>
          <Player
            animationData={animationData!}
            isInstanceMuted={isLoopingSegment}
            onAnimationLoaded={setAnimationInstance}
          />
          <div
            className="lottie-toolbar"
            onClick={(event) => {
              event.stopPropagation();
              wrapperDivReference.current?.focus();
            }}
          >
            {isLoopingSegment ? (
              <Button variant="link" size="sm" onClick={handleLoopControl}>
                <PlayFill />
              </Button>
            ) : (
              <>
                <Button variant="link" size="sm" onClick={handleTogglePlay}>
                  {isPlaying ? <PauseFill /> : <PlayFill />}
                </Button>
                <Form.Range
                  className="seek-slider"
                  min={0}
                  max={animationInstance?.totalFrames ?? 0}
                  step={1}
                  value={seekFrame}
                  onPointerDown={handleSeekStart}
                  onPointerUp={handleSeekEnd}
                  onTouchStart={handleSeekStart}
                  onTouchEnd={handleSeekEnd}
                  onChange={handleSeekChange}
                />
              </>
            )}

            <div className="right-controls">
              {!isLoopingSegment && (
                <div className="seek-time-container">
                  <span className="seek-time">{formatTime(seekFrame)}</span>
                  {isFrameNumberShown ? (
                    <span className="frame-number">
                      {Math.trunc(animationInstance?.currentFrame ?? 0)} /{' '}
                      {animationInstance?.totalFrames ?? 0}
                    </span>
                  ) : null}
                </div>
              )}
              <div
                className="volume-control"
                onMouseEnter={handleVolumeControlMouseEnter}
                onMouseLeave={handleVolumeControlMouseLeave}
              >
                <Button variant="link" size="sm" onClick={handleToggleMute}>
                  {isMuted || isLoopingSegment ? (
                    <VolumeMuteFill />
                  ) : (
                    <VolumeUp />
                  )}
                </Button>
                {!isMobileApple && (
                  <Form.Range
                    className="volume-slider"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    style={{display: showVolumeSlider ? 'block' : 'none'}}
                    onChange={(event) => {
                      const v = Number.parseFloat(event.target.value);
                      setVolume(v);
                      Howler.volume(v);
                    }}
                    onMouseEnter={handleVolumeSliderMouseEnter}
                    onMouseLeave={handleVolumeSliderMouseLeave}
                  />
                )}
              </div>
              {isFullScreenAllowed ? (
                <Button
                  variant="link"
                  size="sm"
                  className="fullscreen-btn"
                  onClick={async () =>
                    isFsActive ? fsHandle.exit() : fsHandle.enter()
                  }
                >
                  {isFsActive ? <FullscreenExit /> : <FullscreenIcon />}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
  );
}
