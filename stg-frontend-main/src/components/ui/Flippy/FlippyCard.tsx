import React, {type ReactNode, type CSSProperties} from 'react';

type FlippyCardProps = {
  readonly className?: string;
  readonly cardType: string;
  readonly style?: CSSProperties;
  readonly elementType?: keyof JSX.IntrinsicElements;
  readonly animationDuration?: number;
  readonly children?: ReactNode;
};

function FlippyCard(props: FlippyCardProps) {
  const {className, cardType, style, elementType, animationDuration} = props;
  return React.createElement(
    elementType ?? 'div',
    {
      className: `flippy-card flippy-${cardType} ${className ?? ''}`,
      style: {
        ...style,
        transitionDuration: `${animationDuration ?? 600 / 1000}s`,
      },
    },
    props.children ?? null,
  );
}

type FrontSideProps = {
  readonly style?: CSSProperties;
  readonly animationDuration?: number;
  readonly children?: ReactNode;
  readonly className?: string;
};

export function FrontSide({
  style,
  animationDuration,
  ...props
}: FrontSideProps) {
  return (
    <FlippyCard
      {...props}
      style={{
        ...style,
      }}
      animationDuration={animationDuration}
      cardType="front"
    />
  );
}

type BackSideProps = {
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
  readonly className?: string;
};

export function BackSide({style, ...props}: BackSideProps) {
  return (
    <FlippyCard
      {...props}
      style={{
        ...style,
      }}
      cardType="back"
    />
  );
}

export {FlippyCard};
