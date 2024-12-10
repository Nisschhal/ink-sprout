// This function checks if the given `dateToCheck` matches the date that is `daysAgo` days before today.

export default function checkDate(dateToCheck: Date, daysAgo: number) {
  // Create a new Date object representing "today" (current date and time).
  const today = new Date();

  // Normalize "today" to midnight (00:00:00) by setting its time components to zero.
  today.setHours(0, 0, 0, 0);

  // Create another Date object initialized with the normalized "today" date.
  const targetDate = new Date(today);

  // Adjust the `targetDate` by subtracting the `daysAgo` value.
  // This sets `targetDate` to the date `daysAgo` days before today.
  targetDate.setDate(targetDate.getDate() - daysAgo);

  // Compare the `dateToCheck` with the `targetDate`:
  // - Check if the day, month, and year match exactly.
  // - If all three match, the `dateToCheck` is exactly `daysAgo` days before today.
  return (
    dateToCheck.getDate() === targetDate.getDate() && // Check day
    dateToCheck.getMonth() === targetDate.getMonth() && // Check month
    dateToCheck.getFullYear() === targetDate.getFullYear() // Check year
  );
}
