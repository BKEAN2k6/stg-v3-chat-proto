import React, {memo, Children} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import MarkdownA from './MarkdownA.js';
import MarkdownLink from './MarkdownLink.js';
import './MarkdownView.scss';
import {remarkCustomLinks} from './remarkCustomLinks.js';
import LottiePlayer from './LottiePlayer/LottiePlayer.js';
import ManifestVideoPlayer from './ManifestVideoPlayer.js';
import EmbeddedQuiz from '@/pages/games/quiz/host/EmbeddedQuiz.js';
import VimeoPlayer from '@/components/ui/VimeoPlayer.js';
import constants from '@/constants.js';
import {track} from '@/helpers/analytics.js';

type Properties = {
  readonly content: string;
  readonly onEnded?: () => void;
  readonly isVideoFullScreenEnabled?: boolean;
  readonly isAnimationClickable?: boolean;
};

type CustomLiProperties = {
  processedEmoji?: boolean;
  'data-emoji'?: string;
} & React.LiHTMLAttributes<HTMLLIElement>;

function MarkdownViewComponent({
  content,
  onEnded,
  isVideoFullScreenEnabled = true,
  isAnimationClickable = true,
}: Properties) {
  return (
    <div className="markdown-view">
      <Markdown
        remarkPlugins={[
          remarkCustomLinks([
            'animation',
            'quiz-window',
            'quiz-button',
            'video',
          ]),
          remarkGfm,
          remarkBreaks,
        ]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: 'h2',
          h2: 'h3',
          h3: 'h4',
          h4: 'h5',
          h5: 'h6',
          a(
            properties: React.DetailedHTMLProps<
              React.AnchorHTMLAttributes<HTMLAnchorElement>,
              HTMLAnchorElement
            >,
          ) {
            const {children} = properties;
            if (
              typeof children === 'string' &&
              children.startsWith('animation://')
            ) {
              const animationUrl = children.replace('animation://', '');

              return (
                <LottiePlayer
                  loop
                  url={`${constants.FILE_HOST}animation-${animationUrl}.json`}
                  isFullScreenAllowed={isVideoFullScreenEnabled}
                  isAnimationClickable={isAnimationClickable}
                  onEnded={onEnded}
                />
              );
            }

            if (
              typeof children === 'string' &&
              children.startsWith('video://')
            ) {
              const animationUrl = children.replace('video://', '');

              return (
                <ManifestVideoPlayer
                  url={`${constants.FILE_HOST}${animationUrl}`}
                  isFullScreenAllowed={isVideoFullScreenEnabled}
                  isClickable={isAnimationClickable}
                  onEnded={onEnded}
                />
              );
            }

            if (
              typeof children === 'string' &&
              children.startsWith('quiz-window://')
            ) {
              const quizId = children.replace('quiz-window://', '');

              return (
                <EmbeddedQuiz opensInNewWindow={false} questionSetId={quizId} />
              );
            }

            if (
              typeof children === 'string' &&
              children.startsWith('quiz-button://')
            ) {
              const quizId = children.replace('quiz-button://', '');

              return <EmbeddedQuiz opensInNewWindow questionSetId={quizId} />;
            }

            if (properties.href?.startsWith('https://vimeo.com/')) {
              return (
                <VimeoPlayer
                  isOnlyVideoPlaying
                  vimeoProps={{
                    controls: true,
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    },
                    config: {
                      vimeo: {
                        fullscreen: isVideoFullScreenEnabled,
                      },
                    },
                    src: properties.href,
                    width: '100%',
                    height: '100%',
                    onPlay() {
                      track('Play video', {
                        vimeoId: properties.href?.split('/').pop(),
                      });
                    },
                    onEnded,
                  }}
                />
              );
            }

            if (
              properties.href?.endsWith('.pdf') &&
              !properties.href?.startsWith('http')
            ) {
              return (
                <MarkdownA
                  href={`${constants.FILE_HOST}${properties.href}`}
                  target="_blank"
                >
                  {properties.children}
                </MarkdownA>
              );
            }

            if (properties.href?.startsWith('http')) {
              return (
                <MarkdownA href={properties.href} target="_blank">
                  {properties.children}
                </MarkdownA>
              );
            }

            if (properties.href?.startsWith('/')) {
              return (
                <MarkdownLink to={properties.href}>
                  {properties.children}
                </MarkdownLink>
              );
            }

            return (
              <MarkdownA href={properties.href}>
                {properties.children}
              </MarkdownA>
            );
          },
          p(properties) {
            return <div className="markdown-p">{properties.children}</div>;
          },
          img(properties) {
            if (properties.src?.startsWith('http')) {
              return (
                <img
                  {...properties}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              );
            }

            return (
              <img
                {...properties}
                src={`${constants.FILE_HOST}${properties.src}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            );
          },
          ul(properties) {
            const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji})\s*/u;
            let hasEmoji = false;

            const processedChildren = Children.map(
              properties.children,
              (child): React.ReactNode => {
                if (React.isValidElement(child)) {
                  const childProperties = child.props as {
                    node?: {
                      tagName?: string;
                    };
                    children?: React.ReactNode;
                  };

                  if (childProperties.node?.tagName === 'li') {
                    const liChildren = Children.toArray(
                      childProperties.children,
                    );

                    if (
                      liChildren.length > 0 &&
                      typeof liChildren[0] === 'string'
                    ) {
                      const match = emojiRegex.exec(liChildren[0]);
                      if (match) {
                        hasEmoji = true;
                        liChildren[0] = liChildren[0].replace(emojiRegex, '');
                        return React.cloneElement(
                          child as React.ReactElement<CustomLiProperties>,
                          {'data-emoji': match[1], processedEmoji: true},
                          liChildren,
                        );
                      }
                    }
                  }
                }

                return child;
              },
            );

            return (
              <ul className={hasEmoji ? 'emoji-list' : undefined}>
                {processedChildren}
              </ul>
            );
          },
          li(properties: CustomLiProperties) {
            if (properties.processedEmoji) {
              const {processedEmoji, ...rest} = properties;
              return <li {...rest} />;
            }

            return <li>{properties.children}</li>;
          },
          blockquote(properties) {
            return (
              <blockquote className="blockquote">
                {properties.children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

export const MarkdownView = memo(MarkdownViewComponent);
