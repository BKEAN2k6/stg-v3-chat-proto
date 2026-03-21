import React, {type ReactNode, type CSSProperties} from 'react';

type FlippyCardProperties = {
  readonly className?: string;
  readonly cardType: string;
  readonly style?: CSSProperties;
  readonly elementType?: keyof React.JSX.IntrinsicElements;
  readonly animationDuration?: number;
  readonly children?: ReactNode;
};

function FlippyCard(properties: FlippyCardProperties) {
  const {className, cardType, style, elementType, animationDuration} =
    properties;
  return React.createElement(
    elementType ?? 'div',
    {
      className: `flippy-card flippy-${cardType} ${className ?? ''}`,
      style: {
        ...style,
        transitionDuration: `${animationDuration ?? 600 / 1000}s`,
      },
    },
    properties.children ?? null,
  );
}

type FrontSideProperties = {
  readonly style?: CSSProperties;
  readonly animationDuration?: number;
  readonly children?: ReactNode;
  readonly className?: string;
};

export function FrontSide({
  style,
  animationDuration,
  ...properties
}: FrontSideProperties) {
  return (
    <FlippyCard
      {...properties}
      style={{
        ...style,
      }}
      animationDuration={animationDuration}
      cardType="front"
    />
  );
}

type BackSideProperties = {
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
  readonly className?: string;
};

export function BackSide({style, ...properties}: BackSideProperties) {
  return (
    <FlippyCard
      {...properties}
      style={{
        ...style,
      }}
      cardType="back"
    />
  );
}

export {FlippyCard};
