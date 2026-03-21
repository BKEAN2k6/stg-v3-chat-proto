import {useLingui} from '@lingui/react';
import {Flippy, FrontSide, BackSide} from '../../../components/ui/Flippy';
import {type StrengthSlug} from '@/api/ApiTypes';
import {slugToListItem} from '@/helpers/strengths';

type Card = {
  _id: string;
  slug: StrengthSlug;
  isFlipped: boolean;
  isClickable: boolean;
};

type Props = {
  readonly cards: Card[];
  readonly handleCardClick?: (cards: Card) => void;
  readonly size: number;
};

const cardPixelSize = 250;

export default function Cards(props: Props) {
  const {cards, handleCardClick, size} = props;
  const {i18n} = useLingui();
  const gridSize = Math.sqrt(cards.length);
  const cardSize = size / gridSize;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {cards.map((card) => {
        const {slug} = card;
        const {title, imageUrl, color} = slugToListItem(slug, i18n.locale);

        return (
          <div
            key={card._id}
            style={{
              width: cardSize,
              height: cardSize,
              transform: `scale(${cardSize / cardPixelSize})`,
              transformOrigin: 'top left',
            }}
          >
            <Flippy
              isFlipped={card.isFlipped}
              flipDirection="horizontal"
              style={{
                width: cardPixelSize,
                height: cardPixelSize,
                cursor: card.isClickable ? 'pointer' : 'not-allowed',
                padding: 5,
              }}
              onClick={() => {
                if (handleCardClick && card.isClickable) {
                  handleCardClick(card);
                }
              }}
            >
              <FrontSide style={{backgroundColor: '#7754c9'}} />
              <BackSide
                className="d-flex flex-column justify-content-center align-items-center text-center fs-2"
                style={{
                  backgroundColor: color,
                  padding: 10,
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                <img
                  src={imageUrl}
                  alt={title}
                  style={{
                    width: '65%',
                    height: '65%',
                    objectFit: 'cover',
                  }}
                />
                {title}
              </BackSide>
            </Flippy>
          </div>
        );
      })}
    </div>
  );
}
