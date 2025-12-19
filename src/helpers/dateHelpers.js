const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

/**
 * Calculates working days (inclusive)
 * Excludes weekends & public holidays
 */
export const calculateWorkingDays = (
  startDate,
  endDate,
  publicHolidays = []
) => {
  let workingDays = 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const holidaySet = new Set(publicHolidays);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!isWeekend(d) && !holidaySet.has(formatDate(d))) {
      workingDays++;
    }
  }

  return workingDays;
};
