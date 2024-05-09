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
