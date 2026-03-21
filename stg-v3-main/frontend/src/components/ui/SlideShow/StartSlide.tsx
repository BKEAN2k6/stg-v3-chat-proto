import {
  type LanguageCode,
  type AgeGroup,
  type ArticleChapter,
  type StrengthSlug,
} from '@client/ApiTypes.js';
import {Button} from 'react-bootstrap';
import './SlideShell.scss';
import './StartSlide.scss';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';
import {
  chaptersTranslationMap,
  ageGroupsTranslationMap,
} from '@/helpers/article.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly chapter: ArticleChapter;
  readonly ageGroup: AgeGroup;
  readonly language: LanguageCode;
  readonly slideCount: number;
  readonly isFullScreen: boolean;
};

const startLessonTranslations = {
  en: 'Start lesson',
  fi: 'Aloita oppitunti',
  sv: 'Starta lektionen',
};

const slidesTransations = {
  en: 'slides',
  fi: 'sivua',
  sv: 'sidor',
};

export default function StartSlide({
  strength,
  chapter,
  ageGroup,
  language,
  slideCount,
  isFullScreen,
}: Properties) {
  const backgroundColor = strengthColorMap[strength][300];
  const strengthTitle = strengthTranslationMap[strength][language];
  const chapterTitle = chaptersTranslationMap[chapter][language];
  const ageGroupTitle = ageGroupsTranslationMap[ageGroup][language];

  return (
    <div className="slide-shell">
      <div className="slide-root" style={{backgroundColor}}>
        <div className="start-slide__inner">
          <div className="start-slide__layout">
            <div className="start-slide__illustration">
              <img
                className="start-slide__image"
                src={`/images/chapters/${chapter}-crow-v2-lg.png`}
                alt={`${chapterTitle} trophy`}
              />
            </div>
            <div className="start-slide__card bg-white">
              <div className="start-slide__card-body">
                <h1 className="start-slide__chapter">{chapterTitle}</h1>
                <h2 className="start-slide__strength">{strengthTitle}</h2>
                <h3 className="start-slide__age">{ageGroupTitle}</h3>
              </div>
              <p className="start-slide__count">
                {slideCount} {slidesTransations[language]}
              </p>
              {!isFullScreen && (
                <div className="mt-auto w-100">
                  <Button className="slide-cta-button w-100">
                    {startLessonTranslations[language]}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
