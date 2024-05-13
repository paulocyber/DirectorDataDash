export const formatDate = (date: string ) => {
  
  const formattedDate = new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formattedDate;
};
