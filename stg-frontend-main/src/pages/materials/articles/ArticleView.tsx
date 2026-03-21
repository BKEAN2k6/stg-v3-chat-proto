import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import 'yet-another-react-lightbox/styles.css';
import {Clock} from 'react-bootstrap-icons';
import fm from 'front-matter';
import AutoScaleSlide from './AutoScaleSlide';
import SlideLightbox from './SlideLightbox';
import {type ArticleTranslation} from '@/api/ApiTypes';
import StrengthList from '@/components/ui/StrengthList';
import {MarkdownView} from '@/components/ui/MarkdownView';
import {usePlayerContext} from '@/context/Video/PlayerProvider';

type ArticleAttributes = {
  layout?: 'default' | 'centered' | 'full' | 'notes';
  color: string;
  background: string;
  backgroundColor: string;
  paddingTop: string | number;
  paddingBottom: string | number;
  paddingLeft: string | number;
  paddingRight: string | number;
};

type Props = {
  readonly article: ArticleTranslation;
  readonly length: string;
  readonly strengths: string[];
};

export default function ArticleView(props: Props) {
  const {stopAllPlayers} = usePlayerContext();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const {article, length, strengths} = props;
  const {content} = article;

  useEffect(() => {
    return () => {
      stopAllPlayers();
    };
  }, [slideIndex, stopAllPlayers]);

  if (!article) {
    return null;
  }

  for (const section of content) {
    try {
      fm(section);
    } catch {
      return (
        <p>
          Invalid article content. Check the syntax between the &quot;---&quot;
        </p>
      );
    }
  }

  const slidesWithoutNotes = content.filter((section) => {
    const {attributes} = fm(section);
    const {layout} = attributes as ArticleAttributes;
    return layout !== 'notes';
  });

  let slideNumber = 1;

  return (
    <div>
      <h2>{article.title}</h2>
      <hr
        style={{
          margin: '0',
          marginBottom: '1rem',
        }}
      />
      <div className="d-flex gap-3 mb-3">
        <StrengthList strengths={strengths} />
        <div className="d-flex align-items-center">
          <Clock
            size={14}
            style={{
              marginTop: '-2px',
            }}
          />
          <span
            style={{
              marginLeft: '4px',
            }}
          >
            {length}
          </span>
        </div>
      </div>

      {content.length > 1 && (
        <Button
          className="mb-3"
          onClick={() => {
            setLightboxOpen(true);
          }}
        >
          <Trans>Open slideshow</Trans>
        </Button>
      )}
      {content.length > 1
        ? content.map((section, index) => {
            const {body, attributes} = fm(section);
            const {
              layout,
              color,
              background = 'default',
              backgroundColor,
              paddingTop = '50px',
              paddingBottom = '50px',
              paddingLeft = '50px',
              paddingRight = '50px',
            } = attributes as ArticleAttributes;

            if (layout === 'notes') {
              return (
                <MarkdownView
                  key={index} // eslint-disable-line react/no-array-index-key
                  content={body}
                />
              );
            }

            return (
              <div
                key={index} // eslint-disable-line react/no-array-index-key
                className="mb-3 border"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  let indexWithoutNotes = 0;

                  for (let i = 0; i < index; i++) {
                    const {attributes} = fm(content[i]);
                    const {layout} = attributes as ArticleAttributes;
                    if (layout !== 'notes') {
                      indexWithoutNotes++;
                    }
                  }

                  setLightboxOpen(true);
                  setSlideIndex(indexWithoutNotes);
                }}
              >
                <AutoScaleSlide
                  body={body}
                  layout={layout}
                  color={color}
                  background={background}
                  backgroundColor={backgroundColor}
                  paddingTop={paddingTop}
                  paddingBottom={paddingBottom}
                  paddingLeft={paddingLeft}
                  paddingRight={paddingRight}
                  slideNumber={slideNumber++}
                  slideCount={slidesWithoutNotes.length}
                />
              </div>
            );
          })
        : content.map((section, index) => {
            const {body} = fm(section);
            return <MarkdownView key={index} content={body} />; // eslint-disable-line react/no-array-index-key
          })}

      {content.length > 1 && (
        <SlideLightbox
          content={slidesWithoutNotes}
          isSlideLightboxOpen={lightboxOpen}
          slideIndex={slideIndex}
          onEnded={() => {
            setSlideIndex((previousIndex) => previousIndex + 1);
          }}
          onClose={() => {
            setLightboxOpen(false);
            setSlideIndex(0);
          }}
          onView={(index) => {
            setSlideIndex(index);
          }}
        />
      )}
    </div>
  );
}
