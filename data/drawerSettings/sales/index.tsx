// Componentes
import Accordion from "@/components/ui/Accordion";
import Filters from "@/components/ui/filters";

// Dados
import SectionsBillsToPay from "@/data/sectionsFilters/billsToPay";
import SectionsDavs from "@/data/sectionsFilters/davs";

// Dados
import SectionsSales from "@/data/sectionsFilters/sales";

// tipagem
import { DrawerSettingsItems } from "@/types/drawerSettings";
import { TypeFilterProps } from "@/types/filters/selecting";

interface DrawerSettingsProps {
  // Dados
  companiesData?: TypeFilterProps[];
  paymentMethodData?: TypeFilterProps[];
  costCentersData?: TypeFilterProps[];
  peoplesData?: TypeFilterProps[];
  suppliersData?: TypeFilterProps[];
  sellersData?: TypeFilterProps[];
  // Seleção de filtro
  selectingMethodsPayment?: string[];
  selectSuppliers?: string[];
  selectSellers?: string[];
  selectTables?: string[];
  selectCostCenters?: string[];
  selectStatus?: string[];
  selectTheCompany?: string[];
  selectPeoples?: string[];
  setSelectingMethodsPayment?: (value: string[]) => void;
  setSelectCostCenters?: (value: string[]) => void;
  setSelectTheCompany?: (value: string[]) => void;
  setSelectTables?: (value: string[]) => void;
  setSelectStatus?: (value: string[]) => void;
  setSelectPeoples?: (value: string[]) => void;
  setSelectSuppliers?: (value: string[]) => void;
  setSelectSellers?: (value: string[]) => void;
}

export default function DrawerSettingsJson({
  // Dados
  companiesData = [],
  costCentersData = [],
  paymentMethodData = [],
  peoplesData = [],
  suppliersData = [],
  sellersData = [],
  // Seleção de filtro
  selectingMethodsPayment = [],
  selectTables = [],
  selectCostCenters = [],
  selectStatus = [],
  selectTheCompany = [],
  selectPeoples = [],
  selectSuppliers = [],
  selectSellers = [],
  setSelectingMethodsPayment = () => {},
  setSelectCostCenters = () => {},
  setSelectTheCompany = () => {},
  setSelectTables = () => {},
  setSelectStatus = () => {},
  setSelectPeoples = () => {},
  setSelectSuppliers = () => {},
  setSelectSellers = () => {},
}: DrawerSettingsProps) {
  const sectionsSales = SectionsSales({
    companiesData,
    selectTheCompany,
    selectTables,
    setSelectTheCompany,
    setSelectTables,
  });

  const sectionsBillsToPay = SectionsBillsToPay({
    costCentersData,
    selectCostCenters,
    selectStatus,
    setSelectCostCenters,
    setSelectStatus,
  });

  const sectionsDavs = SectionsDavs({
    //  Dados
    paymentMethodData,
    sellersData,
    peoplesData,
    companiesData,
    // Seleção hook
    selectingMethodsPayment,
    selectSellers,
    selectTheCompany,
    selectPeoples,
    setSelectingMethodsPayment,
    setSelectTheCompany,
    setSelectSellers,
    setSelectPeoples,
  });

  const drawerSettingsMap: Record<string, DrawerSettingsItems> = {
    "/davs/table": {
      Component: Accordion,
      props: { sections: sectionsDavs },
      clear: () => {
        setSelectingMethodsPayment([]);
      },
    },
    "/salesgoal": {
      Component: Accordion,
      props: { sections: sectionsSales },
      clear: () => {
        setSelectTheCompany([]), setSelectTables([]);
      },
    },
    "/billstopay/table": {
      Component: Accordion,
      props: { sections: sectionsBillsToPay },
      clear: () => {
        setSelectCostCenters([]), setSelectStatus([]);
      },
    },
    "/billstoreceive/table": {
      Component: Filters,
      props: {
        title: "Clientes",
        data: peoplesData,
        idKey: "ID_PSS",
        labelKey: "NOME_PSS",
        valueKey: "ID_PSS",
        value: selectPeoples,
        setValue: setSelectPeoples,
      },
      clear: () => {
        setSelectPeoples([]);
      },
    },
    "/salesbybrand": {
      Component: Filters,
      props: {
        title: "Fornecedores",
        data: suppliersData,
        idKey: "ID_MRC",
        labelKey: "DESCRICAO_MRC",
        valueKey: "DESCRICAO_MRC",
        value: selectSuppliers,
        setValue: setSelectSuppliers,
      },
      clear: () => {
        setSelectSuppliers([
          "BASIC INOVA",
          "INOVA HENRIQUE",
          "INOVA COMPRA DE MERCADORIA",
          "ITO INOVA",
          "LEANDRO INOVA",
          "MIA",
          "TOMY INOVA",
          "KIMASTER",
          "PEINING",
          "DEVIA",
          "B-MAX",
          "INOVA",
          "HREBOS",
        ]);
      },
    },
  };

  return drawerSettingsMap;
}
