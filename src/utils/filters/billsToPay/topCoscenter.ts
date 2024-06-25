// Biblioteca
import { useRecoilValue } from "recoil";

// Atom
import { filterDescription } from "@/atom/FilterDescription";
import { vibrantPalette } from "@/data/dashBoardColorPalette";

// Tipagem
interface billetPaidAndInOpen {
  CENTRO_CUSTO: string;
  GRUPO_CENTRO: string;
  VALOR_PGM: string;
  NOME_PSS: string;
}

type topCostCenterProps = {
  listBilletPaidAndInOpen: billetPaidAndInOpen[];
};

export default function topCostCenter({
  listBilletPaidAndInOpen,
}: topCostCenterProps) {
  const filterSelection = useRecoilValue(filterDescription);

  const parsedData = listBilletPaidAndInOpen.map((item) => ({
    ...item,
    VALOR_PGM: parseFloat(item.VALOR_PGM.replace(",", ".")) || 0,
  }));

  // Agrupamento dos centros de custo e evitando redudancia dos centros de custo e fornecedores
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

  // Objeto para array trazendo tops 10 centro de custo
  const sortedCostCenters = Object.entries(costCenterSums)
    .map(([description, { value, suppliers }]) => ({
      description,
      value,
      suppliers,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Filtro de seleção
  const selectCostCenter = sortedCostCenters
    .map((item, index) => {
      const filterItem = filterSelection.find(
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
        filterSelection.length === 0 ||
        filterSelection.some(
          (filter) => filter.description === item.description
        )
    );

  return { sortedCostCenters, selectCostCenter };
}
