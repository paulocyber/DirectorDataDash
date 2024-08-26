// Tipagem
import { Stock, StockByGroup } from "@/utils/types/stock";
type GroupByType = "brand" | "group";

export function groupSumByStock(
  data: Stock[],
  groupBy: GroupByType = "brand"
): StockByGroup[] {
  const groupedData = data.reduce((acc: Record<string, StockByGroup>, stock) => {
    const key = groupBy === "brand" ? stock.MARCA : stock.GRUPO;

    if (!acc[key]) {
      acc[key] = {
        key,
        value: 0,
      };
    }

    acc[key].value += parseFloat(stock.TOTAL_VALOR_COMPRA.toString());
    return acc;
  }, {});

  return Object.values(groupedData);
}
