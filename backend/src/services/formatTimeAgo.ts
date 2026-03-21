/**
 * Formats a date as a human-readable "time ago" string.
 * Returns undefined if the date is undefined or in the future.
 */
export function formatTimeAgo(
  date: Date | undefined,
  baseDate: Date,
): string | undefined {
  if (!date) return undefined;

  const diffMs = baseDate.getTime() - date.getTime();
  if (diffMs < 0) return undefined; // Future date?

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // < 1 minute: show seconds
  if (minutes < 1) {
    return `${seconds} seconds ago`;
  }

  // < 1 hour: show minutes
  if (hours < 1) {
    return `${minutes} minutes ago`;
  }

  // < 24 hours: show hours
  if (days < 1) {
    return `${hours} hours ago`;
  }

  // < 7 days: show days
  if (weeks < 1) {
    return `${days} days ago`;
  }

  // < 30 days: show weeks
  if (months < 1) {
    return `${weeks} weeks ago`;
  }

  // < 365 days: show months
  if (years < 1) {
    return `${months} months ago`;
  }

  // >= 1 year: show years
  return `${years} years ago`;
}
