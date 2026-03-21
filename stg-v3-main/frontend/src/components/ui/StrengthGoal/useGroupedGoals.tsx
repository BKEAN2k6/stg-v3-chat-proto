import {useMemo} from 'react';
import {type StrengthSlug, type StrengthGoal} from '@client/ApiTypes';
import {slugToListItem} from '@/helpers/strengths.js';

export function addDesciptonAndTitle(goal: StrengthGoal, locale: string) {
  const {description, title} = slugToListItem(goal.strength, locale);
  let actualDescription = goal.description ?? description;
  if (
    !actualDescription.endsWith('.') &&
    !actualDescription.endsWith('!') &&
    !actualDescription.endsWith('?')
  ) {
    actualDescription += '.';
  }

  return {...goal, description: actualDescription, title};
}

export type GroupedGoal = StrengthGoal & {
  completedCount: number;
  title: string;
  description: string;
};

const groupGoals = (goals: StrengthGoal[], locale: string) => {
  const groupedGoals = new Map<StrengthSlug, GroupedGoal>();

  for (const goal of goals) {
    const isCompleted = goal.events.length >= goal.target ? 1 : 0;
    const existing = groupedGoals.get(goal.strength);

    if (existing) {
      const newCompletedCount = existing.completedCount + isCompleted;
      const repGoal =
        new Date(goal.createdAt) > new Date(existing.createdAt)
          ? goal
          : existing;
      groupedGoals.set(goal.strength, {
        ...addDesciptonAndTitle(repGoal, locale),
        completedCount: newCompletedCount,
      });
    } else {
      groupedGoals.set(goal.strength, {
        ...addDesciptonAndTitle(goal, locale),
        completedCount: isCompleted,
      });
    }
  }

  return [...groupedGoals.values()];
};

export default function useGroupedGoals(goals: StrengthGoal[], locale: string) {
  const activeGoals = useMemo(() => {
    const latestNonSystem = new Map<StrengthSlug, StrengthGoal>();
    for (const goal of goals) {
      if (goal.isSystemCreated) continue;
      const current = latestNonSystem.get(goal.strength);
      if (!current || new Date(goal.createdAt) > new Date(current.createdAt)) {
        latestNonSystem.set(goal.strength, goal);
      }
    }

    const finalActive = [];
    for (const candidate of latestNonSystem.values()) {
      if (
        candidate.events.length < candidate.target &&
        new Date(candidate.targetDate) >= new Date()
      ) {
        finalActive.push(candidate);
      }
    }

    return groupGoals(finalActive, locale).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [goals, locale]);

  const completedGoals = useMemo(
    () =>
      groupGoals(
        goals.filter((goal) => goal.events.length >= goal.target),
        locale,
      ).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [goals, locale],
  );

  return {activeGoals, completedGoals};
}
