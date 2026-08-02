export function utcToday(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addUtcCalendarDays(date: string, days: number): string {
  const [yearText, monthText, dayText] = date.split("-");
  const result = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
