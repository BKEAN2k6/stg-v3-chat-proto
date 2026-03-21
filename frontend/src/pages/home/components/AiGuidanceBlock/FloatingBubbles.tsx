import {useEffect, useRef, type CSSProperties, type ReactNode} from 'react';
import {createPortal} from 'react-dom';

const defaultColors = ['#ef7570', '#fdd662', '#4d97b5', '#3ab5a1', '#a5d7d5'];

type BubbleState = 'rising' | 'popping' | 'inactive';

type Bubble = {
  x: number;
  y: number;
  radius: number;
  color: string;
  type: 'circle' | 'star';
  state: BubbleState;
  velocityY: number;
  velocityX: number;
  swirlPhase: number;
  swirlFrequency: number;
  swirlAmplitude: number;
  popProgress: number;
  popHeight: number;
  originalRadius: number;
};

type FloatingBubblesProperties = {
  readonly state?: 'inactive' | 'active' | 'finishing';
  readonly bubbleCount?: number;
  readonly spawnRate?: number;
  readonly minSize?: number;
  readonly maxSize?: number;
  readonly speed?: number;
  readonly swirlAmount?: number;
  readonly starRatio?: number;
  readonly opacity?: number;
  readonly colors?: string[];
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
  readonly onAnimationComplete?: () => void;
};

export default function FloatingBubbles({
  children,
  colors = defaultColors,
  bubbleCount = 30,
  spawnRate = 4,
  minSize = 10,
  maxSize = 25,
  speed = 1,
  swirlAmount = 1,
  starRatio = 0.3,
  opacity = 0.25,
  state = 'active',
  onAnimationComplete,
  className,
  style,
}: FloatingBubblesProperties) {
  const sourceReference = useRef<HTMLDivElement>(null);
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const rafReference = useRef<number | undefined>(undefined);
  const bubblesReference = useRef<Bubble[]>([]);
  const lastTimeReference = useRef<number | undefined>(undefined);
  const spawnAccumulatorReference = useRef(0);

  useEffect(() => {
    const pool: Bubble[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      pool.push({
        x: 0,
        y: 0,
        radius: 0,
        color: colors[0],
        type: 'circle',
        state: 'inactive',
        velocityY: 0,
        velocityX: 0,
        swirlPhase: 0,
        swirlFrequency: 0,
        swirlAmplitude: 0,
        popProgress: 0,
        popHeight: 0,
        originalRadius: 0,
      });
    }

    bubblesReference.current = pool;
  }, [bubbleCount, colors]);

  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    const spawnBubble = () => {
      if (!sourceReference.current) return;

      const bubble = bubblesReference.current.find(
        (b) => b.state === 'inactive',
      );
      if (!bubble) return;

      const rect = sourceReference.current.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      const radius = minSize + Math.random() * (maxSize - minSize);

      bubble.x = startX;
      bubble.y = startY;
      bubble.radius = radius;
      bubble.originalRadius = radius;
      bubble.color = colors[Math.floor(Math.random() * colors.length)];
      bubble.type = Math.random() < starRatio ? 'star' : 'circle';
      bubble.state = 'rising';

      const baseSpeed = 50 + Math.random() * 50;
      bubble.velocityY = baseSpeed * speed;

      bubble.velocityX = (Math.random() - 0.5) * 60;

      bubble.swirlPhase = Math.random() * Math.PI * 2;
      bubble.swirlFrequency = 1 + Math.random() * 2;
      bubble.swirlAmplitude = (5 + Math.random() * 10) * swirlAmount;
      bubble.popProgress = 0;

      const travelDistribution = 150 + Math.random() * 300;
      bubble.popHeight = Math.max(0, startY - travelDistribution);
    };

    const drawStar = ({
      cx,
      cy,
      spikes,
      outerRadius,
      innerRadius,
    }: {
      cx: number;
      cy: number;
      spikes: number;
      outerRadius: number;
      innerRadius: number;
    }) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }

      context.lineTo(cx, cy - outerRadius);
      context.closePath();
    };

    const updateBubbles = (dt: number) => {
      let activeCount = 0;

      for (const bubble of bubblesReference.current) {
        if (bubble.state === 'inactive') continue;
        activeCount++;

        if (bubble.state === 'rising') {
          const velocityMultiplier = state === 'finishing' ? 4 : 1;
          bubble.y -= bubble.velocityY * velocityMultiplier * dt;
          bubble.x += bubble.velocityX * dt;

          if (bubble.y <= bubble.popHeight) {
            bubble.state = 'popping';
            bubble.popProgress = 0;
          }
        } else if (bubble.state === 'popping') {
          bubble.y -= bubble.velocityY * dt * 0.5;
          bubble.popProgress += dt * 4; // Fast pop
          if (bubble.popProgress >= 1) {
            bubble.state = 'inactive';
          }
        }
      }

      return activeCount;
    };

    const drawBubbles = (time: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const bubble of bubblesReference.current) {
        if (bubble.state === 'inactive') continue;

        const swirlX =
          Math.sin(time * bubble.swirlFrequency + bubble.swirlPhase) *
          bubble.swirlAmplitude;
        const drawX = bubble.x + swirlX;
        const drawY = bubble.y;

        let currentOpacity = opacity;
        let currentRadius = bubble.radius;

        if (bubble.state === 'popping') {
          const ease = 1 - (1 - bubble.popProgress) ** 2;
          currentOpacity = opacity * (1 - ease);
          currentRadius = bubble.radius * (1 + ease * 0.5);
        }

        context.save();
        context.globalAlpha = currentOpacity;
        context.fillStyle = bubble.color;
        context.strokeStyle = bubble.color;

        if (bubble.type === 'star') {
          drawStar({
            cx: drawX,
            cy: drawY,
            spikes: 5,
            outerRadius: currentRadius,
            innerRadius: currentRadius / 2,
          });
        } else {
          context.beginPath();
          context.arc(drawX, drawY, currentRadius, 0, Math.PI * 2);
          context.fill();
          context.stroke();
        }

        context.restore();
      }
    };

    const step = (timestamp: number) => {
      lastTimeReference.current ??= timestamp;
      const dt = Math.min((timestamp - lastTimeReference.current) / 1000, 0.05);
      lastTimeReference.current = timestamp;
      const time = timestamp / 1000;

      if (state === 'active') {
        spawnAccumulatorReference.current += dt * spawnRate;
        while (spawnAccumulatorReference.current >= 1) {
          spawnBubble();
          spawnAccumulatorReference.current -= 1;
        }
      }

      const activeCount = updateBubbles(dt);
      drawBubbles(time);

      if (state === 'finishing' && activeCount === 0 && onAnimationComplete) {
        onAnimationComplete();
      }

      rafReference.current = requestAnimationFrame(step);
    };

    rafReference.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafReference.current) cancelAnimationFrame(rafReference.current);
    };
  }, [
    colors,
    bubbleCount,
    spawnRate,
    minSize,
    maxSize,
    speed,
    swirlAmount,
    starRatio,
    opacity,
    state,
    onAnimationComplete,
  ]);

  return (
    <>
      <div ref={sourceReference} className={className} style={style}>
        {children}
      </div>
      {createPortal(
        <canvas
          ref={canvasReference}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 1040,
          }}
        />,
        document.body,
      )}
    </>
  );
}
