/**
 * AnimatedBubbles - A canvas-based animated bubble effect component.
 * Bubbles rise from the bottom, swirl upward with sinusoidal motion,
 * and pop (scale up + fade out) at random heights.
 *
 * Based on diploma decorations colors and the BounsingBalls canvas pattern.
 */
import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';

// Default strength colors from the diploma decorations
const defaultColors = [
  '#ef7570', // Kindness (Red/Pink)
  '#fdd662', // Self-regulation (Yellow/Orange)
  '#4d97b5', // Creativity (Blue)
  '#3ab5a1', // Hope (Teal/Green)
  '#a5d7d5', // Perseverance (Light Cyan)
];

type BubbleState = 'rising' | 'popping' | 'inactive';

type Bubble = {
  x: number;
  y: number;
  radius: number;
  color: string;
  type: 'circle' | 'star';
  state: BubbleState;
  // Physics
  velocityY: number; // Upward speed
  swirlPhase: number; // Phase offset for sinusoidal swirl
  swirlFrequency: number; // How fast it oscillates
  swirlAmplitude: number; // How far it moves sideways
  // Pop animation
  popProgress: number; // 0 to 1 during popping
  popHeight: number; // Y position where bubble will pop
  originalRadius: number;
  // Finish delay
  finishDelay?: number; // Delay before popping in finishing state
};

export type AnimatedBubblesProperties = {
  readonly colors?: readonly string[];
  readonly bubbleCount?: number; // Max simultaneous bubbles
  readonly spawnRate?: number; // Bubbles per second (at peak)
  readonly minSize?: number; // Min bubble radius ratio (relative to container)
  readonly maxSize?: number; // Max bubble radius ratio
  readonly speed?: number; // Rise speed multiplier
  readonly swirlAmount?: number; // Horizontal oscillation multiplier
  readonly starRatio?: number; // 0-1, ratio of stars vs circles
  readonly opacity?: number; // Bubble opacity
  readonly duration?: number; // Max duration for 'contained' mode (default 30)
  readonly className?: string;
  readonly style?: React.CSSProperties;
  // New props for full-screen / waiting behavior
  readonly mode?: 'contained' | 'full-screen';
  readonly state?: 'active' | 'finishing'; // 'active' = normal/waiting, 'finishing' = popping all
  readonly estimatedWaitTime?: number; // Time in ms over which spawn rate decays in full-screen mode
  readonly onAnimationComplete?: () => void;
};

export default function AnimatedBubbles({
  colors = defaultColors,
  bubbleCount = 30,
  spawnRate = 2,
  minSize = 0.015,
  maxSize = 0.04,
  speed = 1,
  swirlAmount = 1,
  starRatio = 0.3,
  opacity = 0.25,
  duration = 30, // Only used in 'contained' mode
  className,
  style,
  mode = 'contained',
  state = 'active',
  estimatedWaitTime = 5000,
  onAnimationComplete,
}: AnimatedBubblesProperties) {
  const containerReference = useRef<HTMLDivElement>(null);
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const rafReference = useRef<number | undefined>(undefined);
  const bubblesReference = useRef<Bubble[]>([]);
  const lastTimeReference = useRef<number | undefined>(undefined);
  const spawnAccumulatorReference = useRef(0);
  const startTimeReference = useRef<number | undefined>(undefined);

  // Initialize bubble pool
  useEffect(() => {
    // Re-init pool if size changes significantly
    const pool: Bubble[] = [];
    // Full screen usually needs more bubbles
    const actualBubbleCount =
      mode === 'full-screen' ? bubbleCount * 1.5 : bubbleCount;

    for (let i = 0; i < actualBubbleCount; i++) {
      pool.push({
        x: 0,
        y: 0,
        radius: 0,
        color: colors[0],
        type: 'circle',
        state: 'inactive',
        velocityY: 0,
        swirlPhase: 0,
        swirlFrequency: 0,
        swirlAmplitude: 0,
        popProgress: 0,
        popHeight: 0,
        originalRadius: 0,
      });
    }

    bubblesReference.current = pool;
  }, [bubbleCount, colors, mode]);

  // Canvas sizing with ResizeObserver
  useEffect(() => {
    const container = containerReference.current;
    const canvas = canvasReference.current;
    if (!container || !canvas) return;

    // In full-screen mode, we attach to window size, but checking container is cleaner
    // if we style the container to be fixed/full-screen.
    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      // In full-screen mode, ensure we use viewport dim
      const targetWidth =
        mode === 'full-screen' ? window.innerWidth : container.clientWidth;
      const targetHeight =
        mode === 'full-screen' ? window.innerHeight : container.clientHeight;

      const cssWidth = Math.max(1, Math.floor(targetWidth));
      const cssHeight = Math.max(1, Math.floor(targetHeight));

      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const dpr = Math.max(1, globalThis.devicePixelRatio || 1);
      const neededWidth = Math.floor(cssWidth * dpr);
      const neededHeight = Math.floor(cssHeight * dpr);

      if (canvas.width !== neededWidth || canvas.height !== neededHeight) {
        canvas.width = neededWidth;
        canvas.height = neededHeight;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
    });

    if (mode === 'contained') {
      try {
        ro.observe(container, {box: 'content-box'});
      } catch {
        ro.observe(container);
      }
    } else {
      // For full screen, listen to window resize
      window.addEventListener('resize', resize);
    }

    resize();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [mode]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasReference.current;
    // In full screen, the container might be just a wrapper,
    // but we use window dimensions inside loop mainly.
    // However, canvas.width/height (logical pixels) are set in resizer.
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const spawnBubble = (width: number, height: number) => {
      const bubble = bubblesReference.current.find(
        (b) => b.state === 'inactive',
      );
      if (!bubble) return;

      const size = Math.min(width, height);
      // In full screen, bubbles should perhaps be a bit larger or standard.
      // Adjust min/max relative to screen size is default behavior.
      const radius = size * (minSize + Math.random() * (maxSize - minSize));

      // Tree-like distribution for X position and pop height (only in contained mode?)
      // In full-screen, we probably want full coverage.
      const isFullScreen = mode === 'full-screen';

      const relativeY = Math.random() ** 0.4;
      const isLeft = Math.random() < 0.5;

      // In full screen, simply random X
      let startX;
      if (isFullScreen) {
        // Weighted random for full screen: denser on sides, sparse in center
        const power = 3.5; // Stronger bias factor
        const isLeft = Math.random() < 0.5;
        // Restrict to outer 35% of screen (leaving center 30% clear)
        const maxOffset = width * 0.35;
        const edgeOffset = maxOffset * Math.random() ** power;
        startX = isLeft ? edgeOffset : width - edgeOffset;
      } else {
        // Tapered tree logic for contained
        const baseWidth = width * 0.15;
        const currentBandWidth = baseWidth * (0.3 + 0.7 * relativeY);
        const edgeOffset = radius;
        const xOffset = Math.random() * currentBandWidth;
        startX = isLeft ? edgeOffset + xOffset : width - edgeOffset - xOffset;
      }

      bubble.x = startX;
      bubble.y = height + radius;
      bubble.radius = radius;
      bubble.originalRadius = radius;
      bubble.color = colors[Math.floor(Math.random() * colors.length)];
      bubble.type = Math.random() < starRatio ? 'star' : 'circle';
      bubble.state = 'rising';
      bubble.finishDelay = undefined; // reset delay
      bubble.velocityY = (30 + Math.random() * 40) * speed; // 30-70 px/s base
      // Full screen feels better with slightly faster bubbles?
      if (isFullScreen) bubble.velocityY *= 1.5;

      bubble.swirlPhase = Math.random() * Math.PI * 2;
      bubble.swirlFrequency = 1 + Math.random() * 2; // 1-3 Hz
      bubble.swirlAmplitude = (10 + Math.random() * 30) * swirlAmount;
      bubble.popProgress = 0;

      // Pop height logic
      // Pop height logic
      bubble.popHeight = isFullScreen
        ? height * Math.random() * 0.8
        : height * (1 - relativeY) * 0.9;
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
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerRadius;
        let y = cy + Math.sin(rot) * outerRadius;
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

    const drawBubble = (bubble: Bubble, time: number) => {
      const {x, color, type, swirlPhase, swirlFrequency, swirlAmplitude} =
        bubble;

      const swirlX =
        Math.sin(time * swirlFrequency + swirlPhase) * swirlAmplitude;
      const drawX = x + swirlX;
      const drawY = bubble.y;

      // Calculate opacity and scale for pop effect
      let currentOpacity = opacity;
      let currentRadius = bubble.radius;

      if (bubble.state === 'popping') {
        const popEase = 1 - (1 - bubble.popProgress) ** 2; // ease-out
        currentOpacity = opacity * (1 - popEase);
        currentRadius = bubble.radius * (1 + popEase * 0.5); // Expand 50%
      }

      context.save();
      context.globalAlpha = currentOpacity;
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 1;

      if (type === 'star') {
        drawStar({
          cx: drawX,
          cy: drawY,
          spikes: 5,
          outerRadius: currentRadius,
          innerRadius: currentRadius / 2.2,
        });
      } else {
        context.beginPath();
        context.arc(drawX, drawY, currentRadius, 0, Math.PI * 2);
        context.closePath();
      }

      context.fill();
      context.stroke();
      context.restore();
    };

    const calculateSpawnRate = (elapsedSeconds: number): number => {
      if (state !== 'active') return spawnRate;

      if (mode === 'contained') {
        // Standard burst logic
        if (elapsedSeconds < duration) {
          const progress = elapsedSeconds / duration;
          const multiplier = 3 * (1 - progress * progress); // 3x -> 0
          return spawnRate * multiplier;
        }
      } else {
        // Full-screen waiting logic
        // Decays over estimatedWaitTime but clamps at MIN_RATE
        // Starts high to fill screen quickly
        const waitProgress = Math.min(
          1,
          (elapsedSeconds * 1000) / estimatedWaitTime,
        );
        // Start at 4x, decay to 0.5x
        const decayMultiplier = 4 - 3.5 * waitProgress;
        return spawnRate * decayMultiplier;
      }

      return spawnRate;
    };

    const updateBubbles = (dt: number) => {
      let activeBubbleCount = 0;

      for (const bubble of bubblesReference.current) {
        if (bubble.state === 'inactive') continue;
        activeBubbleCount++;

        if (bubble.state === 'rising') {
          // Accelerate if finishing to clear screen faster
          const velocityMultiplier = state === 'finishing' ? 12 : 1;
          bubble.y -= bubble.velocityY * velocityMultiplier * dt;

          // Check if should start popping
          if (bubble.y <= bubble.popHeight) {
            bubble.state = 'popping';
            bubble.popProgress = 0;
          }

          // Also pop if went above screen
          if (bubble.y + bubble.radius < 0) {
            bubble.state = 'inactive';
          }
        } else if (bubble.state === 'popping') {
          // Continue rising while popping but slower
          bubble.y -= bubble.velocityY * dt * 0.5;
          bubble.popProgress += dt * 3; // ~333ms pop duration

          if (bubble.popProgress >= 1) {
            bubble.state = 'inactive';
          }
        }
      }

      return activeBubbleCount;
    };

    const step = (timestamp: number) => {
      lastTimeReference.current ??= timestamp;
      let dt = (timestamp - lastTimeReference.current) / 1000;
      lastTimeReference.current = timestamp;
      dt = Math.min(dt, 0.033);

      // Logical dimensions for spawning
      // canvas.width is scaled by DPR, so using clientWidth is better for logic
      const width = Number.parseFloat(canvas.style.width);
      const height = Number.parseFloat(canvas.style.height);
      const time = timestamp / 1000;

      startTimeReference.current ??= timestamp;
      const elapsedSeconds = (timestamp - startTimeReference.current) / 1000;

      // --- Spawning Logic ---
      let shouldSpawn = false;
      let currentSpawnRate = spawnRate;

      if (state === 'active') {
        currentSpawnRate = calculateSpawnRate(elapsedSeconds);
        // Determine if we should spawn based on rate
        // (If mode is contained and time > duration, calculateSpawnRate returns spawnRate, but logic below handles 'shouldSpawn')
        // Re-evaluating original logic:
        shouldSpawn = mode === 'contained' ? elapsedSeconds < duration : true;
      }

      if (shouldSpawn && state !== 'finishing') {
        spawnAccumulatorReference.current += dt * currentSpawnRate;
        while (spawnAccumulatorReference.current >= 1) {
          spawnBubble(width, height);
          spawnAccumulatorReference.current -= 1;
        }
      }

      // --- Update Logic ---
      const activeBubbleCount = updateBubbles(dt);

      // --- Draw Logic ---
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const bubble of bubblesReference.current) {
        if (bubble.state !== 'inactive') {
          drawBubble(bubble, time);
        }
      }

      // Check completion
      if (
        state === 'finishing' &&
        activeBubbleCount === 0 &&
        onAnimationComplete
      ) {
        onAnimationComplete();
        // Stop loop? No, component might re-render, keep loop but minimal overhead
      }

      rafReference.current = requestAnimationFrame(step);
    };

    rafReference.current = requestAnimationFrame(step);

    return () => {
      if (rafReference.current !== undefined) {
        cancelAnimationFrame(rafReference.current);
      }

      rafReference.current = undefined;
      lastTimeReference.current = undefined;
      startTimeReference.current = undefined;
    };
  }, [
    colors,
    minSize,
    maxSize,
    speed,
    swirlAmount,
    starRatio,
    opacity,
    spawnRate,
    duration,
    mode,
    state,
    estimatedWaitTime,
    onAnimationComplete,
  ]);

  const canvasElement = (
    <div
      ref={containerReference}
      className={className}
      style={{
        position: mode === 'full-screen' ? 'fixed' : 'relative',
        top: mode === 'full-screen' ? 0 : undefined,
        left: mode === 'full-screen' ? 0 : undefined,
        width: mode === 'full-screen' ? '100vw' : '100%',
        height: mode === 'full-screen' ? '100vh' : '100%',
        zIndex: mode === 'full-screen' ? 9999 : undefined,
        pointerEvents: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <canvas
        ref={canvasReference}
        style={{display: 'block', width: '100%', height: '100%'}}
      />
    </div>
  );

  if (mode === 'full-screen') {
    return createPortal(canvasElement, document.body);
  }

  return canvasElement;
}
