import {memo} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import {Link} from 'react-router-dom';
import {useTracking} from 'react-tracking';
import VideoPlayer from '@/components/ui/VideoPlayer';
import constants from '@/constants';

type Props = {
  readonly content: string;
  readonly isVideoFullScreenDisabled?: boolean;
  readonly onEnded?: () => void;
};

function MarkdownViewComponent({
  content,
  isVideoFullScreenDisabled,
  onEnded,
}: Props) {
  const {trackEvent} = useTracking();

  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeSlug]}
      components={{
        h1: 'h2',
        h2: 'h3',
        h3: 'h4',
        h4: 'h5',
        h5: 'h6',
        a(
          props: React.DetailedHTMLProps<
            React.AnchorHTMLAttributes<HTMLAnchorElement>,
            HTMLAnchorElement
          >,
        ) {
          if (props.href?.startsWith('https://vimeo.com/')) {
            return (
              <div
                style={{
                  position: 'relative',
                  paddingTop: '56.25%',
                }}
              >
                <VideoPlayer
                  isOnlyVideoPlaying
                  vimeoProps={{
                    controls: true,
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    },
                    url: props.href,
                    width: '100%',
                    height: '100%',
                    config: {
                      playerOptions: {
                        fullscreen: !isVideoFullScreenDisabled,
                        keyboard: !isVideoFullScreenDisabled,
                      },
                    },
                    onPlay() {
                      trackEvent({
                        action: 'click',
                        element: `video-play-${props.href?.split('/').pop()}`,
                      });
                    },
                    onEnded,
                  }}
                />
              </div>
            );
          }

          if (props.href?.endsWith('.pdf') && !props.href?.startsWith('http')) {
            return (
              <a
                href={`${constants.FILE_HOST}${props.href}`}
                target="_blank"
                rel="noreferrer"
              >
                {props.children}
              </a>
            );
          }

          if (props.href?.startsWith('http')) {
            return (
              <a href={props.href} target="_blank" rel="noreferrer">
                {props.children}
              </a>
            );
          }

          if (props.href?.startsWith('/')) {
            return <Link to={props.href}>{props.children}</Link>;
          }

          return <a href={props.href}>{props.children}</a>;
        },
        p(props) {
          return <div className="markdown-p">{props.children}</div>;
        },
        img(props) {
          if (props.src?.startsWith('http')) {
            return (
              <img
                {...props}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            );
          }

          return (
            <img
              {...props}
              src={`${constants.FILE_HOST}${props.src}`}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          );
        },
        blockquote(props) {
          return (
            <blockquote className="blockquote">{props.children}</blockquote>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}

export const MarkdownView = memo(MarkdownViewComponent);
