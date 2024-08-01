// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";

export default function SearchBillsToPay(
  data: BillsToPayItem[],
  searchFilter: string
) {
  const filterSearch = data.filter((billet) => {
    return (
      billet.DATA_VENCIMENTO_PGM.toLowerCase().includes(
        searchFilter.toLowerCase()
      ) ||
      billet.VALOR_PGM.toString()
        .toLowerCase()
        .includes(searchFilter.toLowerCase()) ||
      billet.NUMERO_DOCUMENTO_PGM.toLowerCase().includes(
        searchFilter.toLowerCase()
      ) ||
      billet.GRUPO_CENTRO.toLowerCase().includes(searchFilter.toLowerCase()) ||
      billet.NOME_PSS.toLowerCase().includes(searchFilter.toLowerCase()) ||
      billet.CENTRO_CUSTO.toLowerCase().includes(searchFilter.toLowerCase()) ||
      billet.DESCRICAO_FRM.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return filterSearch;
}
