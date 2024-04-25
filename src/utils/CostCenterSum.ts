// Dados
import { UseApiData } from "../data/useApiData";

// Tipagem
import { FilterItem, costCenterSummary, supplierItem } from "../models/types";

// Biblioteca
import { useRecoilValue } from "recoil";

// Atom
import { filterDescription } from "../atom/filterAtom";

export const CostCenterSummary = () => {
  const filters: FilterItem[] = useRecoilValue(filterDescription);

  let query =
    "select pgm.valor_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.nome_pss from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and pgm.data_vencimento_pgm = '2024-03-01' order by pgm.data_vencimento_pgm, pgm.id_pss";

  const { data } = UseApiData({ query });

  const costCenterSummaries: costCenterSummary[] = [];

  // Processar dados para cálculos de resumo
  data.forEach((payment) => {
    const amount = Number(payment.VALOR_PGM.replace(",", "."));
    const supplier = String(payment.NOME_PSS);
    const { CENTRO_CUSTO, NOME_PSS } = payment;

    // Verificar se a descrição já existe no costCenterSummary
    const existingItem = costCenterSummaries.find(
      (item) => item.description === CENTRO_CUSTO
    );

    if (existingItem) {
      existingItem.value += amount;
      if (!existingItem.suppliers.includes(supplier)) {
        existingItem.suppliers.push(supplier);
      }
    } else {
      costCenterSummaries.push({
        description: CENTRO_CUSTO,
        value: amount,
        suppliers: [supplier],
      });
    }
  });

  // Aplicar o filtro de seleção, se houver algum filtro ativo
  let filteredCostCenters = costCenterSummaries;
  if (filters.length > 0) {
    filteredCostCenters = costCenterSummaries.filter((item) =>
      filters.some((filter) => filter.description === item.description)
    );
  }

  // Ordenar os resultados finais filtrados
  const topCostCenters = filteredCostCenters
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Não filtrar descriptionCostCenter diretamente, apenas usá-lo para calcular os topCostCenterDescription
  const topCostCenterDescriptions = costCenterSummaries
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return { topCostCenters, topCostCenterDescriptions };
};
