// Bibliotecas
import { TbMoneybag } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { GiPayMoney } from "react-icons/gi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useRecoilValue } from "recoil";

// Utils
import { TotalSum } from "@/utils/totalSum";
import { formatCurrency } from "@/utils/masks/formatCurrency";

// Atom
import { filterDescription } from "@/atom/FilterDescription";

// Framework - next
import { useRouter } from "next/router";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
interface InfoCardFromBillsToPayProps {
  listBilletInOpen: BillsToPayItem[];
  listBilletPaid: BillsToPayItem[];
  listBilletExpired: BillsToPayItem[];
  filterSearch?: BillsToPayItem[];
}

export function InfoCardFromBillsToPay({
  listBilletExpired,
  listBilletInOpen,
  listBilletPaid,
  filterSearch,
}: InfoCardFromBillsToPayProps) {
  const filterSelect = useRecoilValue(filterDescription);

  // Rotas
  const router = useRouter();

  const secoundPart = router.pathname.split("/")[2];
  const routerTable = secoundPart === "table";

  // Filtro de selecao
  const filteredOpenBillets =
    filterSelect.length === 0
      ? listBilletInOpen
      : listBilletInOpen.filter((billet) =>
          filterSelect.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.description
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

  const filteredExpiredBillet =
    filterSelect.length === 0
      ? listBilletExpired
      : listBilletExpired.filter((billet) =>
          filterSelect.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.description
          )
        );

  // Filtro de pesquisa
  const searchOpenBillets = listBilletInOpen.filter((billet) =>
    filterSearch?.some(
      (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
    )
  );

  const searchPaidBillets = listBilletPaid.filter((billet) =>
    filterSearch?.some(
      (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
    )
  );

  const searchExpiredBillets = listBilletExpired.filter((billet) =>
    filterSearch?.some(
      (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
    )
  );

  const totalAmountInOpen = routerTable
    ? TotalSum(searchOpenBillets, "VALOR_PGM")
    : TotalSum(filteredOpenBillets, "VALOR_PGM");
  const totalAmountExpired = routerTable
    ? TotalSum(searchExpiredBillets, "RESTANTE_PGM")
    : TotalSum(filteredExpiredBillet, "RESTANTE_PGM");
  const totalAmountPaid = routerTable
    ? TotalSum(searchPaidBillets, "VALOR_PAGO_PGM")
    : TotalSum(filteredPaidBillet, "VALOR_PAGO_PGM");

  const total = searchPaidBillets.length.toString();

  const infoDetailCard = [
    {
      icon: TbMoneybag,
      title: "Valor total em aberto",
      value: formatCurrency(totalAmountInOpen),
    },
    {
      icon: CiWarning,
      title: "Valor Total de Boletos Vencidos",
      value: formatCurrency(totalAmountExpired),
    },
    {
      icon: GiPayMoney,
      title: "Total de boletos pagos",
      value: formatCurrency(totalAmountPaid),
    },
    {
      icon: RiVerifiedBadgeFill,
      title: "Total de boletos pagos",
      value: routerTable
        ? searchPaidBillets.length.toString()
        : filteredPaidBillet.length.toString(),
    },
  ];

  return {
    infoDetailCard,
    totalAmountInOpen,
    totalAmountExpired,
    totalAmountPaid,
    total,
  };
}
