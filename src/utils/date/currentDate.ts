import { formatDate } from "../mask/formatDate";

export default function getDate() {
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

  // Calcular o início da semana (segunda-feira)
  const startOfWeekDate = new Date(today);
  const dayOfWeek = startOfWeekDate.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  startOfWeekDate.setDate(today.getDate() - distanceToMonday);

  // Calcular o fim da semana (domingo)
  const endOfWeekDate = new Date(startOfWeekDate);
  endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);

  return {
    today: formatDate(today),
    day,
    month,
    year,
    yesterday,
    monthExpired,
    startOfWeek: formatDate(startOfWeekDate),
    endOfWeek: formatDate(endOfWeekDate),
  };
}
