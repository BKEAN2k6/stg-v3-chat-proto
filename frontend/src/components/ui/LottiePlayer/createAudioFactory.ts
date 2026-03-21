const {userAgent} = globalThis.navigator;
const isMobileApple = /ipad|iphone|ipod/i.test(userAgent);
const isDesktopSafari =
  /^((?!chrome|chromium|android).)*safari/i.test(userAgent) && !isMobileApple;

export default function createAudioFactory() {
  const instances: Howl[] = [];

  function setMuted(muted: boolean) {
    for (const s of instances) s.mute(muted);
  }

  function audioFactory(assetPath: string) {
    const sound = new Howl({
      src: [assetPath],
      format: ['mp3', 'wav', 'ogg'],
      html5: isMobileApple || isDesktopSafari,
      onplayerror() {
        console.log('Howler: play error, trying to unlock audio context');
        sound.once('unlock', function () {
          console.log('Howler: audio context unlocked, retrying play');
          sound.play();
        });
      },
    });
    instances.push(sound);

    let soundId: number | undefined;

    return {
      play() {
        if (soundId !== undefined) {
          sound.stop(soundId);
        }

        soundId = sound.play();
        return soundId;
      },
      pause() {
        if (soundId !== undefined) sound.pause(soundId);
      },
      stop() {
        if (soundId !== undefined) {
          sound.stop(soundId);
          soundId = undefined;
        }
      },
      seek(position: number) {
        if (soundId !== undefined) {
          sound.seek(position, soundId);
          return sound.seek(soundId);
        }

        return 0;
      },
      playing: () => (soundId === undefined ? false : sound.playing(soundId)),
      rate(r: number) {
        if (soundId !== undefined) sound.rate(r, soundId);
      },
      setVolume(v: number) {
        if (soundId !== undefined) sound.volume(v, soundId);
      },
    };
  }

  function cleanup() {
    for (const s of instances) {
      s.stop();
      s.unload();
    }

    instances.length = 0;
  }

  return {audioFactory, cleanup, setMuted};
}
