import {Trans} from '@lingui/react/macro';
import {Button, ButtonGroup, Modal} from 'react-bootstrap';
import {type Group} from '@client/ApiTypes';
import AchievementItem from './AchievementItem.js';
import LessonsTab from './LessonsTab.js';
import DiplomasTab from './DiplomasTab.js';
import GoalsTab from './GoalsTab.js';
import GamesTab from './GamesTab.js';
import LessonsIcon from './icons/LessonsIcon.js';
import DiplomasIcon from './icons/DiplomasIcon.js';
import GoalsIcon from './icons/GoalsIcon.js';
import GamesIcon from './icons/GamesIcon.js';
import {CrossFade} from '@/components/ui/CrossFade/CrossFade.js';
import {useGetGroupStatsQuery} from '@/hooks/useApi.js';
import useBreakpoint from '@/hooks/useBreakpoint.js';

export type AchievementTab = 'lessons' | 'diplomas' | 'goals' | 'games';

const tabs: Array<{
  key: AchievementTab;
  label: React.ReactNode;
  icon: React.ReactNode;
  description: React.ReactNode;
  bgColor: string;
  iconColor: string;
}> = [
  {
    key: 'lessons',
    label: <Trans>Lessons</Trans>,
    icon: <LessonsIcon />,
    description: <Trans>Complete lessons to earn trophies</Trans>,
    bgColor: 'rgb(195, 220, 230)',
    iconColor: '#5a9bb0',
  },
  {
    key: 'diplomas',
    label: <Trans>Diplomas</Trans>,
    icon: <DiplomasIcon />,
    description: <Trans>Earned by completing all lessons for a strength</Trans>,
    bgColor: 'rgb(205, 230, 208)',
    iconColor: '#6aaa6a',
  },
  {
    key: 'goals',
    label: <Trans>Goals</Trans>,
    icon: <GoalsIcon />,
    description: <Trans>Practice strengths in everyday life</Trans>,
    bgColor: 'rgb(253, 238, 238)',
    iconColor: '#c07a94',
  },
  {
    key: 'games',
    label: <Trans>Games</Trans>,
    icon: <GamesIcon />,
    description: <Trans>Have fun while learning strengths</Trans>,
    bgColor: 'rgb(245, 178, 140)',
    iconColor: '#e4531a',
  },
];

const tabContent: Record<
  AchievementTab,
  React.ComponentType<{activeGroup: Group}>
> = {
  lessons: LessonsTab,
  diplomas: DiplomasTab,
  goals: GoalsTab,
  games: GamesTab,
};

type Properties = {
  readonly activeTab: AchievementTab | undefined;
  readonly onClose: () => void;
  readonly onTabChange: (tab: AchievementTab) => void;
  readonly activeGroup: Group;
};

export default function AchievementsModal({
  activeTab,
  onClose,
  onTabChange,
  activeGroup,
}: Properties) {
  const breakpoint = useBreakpoint();

  const {data: stats} = useGetGroupStatsQuery(
    {id: activeGroup.id},
    {staleTime: 0, enabled: activeTab !== undefined},
  );

  const activeTabData = tabs.find((tab) => tab.key === activeTab);
  const ActiveContent = activeTab ? tabContent[activeTab] : undefined;
  const count = activeTab && stats ? stats[activeTab].count : 0;
  let buttonGroupSize: 'sm' | 'lg' | undefined = 'lg';
  if (breakpoint === 'xs') {
    buttonGroupSize = 'sm';
  } else if (breakpoint === 'sm') {
    buttonGroupSize = undefined;
  }

  return (
    <Modal
      centered
      scrollable
      fullscreen="sm-down"
      show={activeTab !== undefined}
      dialogClassName="w-100"
      contentClassName="h-100"
      style={{'--bs-modal-width': 'min(90vw, 1100px)'} as React.CSSProperties}
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Trans>Achievements</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 px-md-4">
        <div className="w-100 w-md-90 m-auto">
          <h3 className="my-3">{activeGroup.name}</h3>
          <div className="d-flex justify-content-center mb-3">
            <ButtonGroup size={buttonGroupSize} className="w-100">
              {tabs.map((tab) => (
                <Button
                  key={tab.key}
                  className="w-lg-25"
                  variant={
                    activeTab === tab.key ? 'primary' : 'outline-primary'
                  }
                  onClick={() => {
                    onTabChange(tab.key);
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          {activeTabData ? (
            <div className="d-flex align-items-center gap-3 mb-3">
              <AchievementItem
                icon={activeTabData.icon}
                count={count}
                bgColor={activeTabData.bgColor}
                iconColor={activeTabData.iconColor}
                isBubbling={false}
                zIndex={1}
                size={
                  breakpoint === 'xs' || breakpoint === 'sm'
                    ? 'default'
                    : 'large'
                }
              />
              <div>
                <h3 className="mb-0 fs-4 fs-lg-3">{activeTabData.label}</h3>
                <span className="text-muted">{activeTabData.description}</span>
              </div>
            </div>
          ) : undefined}
          {ActiveContent && activeTab ? (
            <CrossFade contentKey={activeTab}>
              <ActiveContent activeGroup={activeGroup} />
            </CrossFade>
          ) : undefined}
        </div>
      </Modal.Body>
    </Modal>
  );
}
