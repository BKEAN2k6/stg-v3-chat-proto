import {useCallback} from 'react';
import {Button} from 'react-bootstrap';
import {
  type LanguageCode,
  type ArticleChapter,
  type StrengthSlug,
} from '@client/ApiTypes.js';
import './SlideShell.scss';
import './EndScreenSlide.scss';
import {markAsReadTranslations} from './translations.js';
import ChapterTrophy from '@/components/ui/Trophy/ChapterTrophy.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly language: LanguageCode;
  readonly chapter: ArticleChapter;
  readonly isMarkingAsRead: boolean;
  readonly onMarkAsRead: () => void;
};

const articleCompletedTranslations = {
  en: 'Lesson completed',
  fi: 'Oppitunti suoritettu',
  sv: 'Lektion slutförd',
};

const wellDoneTranslations = {
  en: 'Well done!',
  fi: 'Hienosti tehty!',
  sv: 'Bra gjort!',
};

export default function EndScreenSlide({
  strength,
  language,
  chapter,
  isMarkingAsRead,
  onMarkAsRead,
}: Properties) {
  const backgroundColor = strengthColorMap[strength][100];

  const handleMarkRead = useCallback(() => {
    onMarkAsRead();
  }, [onMarkAsRead]);

  return (
    <div className="slide-shell">
      <div className="slide-root" style={{backgroundColor}}>
        <div className="end-slide">
          <h3 className="end-slide__subtitle">
            {articleCompletedTranslations[language]}
          </h3>
          <h1 className="end-slide__title">{wellDoneTranslations[language]}</h1>
          <div className="end-slide__trophy">
            <ChapterTrophy
              chapter={chapter}
              size="20.25cqw"
              strength={strength}
            />
          </div>
          <div
            className="w-75 mx-auto"
            style={{maxWidth: '22cqw', marginTop: '1cqw'}}
          >
            <Button
              variant="primary"
              className="slide-cta-button w-100"
              disabled={isMarkingAsRead}
              onClick={handleMarkRead}
            >
              {markAsReadTranslations[language]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
