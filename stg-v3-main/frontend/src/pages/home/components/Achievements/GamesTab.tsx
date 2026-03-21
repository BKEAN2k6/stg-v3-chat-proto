import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {Card} from 'react-bootstrap';
import {type Group} from '@client/ApiTypes';
import {useGetGroupStatsQuery} from '@client/ApiHooks.js';
import MemoryGameIcon from './icons/MemoryGameIcon.js';
import StrengthSprintIcon from './icons/StrengthSprintIcon.js';
import {strengthColorMap} from '@/helpers/strengths.js';
import GoalTrophy from '@/components/ui/StrengthGoal/GoalTrophy.js';

const size = 180;

const gameData = {
  'memory-game': {
    icon: <MemoryGameIcon />,
    name: msg`Memory game`,
    strength: 'perseverance' as const,
  },
  sprint: {
    icon: <StrengthSprintIcon />,
    name: msg`Strength sprint`,
    strength: 'selfRegulation' as const,
  },
};

type Properties = {
  readonly activeGroup: Group;
};

export default function GamesTab({activeGroup}: Properties) {
  const {_} = useLingui();
  const {data: stats} = useGetGroupStatsQuery(
    {id: activeGroup.id},
    {enabled: Boolean(activeGroup.id)},
  );

  const playedGames = stats?.games.byType.filter((game) => game.count > 0);

  if (!playedGames || playedGames.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <Trans>No games played yet</Trans>
      </div>
    );
  }

  return (
    <div className="card-container">
      {playedGames.map((game) => {
        const data = gameData[game.slug];
        if (!data) return null;

        const darkerColor = strengthColorMap[data.strength][300];
        const lighterColor = strengthColorMap[data.strength][100];

        return (
          <Card
            key={game.slug}
            className="card-w-100 card-w-md-50 card-w-xl-33"
          >
            <Card.Body
              className="text-center py-4"
              style={{backgroundColor: lighterColor}}
            >
              <div className="d-flex flex-column align-items-center gap-3">
                <div style={{width: '100%', maxWidth: size, aspectRatio: '1'}}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '78%',
                        left: '78%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }}
                    >
                      <GoalTrophy
                        completedCount={game.count}
                        isAnimated={false}
                        size={80}
                      />
                    </div>
                    <div
                      className="d-flex rounded-circle align-items-center justify-content-center shadow-md"
                      style={{
                        backgroundColor: darkerColor,
                        width: '100%',
                        height: '100%',
                        color: lighterColor,
                        border: '8px solid white',
                      }}
                    >
                      {data.icon}
                    </div>
                  </div>
                </div>
                <div className="fw-bold fs-4">{_(data.name)}</div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
