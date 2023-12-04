export const formatValue = (valueStockTotal: Number) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formattedNumber = valueStockTotal.toLocaleString("pt-BR", options);

  return formattedNumber;
};

export const formatCurrency = (value: Number) => {
  const options = {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const formattedStockValue = value.toLocaleString("pt-BR", options);

  return formattedStockValue;
};

export const formatBoolean = (value: boolean) => {
  return value ? "sim" : "não";
};

export const formatDate = (date: string | number | Date) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formattedDate;
};
