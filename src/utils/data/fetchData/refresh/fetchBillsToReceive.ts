// React
import { ReactNode } from "react";

// Utils
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { fetchData } from "..";
import { TotalSum } from "@/utils/functionSum";

// Data
import InFoCardFromBillsToReceive from "@/data/infoCard/billsToReceive";

// Tipagem
interface FetchBillsToReceiveProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  setInfoCard: (
    data: { icon: ReactNode; title: string; value: string }[]
  ) => void;
  setBillsToReceive: (data: { name: string; value: number }[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchBillsToReceive({
  token,
  dateInit,
  dateEnd,
  setBillsToReceive,
  setInfoCard,
  setLoading,
}: FetchBillsToReceiveProps) {
  setLoading(true);

  const { billsToReceiveAll } = billsToReceiveQueries({ dateInit, dateEnd });

  let billsToReceive: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: billsToReceiveAll,
      setData: (data) => (billsToReceive = data),
    }),
  ];

  await Promise.all(queries);

  const infoCard = InFoCardFromBillsToReceive({
    billsToReceiveData: billsToReceive,
  });

  const filterBillsToReceiveInLate = billsToReceive.filter(
    (receive) =>
      (receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4") &&
      parseInt(receive.ATRASO_RCB) > 0
  );
  const filterBillsToReceiveInOpen = billsToReceive.filter(
    (receive) =>
      (receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4") &&
      parseInt(receive.ATRASO_RCB) === 0
  );
  const filterBillsToReceiveInPaid = billsToReceive.filter(
    (receive) => receive.STATUS_RCB === "2"
  );

  const valueInLate = TotalSum(filterBillsToReceiveInLate, "RESTANTE_RCB");
  const valueInOpen = TotalSum(filterBillsToReceiveInOpen, "RESTANTE_RCB");
  const totalPaid = TotalSum(filterBillsToReceiveInPaid, "VALOR_PAGO_RCB");

  const billsToReceiveData = [
    { name: "Valor em atraso", value: valueInLate },
    { name: "Valor em aberto", value: valueInOpen },
    { name: "Valor recebido", value: totalPaid },
  ];

  setBillsToReceive(billsToReceiveData);
  setInfoCard(infoCard);
  setLoading(false);
}
