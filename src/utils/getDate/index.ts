// Mascara
import { formatDate } from "../mask/date";

export default function getCurrentDateDetails() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  let yesterday;

  if (day === 1) {
    const prevMonthDate = new Date(year, month - 1, 0);
    yesterday = prevMonthDate.getDate();
  } else {
    yesterday = day - 1;
  }

  const yesterdayDate = new Date(year, month - 1, yesterday);

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
    yesterday: formatDate(yesterdayDate),
    startOfWeek: formatDate(startOfWeekDate),
    endOfWeek: formatDate(endOfWeekDate),
  };
}
