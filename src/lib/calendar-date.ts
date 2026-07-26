/** Matches cribbage-league lock window: roster changes blocked within 7 UTC calendar days of start. */
const LEAGUE_LOCK_DAYS = 7;

export function utcToday(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addUtcCalendarDays(date: string, days: number): string {
  const [yearText, monthText, dayText] = date.split("-");
  const result = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

export function isRosterEditable(startDate: string, now: Date = new Date()): boolean {
  return startDate > addUtcCalendarDays(utcToday(now), LEAGUE_LOCK_DAYS);
}
