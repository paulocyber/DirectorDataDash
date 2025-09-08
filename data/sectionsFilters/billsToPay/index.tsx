// Componentes
import Filters from "@/components/ui/filters";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
interface SectionsBillsToPayProps {
  costCentersData: TypeFilterProps[];
  selectCostCenters: string[];
  selectStatus: string[];
  setSelectCostCenters: (value: string[]) => void;
  setSelectStatus: (value: string[]) => void;
}

export default function SectionsBillsToPay({
  costCentersData,
  selectCostCenters,
  selectStatus,
  setSelectCostCenters,
  setSelectStatus,
}: SectionsBillsToPayProps) {
  const section = [
    {
      key: "Status",
      title: "Filtrar por status de pagamento",
      subtitle: "Selecione os status que deseja exibir",
      content: (
        <Filters
          title="Status"
          data={[
            { id: 1, status: "Em aberto" },
            { id: 2, status: "Pago" },
          ]}
          idKey="id"
          labelKey="status"
          valueKey="status"
          value={selectStatus}
          setValue={setSelectStatus}
        />
      ),
    },
    {
      key: "Centro de custo",
      title: "Filtrar por centro de custo",
      subtitle: "Selecione os centro de custo que deseja exibir",
      content: (
        <Filters
          title="Empresas"
          data={costCentersData}
          idKey="ID_CNT"
          labelKey="DESCRICAO_CNT"
          valueKey="ID_CNT"
          value={selectCostCenters}
          setValue={setSelectCostCenters}
        />
      ),
    },
  ];

  return section;
}
