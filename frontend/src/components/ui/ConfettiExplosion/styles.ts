import React from 'react';
import {
  coinFlip,
  mapRange,
  rotate,
  rotationTransforms,
  shouldBeCircle,
} from './utils.js';

const rotationSpeedMin = 200;
const rotationSpeedMax = 800;
const crazyParticlesFrequency = 0.1;
const crazyParticlesCraziness = 0.25;
const bezierMedian = 0.5;

export type StyleClasses = {
  container: string;
  screen: string;
  particle: string;
};

export type Particle = {
  color: string;
  degree: number;
};

type ParticlesProperties = {
  particles: Particle[];
  duration: number;
  particleSize: number;
  force: number;
  height: number | string;
  width: number;
};

const round = (value: number, precision = 0) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const generateInstanceId = (() => {
  let count = 0;
  return () => `${count++}`;
})();

const generateStyles = (
  instanceId: string,
  {
    particles,
    duration,
    height,
    width,
    force,
    particleSize,
  }: ParticlesProperties,
) => {
  const rotationKeyframesRules = rotationTransforms
    .map((xyz, i) => {
      return `
      @keyframes rotation-${instanceId}-${i} {
        50% {
          transform: rotate3d(${xyz.map((v) => v / 2).join(',')}, 180deg);
        }
        100% {
          transform: rotate3d(${xyz.join(',')}, 360deg);
        }
      }
    `;
    })
    .join('\n');

  const y = typeof height === 'string' ? height : `${height}px`;
  const yAxisKeyframe = `
    @keyframes y-axis-${instanceId} {
      to {
        transform: translateY(${y});
      }
    }
  `;

  const xAxisKeyframes = particles
    .map((particle, i) => {
      const landingPoint = mapRange(
        Math.abs(rotate(particle.degree, 90) - 180),
        0,
        180,
        -width / 2,
        width / 2,
      );

      return `
      @keyframes x-axis-${instanceId}-${i} {
        to {
          transform: translateX(${landingPoint}px);
        }
      }
    `;
    })
    .join('\n');

  const particleStyles = particles
    .map((particle, i) => {
      const rotation = Math.round(
        Math.random() * (rotationSpeedMax - rotationSpeedMin) +
          rotationSpeedMin,
      );
      const rotationIndex = Math.round(
        Math.random() * (rotationTransforms.length - 1),
      );
      const durationChaos = duration - Math.round(Math.random() * 1000);
      const shouldBeCrazy = Math.random() < crazyParticlesFrequency;
      const isCircle = shouldBeCircle(rotationIndex);

      const x1 = shouldBeCrazy
        ? round(Math.random() * crazyParticlesCraziness, 2)
        : 0;
      const x2 = x1 * -1;
      const x3 = x1;
      const x4 = round(
        Math.abs(
          mapRange(Math.abs(rotate(particle.degree, 90) - 180), 0, 180, -1, 1),
        ),
        4,
      );

      const y1 = round(Math.random() * bezierMedian, 4);
      const y2 = round(Math.random() * force * (coinFlip() ? 1 : -1), 4);
      const y3 = bezierMedian;
      const y4 = round(
        Math.max(
          mapRange(Math.abs(particle.degree - 180), 0, 180, force, -force),
          0,
        ),
        4,
      );

      return `
      .confetti-explosion-particle-${instanceId}-${i} {
        animation: x-axis-${instanceId}-${i} ${durationChaos}ms forwards cubic-bezier(${x1}, ${x2}, ${x3}, ${x4});
      }
      
      .confetti-explosion-particle-${instanceId}-${i} > div {
        width: ${isCircle ? particleSize : Math.round(Math.random() * 4) + particleSize / 2}px;
        height: ${isCircle ? particleSize : Math.round(Math.random() * 2) + particleSize}px;
        animation: y-axis-${instanceId} ${durationChaos}ms forwards cubic-bezier(${y1}, ${y2}, ${y3}, ${y4});
      }
      
      .confetti-explosion-particle-${instanceId}-${i} > div:after {
        background-color: ${particle.color};
        animation: rotation-${instanceId}-${rotationIndex} ${rotation}ms infinite linear;
        ${isCircle ? 'border-radius: 50%;' : ''}
      }
    `;
    })
    .join('\n');

  const baseStyles = `
    .confetti-explosion-container-${instanceId} {
      width: 0;
      height: 0;
      position: relative;
    }
    
    .confetti-explosion-screen-${instanceId} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    .confetti-explosion-particle-${instanceId} > div {
      position: absolute;
      left: 0;
      top: 0;
    }
    
    .confetti-explosion-particle-${instanceId} > div:after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  return `
    ${rotationKeyframesRules}
    ${yAxisKeyframe}
    ${xAxisKeyframes}
    ${baseStyles}
    ${particleStyles}
  `;
};

const appendStyles = (styles: string, id: string) => {
  const styleElement = document.createElement('style');
  styleElement.id = id;
  styleElement.textContent = styles;
  document.head.append(styleElement);
  return styleElement;
};

const useConfettiStyles = (properties: ParticlesProperties) => {
  const instanceIdReference = React.useRef(generateInstanceId());
  const instanceId = instanceIdReference.current;

  React.useEffect(() => {
    const styleId = `confetti-style-${instanceId}`;
    appendStyles(generateStyles(instanceId, properties), styleId);

    return () => {
      const elementToRemove = document.querySelector(`#${styleId}`);
      if (elementToRemove) {
        elementToRemove.remove();
      }
    };
  }, [properties, instanceId]);

  return {
    container: `confetti-explosion-container-${instanceId}`,
    screen: `confetti-explosion-screen-${instanceId}`,
    particle: (index: number) =>
      `confetti-explosion-particle-${instanceId} confetti-explosion-particle-${instanceId}-${index}`,
  };
};

export default useConfettiStyles;
