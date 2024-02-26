// Dados
import { Filters } from "./Filters";

export const CalculateTotalSalesValue = () => {
  const salesCurrentYear = Filters();
  
  const totalSaleValue = salesCurrentYear
    .map((order) => order.Preço * order["Qtde. Pedido"])
    .reduce((total, value) => total + value, 0);

  console.log("Base de dados de vendas", totalSaleValue);

  return totalSaleValue;
};
