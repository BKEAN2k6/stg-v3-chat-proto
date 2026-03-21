import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {type Group} from '@client/ApiTypes';
import {useGetStrengthGoalsQuery} from '@client/ApiHooks.js';
import GoalCard from './GoalCard.js';
import useGroupedGoals from '@/components/ui/StrengthGoal/useGroupedGoals.js';

type Properties = {
  readonly activeGroup: Group;
};

export default function GoalsTab({activeGroup}: Properties) {
  const {i18n} = useLingui();

  const {data: strengthGoals = []} = useGetStrengthGoalsQuery(
    {id: activeGroup.id},
    {enabled: Boolean(activeGroup.id)},
  );

  const {completedGoals} = useGroupedGoals(strengthGoals, i18n.locale);

  if (completedGoals.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <Trans>No completed goals yet</Trans>
      </div>
    );
  }

  return (
    <div className="card-container">
      {completedGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          title={goal.title}
          strength={goal.strength}
          completedCount={goal.completedCount}
        />
      ))}
    </div>
  );
}
