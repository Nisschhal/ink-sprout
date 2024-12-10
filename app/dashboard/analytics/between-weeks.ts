export default function betweenWeeks(
  dateToCheck: Date, // The date you want to check
  betweenDate1: number, // Days ago for the start of the range
  betweenDate2: number // Days ago for the end of the range
) {
  // Get today's date and time
  const today = new Date();

  // Reset today's time to midnight (00:00:00) to focus only on the date part.
  today.setHours(0, 0, 0, 0);

  // Create a copy of today's date for the first target date
  const targetDate1 = new Date(today);

  // Create another copy of today's date for the second target date
  const targetDate2 = new Date(today);

  // Move the first target date back by `betweenDate1` days (start of the range)
  targetDate1.setDate(targetDate1.getDate() - betweenDate1);

  // Move the second target date back by `betweenDate2` days (end of the range)
  targetDate2.setDate(targetDate2.getDate() - betweenDate2);

  // Now check if the date to check (`dateToCheck`) is between these two dates:
  // - It should be greater than or equal to `targetDate1`
  // - It should be less than or equal to `targetDate2`
  return dateToCheck >= targetDate1 && dateToCheck <= targetDate2;
}
