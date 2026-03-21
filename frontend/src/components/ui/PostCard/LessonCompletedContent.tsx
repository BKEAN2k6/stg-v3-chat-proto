import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {
  type StrengthSlug,
  type LanguageCode,
  type ArticleChapter,
  type Group,
} from '@client/ApiTypes';
import ChapterTrophy from '../Trophy/ChapterTrophy.js';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';
import {chaptersTranslationMap} from '@/helpers/article.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly chapter: ArticleChapter;
  readonly group: Group;
};

export default function LessonCompltedContent({
  strength,
  chapter,
  group,
}: Properties) {
  const {i18n} = useLingui();

  const locale = i18n.locale as LanguageCode;
  const groupName = group.name;
  const capitalizedGroupName =
    groupName.charAt(0).toUpperCase() + groupName.slice(1);
  const backgroundColor = strengthColorMap[strength][100];
  const strengthTranslation = strengthTranslationMap[strength][locale];
  const chapterTranslation = chaptersTranslationMap[chapter][locale];

  return (
    <div
      style={{backgroundColor}}
      className="d-flex flex-column gap-2 text-center align-items-center p-3 rounded"
    >
      <h4 className="mt-3">
        <Trans>{capitalizedGroupName} completed a lesson!</Trans>
      </h4>
      <div className="d-flex flex-column gap-2 mt-2">
        <ChapterTrophy chapter={chapter} size={200} strength={strength} />
        <h6>
          {strengthTranslation}: {chapterTranslation}
        </h6>
      </div>
    </div>
  );
}
