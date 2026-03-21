import React from 'react';
import {type StrengthSlug, type ArticleChapter} from '@client/ApiTypes.js';
import CircleButton from './CircleButton.js';
import {articleChapters, chaptersTranslationMap} from '@/helpers/article.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';

function HorisontalLine() {
  return (
    <div className="flex-grow-1 align-self-center">
      <hr className="d-none d-sm-block" />
    </div>
  );
}

type Properties = {
  readonly strength: StrengthSlug;
  readonly currentChapters: Record<
    ArticleChapter,
    {
      id: string;
      status: 'read' | 'next' | 'unread';
    }
  >;
  readonly selectedChapter?: ArticleChapter;
  readonly onClick?: (type: ArticleChapter) => void;
  readonly isDemo?: boolean;
};

export default function StrengthTimeline({
  strength,
  selectedChapter,
  currentChapters,
  onClick,
  isDemo,
}: Properties) {
  const types: ArticleChapter[] = articleChapters;
  const {activeGroup} = useActiveGroup();

  if (!activeGroup) {
    return null;
  }

  return (
    <div
      className={`d-flex text-center ${isDemo ? 'gap-2' : 'gap-1 gap-sm-2 gap-md-2 gap-lg-3'}  mx-1 mx-sm-1 mx-md-2 mx-lg-3`}
    >
      {types.map((chapter, index) => {
        const isSelected = selectedChapter === chapter;
        const status = currentChapters[chapter]?.status ?? 'unread';
        return (
          <React.Fragment key={chapter}>
            <div
              style={{
                width: isDemo ? '25%' : '20%',
                maxWidth: 100,
              }}
              className="d-inline-flex flex-column align-items-center position-relative overflow-visible text-nowrap gap-3"
            >
              <CircleButton
                strength={strength}
                articleType={chapter}
                isSelected={isSelected}
                isUnread={status === 'unread' || status === 'next'} // Assuming unread if not selected
                onClick={() => {
                  onClick?.(chapter);
                }}
              />

              <span
                className="mt-0 mt-md-1"
                style={{
                  fontWeight: isSelected ? 500 : 'normal',
                }}
              >
                {!isDemo && (
                  <span className="d-none d-sm-inline">{index + 1}. </span>
                )}
                {chaptersTranslationMap[chapter][activeGroup.language]}
              </span>
            </div>
            {index < types.length - 1 && <HorisontalLine />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
