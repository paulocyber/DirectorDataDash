// Biblioteca
import { TbMoneybag } from "react-icons/tb";
import { GiPayMoney } from "react-icons/gi";
import { CiWarning } from "react-icons/ci";
import { useRecoilValue } from "recoil";

// Mascara
import { formatCurrency } from "../mask/moneyMask";
import { RiVerifiedBadgeFill } from "react-icons/ri";

// Atom
import { filterDescription } from "@/atom/FilterDescription";
import { useRouter } from "next/router";

// tipgaem
interface BillToPayItem {
  VALOR_PGM: string;
  CENTRO_CUSTO: string;
  VALOR_PAGO_PGM: string;
  NOME_PSS: string;
}

interface BilletPaidAndInOpen {
  VALOR_PGM: string;
  CENTRO_CUSTO: string;
  NOME_PSS: string;
  STATUS_PGM: string;
  DATA_VENCIMENTO_PGM: string;
  DESCRICAO_PGM: string;
  GRUPO_CENTRO: string;
  NUMERO_DOCUMENTO_PGM: string;
  DESCRICAO_FRM: string;
}

interface ExpiredBillItem {
  RESTANTE_PGM: string;
  CENTRO_CUSTO: string;
}

type BillsToPayProps = {
  listBilletPaid: BillToPayItem[];
  listBilletInOpen: BillToPayItem[];
  listBilletPaidAndInOpen: BilletPaidAndInOpen[];
  listBilletExpired?: ExpiredBillItem[];
  filteredItems?: BilletPaidAndInOpen[];
};

const convertCurrencyToNumber = (value: string) => {
  return Number(value.replace(",", "."));
};

// Função para calcular o total de um array de boletos
const calculateTotal = (boletos: any[], valueField: string) => {
  return boletos.reduce((total, boleto) => {
    return total + convertCurrencyToNumber(boleto[valueField]);
  }, 0);
};

export default function getBillsToPay({
  listBilletInOpen,
  listBilletPaid,
  listBilletPaidAndInOpen,
  listBilletExpired,
  filteredItems,
}: BillsToPayProps) {
  const filterSelect = useRecoilValue(filterDescription);

  // Rotas
  const router = useRouter();

  const secoundPart = router.pathname.split("/")[2];
  const routerTable = secoundPart === "table";

  const filteredOpenBillets =
    filterSelect.length === 0
      ? listBilletInOpen
      : listBilletInOpen.filter((billet) =>
          listBilletInOpen.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
          )
        );

  const filteredOpenBilletsTable = listBilletInOpen.filter((billet) =>
    filteredItems?.some(
      (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
    )
  );

  const filteredPaidBillet =
    filterSelect.length === 0
      ? listBilletPaid
      : listBilletPaid.filter((billet) =>
          filterSelect.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.description
          )
        );

  const filteredPaidBilletsTable = listBilletPaid.filter((billet) =>
    filteredItems?.some(
      (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
    )
  );

  const filteredExpiredBillet =
    filterSelect.length === 0
      ? listBilletExpired
      : listBilletExpired?.filter((billet) =>
          filterSelect.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.description
          )
        );

  const filteredxpiredBilletsTable = listBilletExpired?.filter((billet) =>
    filteredItems?.some(
      (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
    )
  );

  const totalAmountInOpen = routerTable
    ? calculateTotal(filteredOpenBilletsTable, "VALOR_PGM")
    : calculateTotal(filteredOpenBillets, "VALOR_PGM");

  const totalAmountDue = routerTable 
  ? calculateTotal(filteredxpiredBilletsTable || [],"RESTANTE_PGM")
  : calculateTotal(filteredExpiredBillet || [],"RESTANTE_PGM")

  const totalAmountPaid = routerTable
    ? calculateTotal(filteredPaidBilletsTable, "VALOR_PAGO_PGM")
    : calculateTotal(filteredPaidBillet, "VALOR_PAGO_PGM");

  const infoDetailCard = [
    {
      icon: TbMoneybag,
      title: "Valor total em aberto",
      value: formatCurrency(totalAmountInOpen),
    },
    {
      icon: CiWarning,
      title: "Valor Total de Boletos Vencidos",
      value: formatCurrency(totalAmountDue || 0),
    },
    {
      icon: GiPayMoney,
      title: "Total de boletos pagos",
      value: formatCurrency(totalAmountPaid),
    },
    {
      icon: RiVerifiedBadgeFill,
      title: "Total de boletos pagos",
      value: routerTable ? filteredPaidBilletsTable.length.toString() : filteredPaidBillet.length.toString(),
    },
  ];

  return { infoDetailCard };
}
