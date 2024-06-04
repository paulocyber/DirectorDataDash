export default function currentDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const currentDate = `${day}-${month}-${year}`;

  return { day, month, year, currentDate, today };
}
