export default function convertToTimeZone(date: Date, timeZone: string): Date {
  function getTimezoneOffset(date: Date, timeZone: string): number {
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    const parts = dateTimeFormat.formatToParts(date);
    const year = Number(parts.find((part) => part.type === 'year')!.value);
    const month =
      Number(parts.find((part) => part.type === 'month')!.value) - 1;
    const day = Number(parts.find((part) => part.type === 'day')!.value);
    const hour = Number(parts.find((part) => part.type === 'hour')!.value);
    const minute = Number(parts.find((part) => part.type === 'minute')!.value);
    const second = Number(parts.find((part) => part.type === 'second')!.value);

    const asUTC = Date.UTC(year, month, day, hour, minute, second);
    return (asUTC - date.getTime()) / (60 * 1000);
  }

  const targetTimezoneOffset = getTimezoneOffset(date, timeZone);

  const targetDate = new Date(
    date.getTime() - targetTimezoneOffset * 60 * 1000,
  );

  return targetDate;
}
