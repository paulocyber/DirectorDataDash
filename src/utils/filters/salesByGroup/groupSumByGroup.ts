import { SalesByBrand } from "@/utils/types/salesByBrand";

export function groupSumByGroup(
  data: SalesByBrand[]
): { group: string; value: number }[] {
  const groupedData = data.reduce(
    (acc: Record<string, { group: string; value: number }>, sales) => {
      if (!acc[sales.ID_GRUPO]) {
        acc[sales.ID_GRUPO] = {
          group: sales.GRUPO,
          value: 0,
        };
      }
      acc[sales.ID_GRUPO].value += parseFloat(sales.VALOR_BRUTO_SDI.toString());
      return acc;
    },
    {}
  ); // Inicializa o acumulador como um objeto vazio

  return Object.values(groupedData);
}
