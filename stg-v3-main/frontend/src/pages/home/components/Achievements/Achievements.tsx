import {useState} from 'react';
import {Trans} from '@lingui/react/macro';
import {Row, Col, Card} from 'react-bootstrap';
import {useGetGroupStatsQuery} from '@client/ApiHooks.js';
import AchievementItem from './AchievementItem.js';
import AchievementsModal, {type AchievementTab} from './AchievementsModal.js';
import LessonsIcon from './icons/LessonsIcon.js';
import GoalsIcon from './icons/GoalsIcon.js';
import GamesIcon from './icons/GamesIcon.js';
import DiplomasIcon from './icons/DiplomasIcon.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {track} from '@/helpers/analytics.js';

function isRecent(updatedAt?: string): boolean {
  if (!updatedAt) {
    return false;
  }

  const tenMinutes = 10 * 60 * 1000;
  return Date.now() - new Date(updatedAt).getTime() < tenMinutes;
}

export default function Achievements() {
  const [activeTab, setActiveTab] = useState<AchievementTab | undefined>();
  const handleTabChange = (tab: AchievementTab | undefined) => {
    if (activeTab === undefined && tab !== undefined) {
      track('Achievements modal opened');
    }

    setActiveTab(tab);
  };

  const {activeGroup} = useActiveGroup();

  const {data: stats} = useGetGroupStatsQuery(
    {id: activeGroup?.id ?? ''},
    {staleTime: 0, enabled: Boolean(activeGroup)},
  );

  if (!activeGroup || !stats) {
    return null;
  }

  const items = [
    {
      key: 'lessons',
      icon: <LessonsIcon />,
      count: stats.lessons.count,
      label: <Trans>Lessons</Trans>,
      bgColor: 'rgb(195, 220, 230)',
      iconColor: '#5a9bb0',
      isBubbling: isRecent(stats.lessons.updatedAt),
    },
    {
      key: 'diplomas',
      icon: <DiplomasIcon />,
      count: stats.diplomas.count,
      label: <Trans>Diplomas</Trans>,
      bgColor: 'rgb(205, 230, 208)',
      iconColor: '#6aaa6a',
      isBubbling: isRecent(stats.diplomas.updatedAt),
    },
    {
      key: 'goals',
      icon: <GoalsIcon />,
      count: stats.goals.count,
      label: <Trans>Goals</Trans>,
      bgColor: 'rgb(253, 238, 238)',
      iconColor: '#c07a94',
      isBubbling: isRecent(stats.goals.updatedAt),
    },
    {
      key: 'games',
      icon: <GamesIcon />,
      count: stats.games.count,
      label: <Trans>Games</Trans>,
      bgColor: 'rgb(245, 178, 140)',
      iconColor: '#e4531a',
      isBubbling: isRecent(stats.games.updatedAt),
    },
  ];

  return (
    <Card className="bg-body-tertiary" style={{overflow: 'visible'}}>
      <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
        <Trans>Achievements</Trans>
        <a
          href="#"
          className="text-decoration-none small"
          onClick={(event) => {
            event.preventDefault();
            handleTabChange('lessons');
          }}
        >
          <Trans>See all</Trans>
        </a>
      </Card.Header>
      <Card.Body>
        <Row className="g-0">
          {items.map((item, index) => (
            <Col key={item.key} xs={6}>
              <AchievementItem
                icon={item.icon}
                count={item.count}
                label={item.label}
                bgColor={item.bgColor}
                iconColor={item.iconColor}
                isBubbling={item.isBubbling}
                zIndex={index + 1}
                onClick={() => {
                  handleTabChange(item.key as AchievementTab);
                }}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
      <AchievementsModal
        activeGroup={activeGroup}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onClose={() => {
          handleTabChange(undefined);
        }}
      />
    </Card>
  );
}
