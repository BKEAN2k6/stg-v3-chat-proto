'use client';

import React, {forwardRef} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import type p5Types from 'p5';

type Heart = {
  x: number;
  y: number;
  size: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  alpha: number;
  fadeSpeed: number;
};

const hearts: Heart[] = [];

const sketch = (p: p5Types) => {
  p.setup = () => {
    const canvasWidth = p.windowWidth * 2;
    const canvasHeight = p.windowHeight * 2;
    p.createCanvas(canvasWidth, canvasHeight);

    // Determine the number of hearts based on window size.
    const area = canvasWidth * canvasHeight;
    const density = 0.00008;
    const calculatedHeartCount = Math.floor(area * density);

    for (let i = 0; i < calculatedHeartCount; i++) {
      hearts.push({
        x: p.random(canvasWidth),
        y: p.random(canvasHeight),
        size: p.random(10, 40),
        noiseOffsetX: p.random(0, 1000),
        noiseOffsetY: p.random(0, 1000),
        alpha: 255,
        fadeSpeed: p.random(2, 5),
      });
    }
  };

  p.draw = () => {
    p.background('#f5f3ff');

    const canvasWidth = p.windowWidth * 2;
    const canvasHeight = p.windowHeight * 2;
    const boundingMargin = 20;

    for (const heart of hearts) {
      heart.x +=
        p.map(p.noise(heart.noiseOffsetX, p.millis() * 0.0001), 0, 1, -1, 1) *
        2;
      heart.y +=
        p.map(p.noise(heart.noiseOffsetY, p.millis() * 0.0001), 0, 1, -1, 1) *
        2;

      if (
        heart.x < boundingMargin ||
        heart.x > canvasWidth - boundingMargin ||
        heart.y < boundingMargin ||
        heart.y > canvasHeight - boundingMargin
      ) {
        heart.alpha -= heart.fadeSpeed;
        if (heart.alpha < 0) {
          heart.alpha = 0;
          heart.x = p.random(boundingMargin, canvasWidth - boundingMargin);
          heart.y = p.random(boundingMargin, canvasHeight - boundingMargin);
          heart.noiseOffsetX = p.random(0, 1000);
          heart.noiseOffsetY = p.random(0, 1000);
        }
      } else {
        heart.alpha += heart.fadeSpeed;
        if (heart.alpha > 255) {
          heart.alpha = 255;
        }
      }

      drawHeart(heart.x, heart.y, heart.size, heart.alpha);
      heart.noiseOffsetX += 0.002;
      heart.noiseOffsetY += 0.002;
    }
  };

  const drawHeart = (x: number, y: number, size: number, alpha: number) => {
    p.noStroke();
    p.fill(193, 178, 230, alpha);
    p.beginShape();
    p.vertex(x, y);
    p.bezierVertex(
      x - size / 2,
      y - size / 2,
      x - size,
      y + size / 3,
      x,
      y + size,
    );
    p.bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    p.endShape(p.CLOSE);
  };
};

export type FloatingHeartsBackgroundInstance = {
  getP5Instance: () => p5Types;
};

export const FloatingHeartsBackground =
  forwardRef<FloatingHeartsBackgroundInstance>(() => (
    <NextReactP5Wrapper sketch={sketch} />
  ));

FloatingHeartsBackground.displayName = 'FloatingHeartsBackground';

export default FloatingHeartsBackground;
