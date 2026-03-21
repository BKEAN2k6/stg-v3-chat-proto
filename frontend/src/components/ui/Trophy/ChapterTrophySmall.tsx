import {type ArticleChapter, type StrengthSlug} from '@client/ApiTypes';

type Properties = {
  readonly strength: StrengthSlug;
  readonly chapter: ArticleChapter;
  readonly size?: number | string;
  readonly isGray?: boolean;
};

const aspectRatio = 41 / 29;

export default function ChapterTrophySmall({
  strength,
  chapter,
  size = 50,
  isGray,
}: Properties) {
  const width = size;
  const height =
    typeof width === 'number'
      ? width * aspectRatio
      : `calc(${width} * ${aspectRatio})`;

  const trophySrc = isGray
    ? '/images/trophy/trophy-gray.png'
    : `/images/trophy/trophy-${strength}.png`;

  return (
    <div style={{position: 'relative', width, height}}>
      <img src={trophySrc} style={{width: '100%', height: '100%'}} alt="" />
      <img
        src={`/images/chapters/${chapter}-icon-v2.png`}
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '52%',
          height: 'auto',
          pointerEvents: 'none',
          filter: isGray ? 'grayscale(1) brightness(2.0)' : undefined,
          opacity: isGray ? 0.5 : 1,
        }}
        alt={`${chapter} badge`}
      />
    </div>
  );
}
