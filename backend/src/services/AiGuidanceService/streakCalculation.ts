/**
 * Gets the ISO week number and year for a given date.
 * ISO weeks start on Monday, and week 1 is the week containing the first Thursday of the year.
 */
export function getISOWeekKey(date: Date): {year: number; week: number} {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Set to nearest Thursday (ISO week definition)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return {year: d.getFullYear(), week};
}

type ActivityRecord = {
  date: Date;
};

/**
 * Calculates the consecutive week streak for a given set of activities.
 * Returns the number of consecutive weeks that have at least one activity.
 *
 * If the current week has activity, it counts from the current week backwards.
 * If the current week has no activity yet, it counts from the previous week backwards,
 * preserving the streak as long as the teacher still has time to maintain it this week.
 * The streak is only broken when there's a truly empty completed week in the past.
 *
 * @param activities - Array of activity records with dates
 * @param referenceDate - Optional reference date to calculate from (defaults to now)
 */
export function calculateStreak(
  activities: ActivityRecord[],
  referenceDate: Date = new Date(),
): number {
  if (activities.length === 0) return 0;

  // Collect all unique weeks with activity
  const activeWeeks = new Set<string>();
  for (const act of activities) {
    const {year, week} = getISOWeekKey(new Date(act.date));
    activeWeeks.add(`${year}-W${week}`);
  }

  // Get reference week
  let {year: currentYear, week: currentWeek} = getISOWeekKey(referenceDate);

  // Helper to move to previous week
  const moveToPreviousWeek = () => {
    currentWeek--;
    if (currentWeek < 1) {
      // Move to the last week of the previous ISO week year
      // Dec 28 is ALWAYS in the last week of its calendar year (week 52 or 53)
      // because it's 3 days before Dec 31, and ISO weeks start on Monday
      // We need Dec 28 of the PREVIOUS calendar year
      const dec28 = new Date(currentYear - 1, 11, 28);
      const previousYearLastWeek = getISOWeekKey(dec28);
      currentYear = previousYearLastWeek.year;
      currentWeek = previousYearLastWeek.week;
    }
  };

  // Check if current week has activity
  const currentWeekHasActivity = activeWeeks.has(
    `${currentYear}-W${currentWeek}`,
  );

  // If current week has no activity, start from previous week
  // (the streak isn't broken yet - the teacher still has time this week)
  if (!currentWeekHasActivity) {
    moveToPreviousWeek();
  }

  // Count consecutive weeks backwards
  let streak = 0;
  while (activeWeeks.has(`${currentYear}-W${currentWeek}`)) {
    streak++;
    moveToPreviousWeek();
  }

  return streak;
}
