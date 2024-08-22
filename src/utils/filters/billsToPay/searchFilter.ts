// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";

export function SearchFilter(data: BillsToPayItem[], search: string) {
  const filterSearch = data.filter((billet) => {
    return (
      billet.DATA_VENCIMENTO_PGM.toLowerCase().includes(search.toLowerCase()) ||
      billet.VALOR_PGM.toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      billet.NUMERO_DOCUMENTO_PGM.toLowerCase().includes(
        search.toLowerCase()
      ) ||
      billet.GRUPO_CENTRO.toLowerCase().includes(search.toLowerCase()) ||
      billet.NOME_PSS.toLowerCase().includes(search.toLowerCase()) ||
      billet.CENTRO_CUSTO.toLowerCase().includes(search.toLowerCase()) ||
      billet.DESCRICAO_FRM.toLowerCase().includes(search.toLowerCase())
    );
  });

  return filterSearch
}
