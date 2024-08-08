import { SalesByBrand } from "@/utils/types/SalesByBrand";

export function groupSumByGroup(
  data: SalesByBrand[]
): { brand: string; value: number }[] {
  const groupedData = data.reduce(
    (acc: Record<string, { brand: string; value: number }>, sales) => {
      if (!acc[sales.ID_GRUPO]) {
        acc[sales.ID_GRUPO] = {
          brand: sales.GRUPO,
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
