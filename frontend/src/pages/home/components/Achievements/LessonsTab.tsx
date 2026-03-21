import {useState, useMemo} from 'react';
import {Dropdown} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {
  type Group,
  type AgeGroup,
  type ArticleChapter,
  type LanguageCode,
} from '@client/ApiTypes.js';
import {
  type CompletedArticles,
  getCompletedArticles,
} from '@shared/timelineProgress.js';
import {ageGroups, ageGroupsTranslationMap} from '@/helpers/article.js';
import {useGetTimelineArticlesQuery} from '@/hooks/useApi.js';
import ProgressCard from '@/components/ui/SlideShow/ProgressCard.js';

type Properties = {
  readonly activeGroup: Group;
};

export default function LessonsTab({activeGroup}: Properties) {
  const {i18n} = useLingui();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(
    activeGroup.ageGroup,
  );

  const {data: timelineArticles = []} = useGetTimelineArticlesQuery();

  const language = i18n.locale as LanguageCode;

  const readArticles = useMemo(
    () =>
      activeGroup.articleProgress.map((p) => ({
        article: p.article,
        completionDate: p.completionDate,
      })),
    [activeGroup.articleProgress],
  );

  const completedArticles = useMemo<CompletedArticles[]>(
    () =>
      getCompletedArticles(timelineArticles, readArticles, selectedAgeGroup),
    [timelineArticles, readArticles, selectedAgeGroup],
  );

  const ageGroupsWithReadArticles = useMemo(() => {
    const groups = new Set<AgeGroup>();
    for (const ageGroup of ageGroups) {
      const completed = getCompletedArticles(
        timelineArticles,
        readArticles,
        ageGroup,
      );
      const hasReadArticles = completed.some((c) =>
        Object.values(c.articles).some((a) => a.status === 'read'),
      );
      if (hasReadArticles) {
        groups.add(ageGroup);
      }
    }

    return groups;
  }, [timelineArticles, readArticles]);

  const isAgeGroupSelectorVisible = ageGroupsWithReadArticles.size > 1;

  return (
    <div>
      {isAgeGroupSelectorVisible ? (
        <Dropdown className="mb-3">
          <Dropdown.Toggle variant="white">
            {ageGroupsTranslationMap[selectedAgeGroup][language]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {ageGroups
              .filter((ag) => ageGroupsWithReadArticles.has(ag))
              .map((ageGroup) => (
                <Dropdown.Item
                  key={ageGroup}
                  active={ageGroup === selectedAgeGroup}
                  onClick={() => {
                    setSelectedAgeGroup(ageGroup);
                  }}
                >
                  {ageGroupsTranslationMap[ageGroup][language]}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : null}

      <div className="card-container">
        {completedArticles.map((item) => {
          const completedChapters = Object.entries(item.articles)
            .filter(([, article]) => article.status === 'read')
            .map(([chapter]) => chapter as ArticleChapter);

          return (
            <div
              key={item.strength}
              className="card-w-100 card-w-md-50 card-w-xl-33"
            >
              <ProgressCard
                isCompact
                completedChapters={completedChapters}
                isAnimated={false}
                language={language}
                strength={item.strength}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
