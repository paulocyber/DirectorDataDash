// Dados
import order from "../data/BasesVendas.json";

// Utils
import { Filters } from "./Filters";

export const ValueNewClient = () => {
  const salesCurrentYear = Filters();

  const nonRepeatingCustomer = salesCurrentYear.filter(
    (order, index, orders) => {
      return orders.findIndex((o) => o.Cliente === order.Cliente) === index;
    }
  );

  return nonRepeatingCustomer;
};
