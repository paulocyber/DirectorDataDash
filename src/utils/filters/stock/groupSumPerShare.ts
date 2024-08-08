import { Stock } from "@/utils/types/stock";

export function groupSumByStock(
  data: Stock[]
): { brand: string; value: number }[] {
  const groupedData = data.reduce(
    (acc: Record<string, { brand: string; value: number }>, sales) => {
      if (!acc[sales.ID_GRUPO]) {
        acc[sales.ID_GRUPO] = {
          brand: sales.GRUPO,
          value: 0,
        };
      }
      acc[sales.ID_GRUPO].value += parseFloat(
        sales.TOTAL_VALOR_COMPRA.toString()
      );
      return acc;
    },
    {}
  ); // Inicializa o acumulador como um objeto vazio

  return Object.values(groupedData);
}
