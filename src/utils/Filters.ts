// Dados
import order from "../data/BasesVendas.json";

export const Filters = () => {
  const orders = order.Pedidos;
  const currentYear = new Date().getFullYear();

  // Ano atual
  const valueFilter = orders.filter((order) => {
    const orderYear = parseInt(order.Data.split("/")[2]);
    return orderYear === currentYear;
  });

  return valueFilter;
};
