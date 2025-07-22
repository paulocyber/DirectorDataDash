// Componentes
import Filters from "../../../components/ui/filters/index";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
interface SectionsSalesProps {
  companiesData: TypeFilterProps[];
  selectTheCompany: string[];
  selectTables: string[];
  setSelectTheCompany: (value: string[]) => void;
  setSelectTables: (value: string[]) => void;
}

export default function SectionsSales({
  companiesData,
  selectTheCompany,
  selectTables,
  setSelectTheCompany,
  setSelectTables,
}: SectionsSalesProps) {
  const sections = [
    {
      key: "empresas",
      title: "Filtrar por Empresas",
      subtitle: "Selecione as empresas que deseja exibir",
      content: (
        <Filters
          title="Empresas"
          data={companiesData}
          idKey="ID_EMP"
          labelKey="SIGLA_EMP"
          valueKey="ID_EMP"
          value={selectTheCompany}
          setValue={setSelectTheCompany}
        />
      ),
    },
    {
      key: "tabelas",
      title: "Filtrar por Tabelas",
      subtitle: "Selecione a(s) tabela(s) de preço desejada(s)",
      content: (
        <Filters
          title="Tabelas"
          data={[
            { id: "1", name: "Tabela 1" },
            { id: "2", name: "Tabela 2" },
            { id: "3", name: "Tabela 3" },
          ]}
          idKey="id"
          labelKey="name"
          valueKey="id"
          value={selectTables}
          setValue={setSelectTables}
        />
      ),
    },
  ];

  return sections;
}
