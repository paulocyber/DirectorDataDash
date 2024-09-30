// Dados
import vibrantPalette from "@/data/palettes/vibrant.json";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { SelectionDescription } from "@/utils/types/SelectionDescription";
interface SelectingCostCenterProps {
  filters: SelectionDescription[];
  setFilters: React.Dispatch<React.SetStateAction<SelectionDescription[]>>;
}

export function TopCostCenter({
  allBillets,
  filter = [],
}: {
  allBillets: BillsToPayItem[];
  filter: SelectionDescription[];
}) {
  const parsedData = allBillets.map((item) => ({
    ...item,
    VALOR_PGM: parseFloat(item.VALOR_PGM.replace(",", ".")) || 0,
  }));

  const costCenterSums: Record<
    string,
    { value: number; suppliers: string[]; fill: string }
  > = parsedData.reduce((acc, item) => {
    if (!acc[item.CENTRO_CUSTO]) {
      acc[item.CENTRO_CUSTO] = { value: 0, suppliers: [], fill: "" };
    }
    acc[item.CENTRO_CUSTO].value += item.VALOR_PGM;
    if (!acc[item.CENTRO_CUSTO].suppliers.includes(item.NOME_PSS)) {
      acc[item.CENTRO_CUSTO].suppliers.push(item.NOME_PSS);
    }
    return acc;
  }, {} as Record<string, { value: number; suppliers: string[]; fill: string }>);

  const sortedCostCenters: {
    description: string;
    value: number;
    suppliers: string[];
    fill: string;
  }[] = Object.entries(costCenterSums)
    .map(([description, { value, suppliers, fill }]) => ({
      description,
      value,
      suppliers,
      fill,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const selectCostCenter = sortedCostCenters
    .map((item, index) => {
      const filterItem = filter.find(
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
        filter.length === 0 ||
        filter.some((filter) => filter.description === item.description)
    );

  return { sortedCostCenters, selectCostCenter };
}

export function SelectingCostCenter({ filters, setFilters }: SelectingCostCenterProps) {

  const handleSelectingCostCenter = (description: string, index: number, color: string) => {
      const selecting: SelectionDescription = { id: index, description: description, color: color };
      
      const itemsExists = filters.some(item => item.id === index);

      if (itemsExists) {
          setFilters(filters.filter(item => item.id !== index));
      } else {
          setFilters([...filters, selecting]);
      }
  };

  return { handleSelectingCostCenter };
}