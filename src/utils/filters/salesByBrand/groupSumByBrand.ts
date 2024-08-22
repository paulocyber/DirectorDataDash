import { SalesByBrand } from "@/utils/types/salesByBrand";

export function groupSumByBrand(
  data: SalesByBrand[]
): { brand: string; value: number }[] {
  const groupedData = data.reduce(
    (acc: Record<string, { brand: string; value: number }>, sales) => {
      if (!acc[sales.ID_MARCA]) {
        acc[sales.ID_MARCA] = {
          brand: sales.MARCAS,
          value: 0,
        };
      } // preço de custo + qtde stock
      acc[sales.ID_MARCA].value += parseFloat(sales.VALOR_BRUTO_SDI.toString());
      return acc;
    },
    {}
  ); // Inicializa o acumulador como um objeto vazio

  return Object.values(groupedData);
}
