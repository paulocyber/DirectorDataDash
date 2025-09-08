// Componentes
import Filters from "@/components/ui/filters";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
interface SectionDavsProps {
  paymentMethodData: TypeFilterProps[];
  sellersData: TypeFilterProps[];
  companiesData: TypeFilterProps[];
  peoplesData: TypeFilterProps[];
  selectingMethodsPayment: string[];
  selectSellers: string[];
  selectTheCompany: string[];
  selectPeoples: string[];
  setSelectingMethodsPayment: (value: string[]) => void;
  setSelectTheCompany: (value: string[]) => void;
  setSelectSellers: (value: string[]) => void;
  setSelectPeoples: (value: string[]) => void;
}

export default function SectionsDavs({
  paymentMethodData,
  sellersData,
  selectingMethodsPayment,
  companiesData,
  peoplesData,
  selectSellers,
  selectTheCompany,
  selectPeoples,
  setSelectingMethodsPayment,
  setSelectTheCompany,
  setSelectSellers,
  setSelectPeoples,
}: SectionDavsProps) {
  const sections = [
    {
      key: "Formas de Pagamentos",
      title: "Filtrar por Forma de Pagamento",
      subtitle: "Selecione as formas de pagamento que deseja exibir",
      content: (
        <Filters
          title="Formas de Pagamentos"
          data={paymentMethodData}
          idKey="ID_FRM"
          labelKey="DESCRICAO_FRM"
          valueKey="DESCRICAO_FRM"
          value={selectingMethodsPayment}
          setValue={setSelectingMethodsPayment}
        />
      ),
    },
    {
      key: "Vendedores",
      title: "Filtrar por Vendedor",
      subtitle: "Selecione os vendedores que deseja exibir",
      content: (
        <Filters
          title="Vendedores"
          data={sellersData}
          idKey="ID_PSS"
          labelKey="APELIDO_PSS"
          valueKey="ID_PSS"
          value={selectSellers}
          setValue={setSelectSellers}
        />
      ),
    },
    {
      key: "Empresas",
      title: "Filtrar por empresas",
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
      key: "Clientes",
      title: "Filtrar por Clientes",
      subtitle: "Selecione as Cliente que deseja exibir",
      content: (
        <Filters
          title="Clientes"
          data={peoplesData}
          idKey="ID_PSS"
          labelKey="NOME_PSS"
          valueKey="ID_PSS"
          value={selectPeoples}
          setValue={setSelectPeoples}
        />
      ),
    },
  ];

  return sections;
}
