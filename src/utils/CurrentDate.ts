// Utils
import { formatDate } from "./masks/formatDate";

export default function currentDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  let yesterday, monthExpired;
  if (day === 1) {
    const prevMonthDate = new Date(year, month - 1, 0);
    yesterday = prevMonthDate.getDate();
    monthExpired = prevMonthDate.getMonth() + 1;
  } else {
    yesterday = day - 1;
    monthExpired = month;
  }

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    day,
    month,
    year,
    today: formatDate(today),
    monthExpired,
    yesterday,
    startOfWeek: formatDate(startOfWeek),
    endOfWeek: formatDate(endOfWeek)
  };
}
