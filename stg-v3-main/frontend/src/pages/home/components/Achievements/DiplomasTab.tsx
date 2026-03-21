import {useState, useMemo} from 'react';
import {Dropdown} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import Card from 'react-bootstrap/Card';
import {useLingui} from '@lingui/react';
import {
  type Group,
  type AgeGroup,
  type LanguageCode,
} from '@client/ApiTypes.js';
import {
  type CompletedArticles,
  getCompletedArticles,
} from '@shared/timelineProgress.js';
import {useGetTimelineArticlesQuery} from '@client/ApiHooks.js';
import StrengthTrophy from '@/components/ui/Trophy/StrengthTrophy.js';
import DiplomaDownloadButton from '@/components/ui/PostCard/DiplomaDownloadButton.js';
import {ageGroups, ageGroupsTranslationMap} from '@/helpers/article.js';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';

type Properties = {
  readonly activeGroup: Group;
};

function isStrengthCompleted(item: CompletedArticles): boolean {
  return Object.values(item.articles).every((a) => a.status === 'read');
}

export default function DiplomasTab({activeGroup}: Properties) {
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

  const completedStrengths = useMemo(
    () =>
      getCompletedArticles(
        timelineArticles,
        readArticles,
        selectedAgeGroup,
      ).filter((item) => isStrengthCompleted(item)),
    [timelineArticles, readArticles, selectedAgeGroup],
  );

  const ageGroupsWithCompletedStrengths = useMemo(() => {
    const groups = new Set<AgeGroup>();
    for (const ageGroup of ageGroups) {
      const completed = getCompletedArticles(
        timelineArticles,
        readArticles,
        ageGroup,
      );
      if (completed.some((c) => isStrengthCompleted(c))) {
        groups.add(ageGroup);
      }
    }

    return groups;
  }, [timelineArticles, readArticles]);

  const isAgeGroupSelectorVisible = ageGroupsWithCompletedStrengths.size > 1;

  const getCompletionDate = (item: CompletedArticles): string => {
    const articleIds = new Set(Object.values(item.articles).map((a) => a.id));
    const dates = readArticles
      .filter((r) => articleIds.has(r.article))
      .map((r) => r.completionDate);
    dates.sort();
    return dates.at(-1) ?? '';
  };

  if (completedStrengths.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <Trans>No diplomas completed yet</Trans>
      </div>
    );
  }

  return (
    <div>
      {isAgeGroupSelectorVisible ? (
        <Dropdown className="mb-3">
          <Dropdown.Toggle variant="white">
            {ageGroupsTranslationMap[selectedAgeGroup][language]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {ageGroups
              .filter((ag) => ageGroupsWithCompletedStrengths.has(ag))
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
        {completedStrengths.map((item) => (
          <div
            key={item.strength}
            className="card-w-100 card-w-md-50 card-w-xl-33"
          >
            <Card
              style={{
                backgroundColor: strengthColorMap[item.strength][100],
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                <StrengthTrophy strength={item.strength} size={120} />
                <h6 className="my-2">
                  {strengthTranslationMap[item.strength][language]}
                </h6>
                <DiplomaDownloadButton
                  isFullWidth
                  variant="white"
                  strength={item.strength}
                  group={activeGroup}
                  date={getCompletionDate(item)}
                />
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
