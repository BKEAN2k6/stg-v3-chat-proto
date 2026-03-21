import {type ArticleChapter, type StrengthSlug} from '@client/ApiTypes';
import './CircleButton.scss';
import {strengthColorMap} from '@/helpers/strengths.js';
import ChapterTrophySmall from '@/components/ui/Trophy/ChapterTrophySmall.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly articleType: ArticleChapter;
  readonly isSelected: boolean;
  readonly isUnread: boolean;
  readonly onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type CsVariableProperties = {
  '--btn-base'?: string;
  '--btn-shadow'?: string;
  '--btn-hover'?: string;
} & React.CSSProperties;

export default function CircleButton({
  strength,
  articleType,
  isSelected,
  isUnread,
  onClick,
  ...rest
}: Properties) {
  const baseColor = isSelected
    ? strengthColorMap[strength][500]
    : isUnread
      ? '#E8ECF0'
      : strengthColorMap[strength][100];

  const shadowColor = isUnread ? '#CDD4DB' : strengthColorMap[strength][300];

  const hoverColor = isSelected
    ? strengthColorMap[strength][100]
    : strengthColorMap[strength][500];

  const cssVariables: CsVariableProperties = {
    '--btn-base': baseColor,
    '--btn-shadow': shadowColor,
    '--btn-hover': hoverColor,
  };

  return (
    <div className="circle-button__wrapper" style={cssVariables}>
      <button
        style={{background: baseColor}}
        type="button"
        className="circle-button__face"
        onClick={onClick}
        {...rest}
      >
        <img
          src={`/images/chapters/${articleType}-crow-v2-sm.png`}
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '130%',
            width: 'auto',
            pointerEvents: 'none',
            opacity: isUnread && !isSelected ? 0.5 : 1,
          }}
          alt={`${articleType} badge`}
        />
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: '-10cqw',
          right: '-14cqw',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <ChapterTrophySmall
          chapter={articleType}
          isGray={isUnread}
          size="34cqw"
          strength={strength}
        />
      </div>
    </div>
  );
}
