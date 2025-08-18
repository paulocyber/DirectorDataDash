// Componentes
import Filters from "@/components/ui/filters";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
interface SectionDavsProps {
  paymentMethodData: TypeFilterProps[];
  sellersData: TypeFilterProps[];
  selectingMethodsPayment: string[];
  selectSellers: string[];
  setSelectingMethodsPayment: (value: string[]) => void;
  setSelectSellers: (value: string[]) => void;
}

export default function SectionsDavs({
  paymentMethodData,
  sellersData,
  selectingMethodsPayment,
  selectSellers,
  setSelectingMethodsPayment,
  setSelectSellers,
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
  ];

  return sections;
}
