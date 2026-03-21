'use client';

import React, {useEffect, useRef, useState} from 'react';
import {styled, keyframes} from 'styled-components';
import {randomBetween} from '@/lib/utils';

type EmojiStyle = {
  id: string;
  bottom: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  translateXStart: number;
  translateXMid: number;
  translateXEnd: number;
  translateYUp: number;
};

const flyUpAndFade = (props: EmojiStyle) => keyframes`
  0% {
    transform: translateX(${props.translateXStart}px) translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateX(${props.translateXMid}px) translateY(${
      props.translateYUp / 2
    }px) scale(1);
    opacity: 0.75;
  }
  100% {
    transform: translateX(${props.translateXEnd}px) translateY(${
      props.translateYUp
    }px) scale(0);
    opacity: 0;
  }
`;

const EmojisContainer = styled.div`
  pointer-events: none;
  position: relative;
  height: 100%;
`;

const FlyingEmoji = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      'bottom',
      'left',
      'duration',
      'delay',
      'size',
      'translateXStart',
      'translateXMid',
      'translateXEnd',
      'translateYUp',
    ].includes(prop),
})<EmojiStyle>`
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  left: ${(props) => props.left}%;
  opacity: 0;
  animation: ${(props) => flyUpAndFade(props)} ${(props) => props.duration}s
    linear forwards;
  animation-delay: ${(props) => props.delay}s;
  pointer-events: none;
  font-size: ${(props) => props.size}px;
`;

type Props = {
  readonly burstSize?: number;
  readonly maxDelay?: number;
};

export const FlyingEmojisEffect: React.FC<Props> = ({
  burstSize = 30,
  maxDelay = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useRef<number>(500);
  const [activeEmojis, setActiveEmojis] = useState<EmojiStyle[]>([]);
  const emojis = [
    '🎉',
    '😄',
    '🥳',
    '🚀',
    '🎊',
    '🏆',
    '🥇',
    '🌟',
    '✨',
    '💫',
    '🎈',
    '💥',
    '👏',
    '😎',
    '💖',
    '👍',
    '🤩',
    '🔥',
    '🎖️',
    '🏅',
    '⭐',
    '🍀',
    '😁',
    '🤝',
    '💪',
    '🙌',
    '💯',
    '🎁',
    '✅',
    '💛',
    '💚',
    '💙',
    '💜',
    '🤍',
    '💝',
  ];
  const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  const generateEmojiStyle = (): EmojiStyle => {
    const id = Math.random().toString(36).slice(2, 11);
    const size = Math.random() * 24 + 16;
    const translateXStart = (Math.random() - 0.5) * 50;
    const translateXMid = (Math.random() - 0.5) * 50;
    const translateXEnd = (Math.random() - 0.5) * 50;
    const translateYUp = -containerHeight.current;

    return {
      id,
      bottom: -size,
      left: Math.random() * 100,
      size,
      duration: randomBetween(14, 18) / 10,
      delay: Math.random() * 0.8,
      emoji: chosenEmoji,
      translateXStart,
      translateXMid,
      translateXEnd,
      translateYUp,
    };
  };

  useEffect(() => {
    function updateContainerHeight() {
      if (containerRef.current) {
        containerHeight.current = containerRef.current.clientHeight;
      }
    }

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);

    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);

  useEffect(() => {
    const timeouts: any[] = [];

    for (let i = 0; i < burstSize; i++) {
      const delay = Math.random() * maxDelay;

      const timeoutId = setTimeout(() => {
        setActiveEmojis((currentEmojis) => {
          const newEmoji = generateEmojiStyle();
          return [...currentEmojis, newEmoji];
        });
      }, delay);

      timeouts.push(timeoutId);
    }

    return () => {
      for (const timeout of timeouts) clearTimeout(timeout);
    };
  }, [burstSize, maxDelay]);

  return (
    <EmojisContainer ref={containerRef}>
      {activeEmojis.map((style) => (
        <FlyingEmoji key={style.id} {...style}>
          {style.emoji}
        </FlyingEmoji>
      ))}
    </EmojisContainer>
  );
};
