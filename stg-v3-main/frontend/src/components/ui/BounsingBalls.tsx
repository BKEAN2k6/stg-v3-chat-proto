/* eslint-disable max-depth */
/* eslint-disable complexity */
// components/Balls.tsx
import {useEffect, useRef} from 'react';
import lottie, {type AnimationItem} from 'lottie-web';

const minRatioBase = 0.028; // base ratios; multiplied by ballScale
const maxRatioBase = 0.075;

const radiusFor = (pct: number, w: number, h: number, ballScale: number) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const s = Math.max(1, Math.min(w, h)); // shortest side, >=1
  const minR = s * minRatioBase * ballScale;
  const maxR = s * maxRatioBase * ballScale;
  return minR + (clamped / 100) * (maxR - minR);
};

export type BallData = {
  id: string;
  label: string;
  image?: string; // optional image URL (used if no lottiePath)
  ballColor: string; // required, any valid CSS color
  borderColor?: string; // optional CSS color; if absent, no border is drawn
  percentage: number; // 0..100
  lottiePath?: string; // optional per-ball lottie JSON path
};

type Ball = {
  id: string;
  label: string;
  image?: string;
  ballColor: string;
  borderColor?: string;
  percentage: number; // 0..100
  r: number; // radius in px
  x: number; // center
  y: number; // center
  vx: number; // px/s
  vy: number; // px/s
  lottiePath?: string;
  // Lottie bookkeeping (Option 2: Lottie-managed internal canvas)
  lottie?:
    | {
        holder: HTMLDivElement; // offscreen container kept in DOM
        canvas: HTMLCanvasElement; // Lottie-created canvas
        anim: AnimationItem;
        path: string;
        dpr: number;
      }
    | 'loading'
    | 'error';
};

export default function BounsingBalls({
  data,
  ballScale = 2,
  textScale = 1,
  className,
  style,
}: {
  readonly data: readonly BallData[];
  readonly ballScale?: number;
  readonly textScale?: number;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}) {
  const containerReference = useRef<HTMLDivElement>(null);
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const rafReference = useRef<number | undefined>(undefined);
  const ballsReference = useRef<Ball[]>([]);
  const lastTsReference = useRef<number | undefined>(undefined);

  const imagesReference = useRef<
    Record<string, {el: HTMLImageElement; url: string} | 'loading' | 'error'>
  >({});
  // Preload images for current items (fallbacks). Reload if URL changed for the same id.
  useEffect(() => {
    for (const {id, image} of data) {
      if (!image) continue;
      const current = imagesReference.current[id];
      if (
        current === 'loading' ||
        (typeof current === 'object' && current.url === image)
      ) {
        continue;
      }

      imagesReference.current[id] = 'loading';
      const img = new Image();
      img.src = image;
      img.addEventListener('load', () => {
        imagesReference.current[id] = {el: img, url: image};
      });
      img.addEventListener('error', () => {
        imagesReference.current[id] = 'error';
      });
    }
  }, [data]);

  // Size the main canvas and react to container resizes
  useEffect(() => {
    const container = containerReference.current;
    const canvas = canvasReference.current;
    if (!container || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      const cssWidth = Math.max(1, Math.floor(container.clientWidth));
      const cssHeight = Math.max(1, Math.floor(container.clientHeight));

      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const neededWidth = Math.floor(cssWidth * dpr);
      const neededHeight = Math.floor(cssHeight * dpr);

      if (canvas.width !== neededWidth || canvas.height !== neededHeight) {
        canvas.width = neededWidth;
        canvas.height = neededHeight;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      // 🔁 Rescale radii and keep centers in bounds; ensure per-ball lottie canvas resizes
      const balls = ballsReference.current;
      if (balls && balls.length > 0) {
        for (const b of balls) {
          const previousR = b.r;
          b.r = radiusFor(b.percentage, cssWidth, cssHeight, ballScale);
          b.x = Math.min(cssWidth - b.r, Math.max(b.r, b.x));
          b.y = Math.min(cssHeight - b.r, Math.max(b.r, b.y));
          if (
            b.lottie &&
            b.lottie !== 'loading' &&
            b.lottie !== 'error' &&
            b.r !== previousR
          ) {
            resizeLottieCanvasToBall(b);
          }
        }
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
    });

    try {
      ro.observe(container, {box: 'content-box'});
    } catch {
      ro.observe(container);
    }

    resize();
    return () => {
      ro.disconnect();
    };
  }, [ballScale]);

  // Initialize / rebuild balls when data or ballScale changes
  useEffect(() => {
    function initBallLottie(ball: Ball, path: string) {
      try {
        ball.lottie = 'loading';
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const diameterCss = Math.max(2, ball.r * 2);

        // Create an offscreen holder DIV that actually lives in the DOM (non-zero size)
        const holder = document.createElement('div');
        holder.style.position = 'fixed';
        holder.style.left = '-10000px';
        holder.style.top = '-10000px';
        holder.style.width = `${diameterCss}px`;
        holder.style.height = `${diameterCss}px`;
        document.body.append(holder);

        const animation = lottie.loadAnimation({
          container: holder,
          renderer: 'canvas',
          loop: true,
          autoplay: true,
          path, // JSON file path
        });

        // When the internal canvas is ready, grab and size it
        const onReady = () => {
          const internalCanvas = holder.querySelector('canvas');
          if (!internalCanvas) {
            ball.lottie = 'error';
            return;
          }

          // Set physical pixel dimensions (crisp on DPR displays)
          internalCanvas.width = Math.floor(diameterCss * dpr);
          internalCanvas.height = Math.floor(diameterCss * dpr);
          // CSS size in CSS pixels (helps Lottie layout math)
          internalCanvas.style.width = `${diameterCss}px`;
          internalCanvas.style.height = `${diameterCss}px`;

          // Tell Lottie to recompute its transforms
          animation.resize();

          // Store refs
          ball.lottie = {
            holder,
            canvas: internalCanvas,
            anim: animation,
            path,
            dpr,
          };

          // React to DPR changes (re-size the internal canvas)
          const mq = globalThis.matchMedia(`(resolution: ${dpr}dppx)`);
          const onDprChange = () => {
            resizeLottieCanvasToBall(ball, true);
          };

          try {
            mq.addEventListener?.('change', onDprChange);
          } catch {}

          // Clean up holder + listener when animation is destroyed
          const previousDestroy = animation.destroy.bind(animation);
          animation.destroy = () => {
            try {
              mq.removeEventListener?.('change', onDprChange);
            } catch {}

            holder.remove();
            previousDestroy();
          };
        };

        // DOMLoaded fires when assets/canvas are attached
        animation.addEventListener('DOMLoaded', onReady);

        // Safety: also listen to data_ready (some builds fire this earlier)
        animation.addEventListener('data_ready', () => {
          if (ball.lottie === 'loading') onReady();
        });
      } catch {
        ball.lottie = 'error';
      }
    }

    const container = containerReference.current;
    if (!container) return;

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    const existing = ballsReference.current;
    const byId = new Map(existing.map((b) => [b.id, b]));

    const randomPos = (r: number) => ({
      x: r + Math.random() * (width - 2 * r),
      y: r + Math.random() * (height - 2 * r),
    });

    const isNonOverlapping = (
      testX: number,
      testY: number,
      testR: number,
      list: Ball[],
    ) =>
      list.every(
        (b) => Math.hypot(b.x - testX, b.y - testY) >= b.r + testR + 4,
      );

    const baseSpeed = Math.max(
      60,
      Math.min(180, Math.hypot(width, height) * 0.15),
    ); // px/s

    const next: Ball[] = [];

    for (const row of data) {
      const r = radiusFor(row.percentage, width, height, ballScale);
      const existingBall = byId.get(row.id);

      if (existingBall) {
        // update properties
        const previousLottiePath = existingBall.lottiePath;
        existingBall.percentage = row.percentage;
        existingBall.r = r;
        existingBall.label = row.label;
        existingBall.ballColor = row.ballColor;
        existingBall.borderColor = row.borderColor;
        existingBall.image = row.image;
        existingBall.lottiePath = row.lottiePath;

        // keep center inside bounds
        existingBall.x = Math.min(width - r, Math.max(r, existingBall.x));
        existingBall.y = Math.min(height - r, Math.max(r, existingBall.y));

        // handle lottie creation/destruction/resize
        if (row.lottiePath) {
          if (previousLottiePath === row.lottiePath) {
            // same lottie, ensure canvas size is correct
            if (
              existingBall.lottie &&
              existingBall.lottie !== 'loading' &&
              existingBall.lottie !== 'error'
            ) {
              resizeLottieCanvasToBall(existingBall);
            } else if (!existingBall.lottie) {
              initBallLottie(existingBall, row.lottiePath);
            }
          } else {
            // destroy old if present
            if (
              existingBall.lottie &&
              existingBall.lottie !== 'loading' &&
              existingBall.lottie !== 'error'
            ) {
              existingBall.lottie.anim.destroy();
              existingBall.lottie.holder.remove();
              existingBall.lottie = undefined;
            }

            // init new
            initBallLottie(existingBall, row.lottiePath);
          }
        } else {
          // no lottie desired → destroy any existing
          if (
            existingBall.lottie &&
            existingBall.lottie !== 'loading' &&
            existingBall.lottie !== 'error'
          ) {
            existingBall.lottie.anim.destroy();
            existingBall.lottie.holder.remove();
          }

          existingBall.lottie = undefined;
        }

        next.push(existingBall);
        byId.delete(row.id);
      } else {
        // ➕ New ball → create with a non-overlapping start
        let placed = false;
        let tries = 0;
        let x = 0;
        let y = 0;
        while (!placed && tries < 400) {
          const p = randomPos(r);
          x = p.x;
          y = p.y;
          placed = isNonOverlapping(x, y, r, next);
          tries++;
        }

        if (!placed) {
          const p = randomPos(r);
          x = p.x;
          y = p.y;
        }

        // independent velocity magnitude
        const speed = baseSpeed * (0.6 + 0.4 * Math.random());
        const angle = Math.random() * Math.PI * 2;

        const ball: Ball = {
          id: row.id,
          percentage: row.percentage,
          r,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          label: row.label,
          ballColor: row.ballColor,
          borderColor: row.borderColor,
          image: row.image,
          lottiePath: row.lottiePath,
          lottie: undefined,
        };

        // ⚙️ create the Lottie instance for this ball if provided
        if (row.lottiePath) {
          initBallLottie(ball, row.lottiePath);
        }

        next.push(ball);
      }
    }

    // 🗑️ items missing from `data` are dropped — destroy their lottie instances
    for (const orphan of byId.values()) {
      if (
        orphan.lottie &&
        orphan.lottie !== 'loading' &&
        orphan.lottie !== 'error'
      ) {
        orphan.lottie.anim.destroy();
        orphan.lottie.holder.remove();
      }
    }

    ballsReference.current = next;
  }, [data, ballScale]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasReference.current;
    const container = containerReference.current;
    if (!canvas || !container) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const getBounds = () => ({
      w: Math.max(1, container.clientWidth),
      h: Math.max(1, container.clientHeight),
    });

    const step = (ts: number) => {
      lastTsReference.current ??= ts;
      let dt = (ts - lastTsReference.current) / 1000; // seconds
      lastTsReference.current = ts;
      dt = Math.min(dt, 0.033); // clamp

      const {w, h} = getBounds();
      const balls = ballsReference.current;

      // integrate + wall collisions
      for (const b of balls) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = Math.abs(b.vx);
        }

        if (b.x + b.r > w) {
          b.x = w - b.r;
          b.vx = -Math.abs(b.vx);
        }

        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = Math.abs(b.vy);
        }

        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy = -Math.abs(b.vy);
        }
      }

      // ball-ball collisions
      for (let i = 0; i < balls.length; i++) {
        for (let index = i + 1; index < balls.length; index++) {
          const a = balls[i];
          const b = balls[index];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distribution = Math.hypot(dx, dy) || 0.0001;
          const minDistribution = a.r + b.r;

          if (distribution < minDistribution) {
            const overlap = minDistribution - distribution;
            const nx = dx / distribution;
            const ny = dy / distribution;

            const separator = overlap / 2;
            a.x -= nx * separator;
            a.y -= ny * separator;
            b.x += nx * separator;
            b.y += ny * separator;

            const tx = -ny;
            const ty = nx;
            const van = a.vx * nx + a.vy * ny;
            const vbn = b.vx * nx + b.vy * ny;
            const vat = a.vx * tx + a.vy * ty;
            const vbt = b.vx * tx + b.vy * ty;

            a.vx = vbn * nx + vat * tx;
            a.vy = vbn * ny + vat * ty;
            b.vx = van * nx + vbt * tx;
            b.vy = van * ny + vbt * ty;
          }
        }
      }

      // === draw ===
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of balls) {
        // 1) Base ball (no shadow, no clip)
        context.save();
        context.fillStyle = b.ballColor;
        context.beginPath();
        context.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        context.fill();
        context.restore();

        // 2) Ambient shadow (draw behind)
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.shadowColor = 'rgba(0,0,0,0.35)';
        context.shadowBlur = Math.max(5, b.r * 0.25);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = '#000';
        context.beginPath();
        context.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        context.fill();
        context.restore();

        // 3) Clip for content (Lottie preferred, fallback to image)
        context.save();
        context.beginPath();
        context.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        context.clip();

        const l =
          b.lottie && b.lottie !== 'loading' && b.lottie !== 'error'
            ? b.lottie
            : undefined;

        if (l) {
          // draw Lottie-managed internal canvas
          context.drawImage(l.canvas, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        } else if (b.image) {
          const imgEntry = imagesReference.current[b.id];
          if (imgEntry && imgEntry !== 'loading' && imgEntry !== 'error') {
            context.drawImage(
              imgEntry.el,
              b.x - b.r,
              b.y - b.r,
              b.r * 2,
              b.r * 2,
            );
          }
        }

        // tint overlay to blend with ball color
        context.globalCompositeOperation = 'multiply';
        context.fillStyle = b.ballColor;
        context.globalAlpha = 0.35;
        context.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);

        context.globalAlpha = 1;
        context.globalCompositeOperation = 'source-over';
        context.restore();

        // 4) Highlight
        const grad = context.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.3,
          b.r * 0.1,
          b.x,
          b.y,
          b.r,
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.25)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = grad;
        context.beginPath();
        context.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        context.fill();

        // 5) Optional border
        if (b.borderColor) {
          const borderWidth = Math.max(1, Math.min(2, b.r * 0.08));
          context.beginPath();
          context.arc(b.x, b.y, b.r - borderWidth / 2, 0, Math.PI * 2);
          context.lineWidth = borderWidth;
          context.strokeStyle = b.borderColor;
          context.stroke();
        }
      }

      /** PASS 2: labels on top */
      context.save();
      context.shadowColor = 'rgba(0,0,0,1)';
      context.shadowBlur = 4;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const minTextPxBase = 10;
      const maxTextPxBase = 60;

      for (const b of balls) {
        const raw = Math.floor(b.r * 0.5 * textScale);
        const fontPx = Math.max(
          minTextPxBase * textScale,
          Math.min(maxTextPxBase * textScale, raw),
        );
        context.font = `${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
        context.fillText(b.label, b.x, b.y);
      }

      context.restore();

      rafReference.current = requestAnimationFrame(step);
    };

    rafReference.current = requestAnimationFrame(step);
    return () => {
      if (rafReference.current !== null && rafReference.current !== undefined) {
        cancelAnimationFrame(rafReference.current);
      }

      rafReference.current = undefined;
      lastTsReference.current = undefined;
    };
  }, [textScale]); // <— text drawing depends on textScale

  // Destroy all lottie instances on unmount
  useEffect(() => {
    return () => {
      for (const b of ballsReference.current) {
        if (b.lottie && b.lottie !== 'loading' && b.lottie !== 'error') {
          b.lottie.anim.destroy();
          b.lottie.holder.remove();
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerReference}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
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

  function resizeLottieCanvasToBall(ball: Ball, forceReadDpr = false) {
    const l = ball.lottie;
    if (!l || l === 'loading' || l === 'error') return;

    const dpr = forceReadDpr
      ? Math.max(1, window.devicePixelRatio || 1)
      : l.dpr;
    const targetCss = Math.max(2, ball.r * 2);
    const targetW = Math.max(2, Math.floor(targetCss * dpr));
    const targetH = Math.max(2, Math.floor(targetCss * dpr));

    if (l.canvas.width !== targetW || l.canvas.height !== targetH) {
      l.canvas.width = targetW;
      l.canvas.height = targetH;
    }

    // Keep CSS size in sync too
    l.canvas.style.width = `${targetCss}px`;
    l.canvas.style.height = `${targetCss}px`;

    // Let Lottie recompute internal transforms
    l.anim.resize();
  }
}
