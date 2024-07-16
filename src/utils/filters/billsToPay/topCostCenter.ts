// Biblioteca
import { useRecoilValue } from "recoil";

// Atom
import { filterDescription } from "@/atom/filterDescription";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { vibrantPalette } from "@/data/graphicColorPalette";

export function TopCostCenter({
  billetPaidAndOpen,
}: {
  billetPaidAndOpen: BillsToPayItem[];
}) {
  const costCenter = useRecoilValue(filterDescription);

  const parsedData = billetPaidAndOpen.map((item) => ({
    ...item,
    VALOR_PGM: parseFloat(item.VALOR_PGM.replace(",", ".")) || 0,
  }));

  // Evitar redudencia
  const costCenterSums: Record<string, { value: number; suppliers: string[] }> =
    parsedData.reduce((acc, item) => {
      if (!acc[item.CENTRO_CUSTO]) {
        acc[item.CENTRO_CUSTO] = { value: 0, suppliers: [] };
      }
      acc[item.CENTRO_CUSTO].value += item.VALOR_PGM;
      if (!acc[item.CENTRO_CUSTO].suppliers.includes(item.NOME_PSS)) {
        acc[item.CENTRO_CUSTO].suppliers.push(item.NOME_PSS);
      }
      return acc;
    }, {} as Record<string, { value: number; suppliers: string[] }>);

  // Transformando array para objeto
  const sortedCostCenters = Object.entries(costCenterSums)
    .map(([description, { value, suppliers }]) => ({
      description,
      value,
      suppliers,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const selectCostCenter = sortedCostCenters
    .map((item, index) => {
      const filterItem = costCenter.find(
        (filter) => filter.description === item.description
      );
      return {
        ...item,
        color: filterItem
          ? filterItem.color
          : vibrantPalette[index % vibrantPalette.length],
      };
    })
    .filter(
      (item) =>
        costCenter.length === 0 ||
        costCenter.some((filter) => filter.description === item.description)
    );

  return { sortedCostCenters, selectCostCenter };
}
