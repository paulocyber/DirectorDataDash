// Utils
import { Filters } from "./Filters";

// Tipagem
interface SaleRequest {
  Vendedor: string;
  "Qtde. Pedido": number;
}

export const BestSeller = () => {
  const salesCurrentYear: SaleRequest[] = Filters();
  const salesTotals: Record<string, number> = {};

  // Calcular total de vendas de cada vendedor
  salesCurrentYear.forEach((request) => {
    if (salesTotals[request.Vendedor]) {
      salesTotals[request.Vendedor] += request["Qtde. Pedido"];
    } else {
      salesTotals[request.Vendedor] = request["Qtde. Pedido"];
    }
  });

  // Transforma em array
  const salesArray = Object.entries(salesTotals);

  const topSellers = salesArray.sort(
    ([, totalA], [, totalB]) => totalB - totalA
  );

//   const sortedSalesTotals: Record<string, number> = {};
//   topSellers.forEach(([seller, total]) => {
//     sortedSalesTotals[seller] = total;
//   });

//   console.log(
//     "Vendedora q mais vendeu essa ano",
//     topSellers[0][0],
//     "Top vendas",
//     sortedSalesTotals
//   );

  return topSellers;
};
