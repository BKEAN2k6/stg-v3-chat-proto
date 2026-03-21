import {useEffect, useMemo, useRef, useState} from 'react';
import Card from 'react-bootstrap/Card';
import {
  type ArticleChapter,
  type LanguageCode,
  type StrengthSlug,
} from '@client/ApiTypes';
import './ProgressCard.scss';
import ChapterTrophySmall from '@/components/ui/Trophy/ChapterTrophySmall.js';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';
import StrengthTrophy from '@/components/ui/Trophy/StrengthTrophy.js';

const chapterOrder: ArticleChapter[] = ['start', 'speak', 'act', 'assess'];

type Properties = {
  readonly strength: StrengthSlug;
  readonly completedChapters: ArticleChapter[];
  readonly language: LanguageCode;
  readonly isCompact?: boolean;
  readonly isAnimated?: boolean;
};

function usePrevious<T>(value: T): T | undefined {
  const reference = useRef<T | undefined>(undefined);
  useEffect(() => {
    reference.current = value;
  }, [value]);
  return reference.current;
}

export default function ProgressCard({
  strength,
  completedChapters,
  language,
  isCompact = false,
  isAnimated = true,
}: Properties) {
  const trophySize = isCompact ? 80 : 150;
  const chapterTrophySize = isCompact ? 30 : 50;

  const isInitialMount = useRef(true);
  const previousCompleted = usePrevious(completedChapters);

  const newlyCompleted = useMemo(() => {
    if (isInitialMount.current || previousCompleted === undefined) return [];
    return completedChapters.filter(
      (chapter) => !previousCompleted.includes(chapter),
    );
  }, [completedChapters, previousCompleted]);

  const [poppingChapters, setPoppingChapters] = useState<Set<ArticleChapter>>(
    new Set(),
  );
  const [popStrength, setPopStrength] = useState(false);
  const wasFullyComplete = useRef(false);
  const nowFullyComplete = completedChapters.length === chapterOrder.length;

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (newlyCompleted.length === 0) return;
    setPoppingChapters((previous) => {
      const next = new Set(previous);
      for (const c of newlyCompleted) next.add(c);
      return next;
    });
    const timer = setTimeout(() => {
      setPoppingChapters((previous) => {
        const next = new Set(previous);
        for (const c of newlyCompleted) next.delete(c);
        return next;
      });
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [newlyCompleted]);

  useEffect(() => {
    if (isAnimated && nowFullyComplete && !wasFullyComplete.current) {
      setPopStrength(true);
      const t = setTimeout(() => {
        setPopStrength(false);
      }, 400);
      return () => {
        clearTimeout(t);
      };
    }

    wasFullyComplete.current = nowFullyComplete;
  }, [nowFullyComplete, isAnimated]);

  return (
    <Card
      key={strength}
      style={{
        backgroundColor: strengthColorMap[strength][100],
        ...(isCompact ? {} : {width: 280}),
      }}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
        <div
          className={
            nowFullyComplete
              ? `d-flex justify-content-center ${popStrength ? 'pop-animation' : ''}`
              : 'd-flex justify-content-center'
          }
          style={{
            opacity: nowFullyComplete ? 1 : 0.5,
            transition: 'opacity 0.2s',
          }}
        >
          <StrengthTrophy strength={strength} size={trophySize} />
        </div>

        {isCompact ? (
          <h6 className="my-2">{strengthTranslationMap[strength][language]}</h6>
        ) : (
          <h4 className="my-3">{strengthTranslationMap[strength][language]}</h4>
        )}

        <div className="d-flex flex-column bg-white text-center p-3 pb-2 rounded w-100 align-items-center">
          <div className="d-flex flex-wrap justify-content-between w-100 align-items-center mb-1">
            {chapterOrder.map((stage) => {
              const isCompleted = completedChapters.includes(stage);
              const justCompleted = poppingChapters.has(stage);
              return (
                <div
                  key={stage}
                  className={`d-flex justify-content-center ${
                    justCompleted ? 'pop-animation' : ''
                  }`}
                  style={{
                    opacity: isCompleted ? 1 : 0.5,
                    transition: 'opacity 0.2s',
                    pointerEvents: 'none',
                  }}
                >
                  <ChapterTrophySmall
                    chapter={stage}
                    size={chapterTrophySize}
                    strength={strength}
                  />
                </div>
              );
            })}
          </div>
          {!isCompact && (
            <div className="text-muted fw-bold">
              {completedChapters.length} / {chapterOrder.length}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
