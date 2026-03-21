import {useEffect} from 'react';
import explosionSound from './explosion.mp3';
import ConfettiExplosion from '@/components/ui/ConfettiExplosion/index.js';

export type Explosion = {
  id: number;
  left: string;
  top: string;
};

export default function SoundedExplosion({
  explosion,
  onComplete,
}: {
  readonly explosion: Explosion;
  readonly onComplete: (id: number) => void;
}) {
  useEffect(() => {
    const sound = new Audio(explosionSound).cloneNode() as HTMLAudioElement;
    void sound.play();
  }, []);
  return (
    <div
      style={{
        position: 'fixed',
        left: explosion.left,
        top: explosion.top,
        zIndex: 10_001,
      }}
    >
      <ConfettiExplosion
        particleCount={50}
        zIndex={10_002}
        onComplete={() => {
          onComplete(explosion.id);
        }}
      />
    </div>
  );
}
