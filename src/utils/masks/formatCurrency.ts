export function formatCurrency(value: number): string {
    const options: Intl.NumberFormatOptions = {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  
    const formattedStockValue = value.toLocaleString("pt-BR", options);
  
    return formattedStockValue;
  }