import {type ArticleChapter, type StrengthSlug} from '@client/ApiTypes';
import TrophyHandleless from './TrophyHandleless.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly size?: number | string;
  readonly chapter: ArticleChapter;
};

export default function ChapterTrophy({
  strength,
  size = 100,
  chapter,
}: Properties) {
  return (
    <TrophyHandleless strength={strength} size={size}>
      <img
        src={`/images/chapters/${chapter}-crow-v2-lg.png`}
        style={{
          position: 'absolute',
          top: '34%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: 'auto',
          pointerEvents: 'none',
        }}
        alt={`${chapter} badge`}
      />
    </TrophyHandleless>
  );
}
