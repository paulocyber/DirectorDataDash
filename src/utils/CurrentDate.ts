export default function currentDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const date = `${year}-${month}-${day}`;

  let lastDay, adjustedMonth;
  if (day === 1) {
    const prevMonthDate = new Date(year, month - 1, 0);
    lastDay = prevMonthDate.getDate();
    adjustedMonth = prevMonthDate.getMonth() + 1;
  } else {
    lastDay = day - 1;
    adjustedMonth = month;
  }

  return { day, month, year, date, today, adjustedMonth, lastDay };
}
