import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";

export interface menuProp {
  showMenu?: boolean;
  isClose?: (value: boolean) => void;
  isOpen?: (value: boolean) => void;
}

export interface infoCardsProps {
  infoData: { icon: IconDefinition; title: string; value: string }[];
}

export interface apiDataProps {
  query: string;
}

export interface childrenProp {
  children: ReactNode;
}

export interface columnProp {
  id: number;
  headerName: string;
}

export interface DavData {
  N_DAV: string;
  NOME_PSS: string;
  VENDEDOR: string;
  VALOR_RCB: string;
  RESTANTE_SEM_JUROS_RCB: string;
  MULTA_RCB: string;
  DATA_VENCIMENTO_RCB: number;
  ATRASO_RCB: string;
  ID_ORIGEM: string;
}

export interface ItensDavs {
  CODIGO_PRD: string;
  DESCRICAO_ALM: string;
  DESCRICAO_PRD: string;
  ITEM_PROMOCAO_SDI: string;
  PERC_DESCONTO_SDI: string;
  QTDE_DISPONIVEL_SDI: string;
  QTDE_SDI: string;
  REFERENCIA_PRD: string;
  STATUS_SDI: string;
  VALOR_ACRESCIMO_SDI: string;
  VALOR_BRUTO_SDI: string;
  VALOR_DESCONTO_SDI: string;
  VALOR_LIQUIDO_SDI: string;
}

export interface billysToPayData {
  DATA_VENCIMENTO_PGM: string;
  VALOR_PGM: string;
  DESCRICAO_PGM: string;
  GRUPO_CENTRO: string;
  CENTRO_CUSTO: string;
  NOME_PSS: string;
  STATUS_PGM: number;
}

export interface tableProp {
  columns: columnProp[];
  data: DavData[];
  loading: boolean;
}

export interface OrderDetailsTableProps {
  columns: columnProp[];
  data: ItensDavs[];
  loading: boolean;
}

export interface DailyBudgetTableProps {
  columns: columnProp[];
  data: billysToPayData[];
  loading: boolean;
}

export interface infiniteScrollPops {
  fetchMore: () => void;
  loading: boolean;
}

export interface costCenterSummary {
  description: string;
  value: number;
  suppliers: string[];
}

export interface graphicData {
  data: { description: string; value: number }[];
}

export interface descriptionGraphic {
  data: { description: string; value: number }[];
}

export interface FilterItem {
  description: string;
  id: number;
}

export interface supplierItem {
  name: string;
  costCenter: string;
}
