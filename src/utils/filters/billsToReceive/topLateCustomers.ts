// Utils
import { convertStringToNumber } from "./../../masks/convertStringToNumber";
import { formatCurrency } from "@/utils/masks/formatCurrency";

// Tipagem
import { BillsToReceiveItem } from "@/utils/types/billsToReceive";

export function TopLateCustomers({
  lateBills,
}: {
  lateBills: BillsToReceiveItem[];
}) {
  // Ordenar as contas por atraso e pegar as 10 mais atrasadas
  const topLateBills = lateBills
    .sort((a, b) => parseInt(b.ATRASO_RCB) - parseInt(a.ATRASO_RCB))
    .slice(0, 10);

  // Agrupar as contas por vendedor e cliente, e calcular valores totais
  const groupedBySeller = topLateBills.reduce((acc, bill) => {
    const seller = bill.APELIDO_VENDEDOR;
    const client = bill.APELIDO_FANTASIA_CLIENTE === '' ? bill.CLIENTE : bill.APELIDO_FANTASIA_CLIENTE;

    if (!acc[seller]) {
      acc[seller] = {};
    }

    if (!acc[seller][client]) {
      acc[seller][client] = {
        remainingValue: 0,
        lateDay: 0,
      };
    }

    acc[seller][client].remainingValue += convertStringToNumber(
      bill.VALORES_RESTANTE
    );
    acc[seller][client].lateDay += parseInt(bill.ATRASO_RCB);

    return acc;
  }, {} as Record<string, Record<string, { remainingValue: number; lateDay: number }>>);

  // Transformar o objeto agrupado em um array com formatação de valores
  const lateCustomers = Object.keys(groupedBySeller).map((seller) => {
    const clientsArray = Object.keys(groupedBySeller[seller]).map((client) => ({
      name: client,
      remainingValue: groupedBySeller[seller][client].remainingValue,
      lateDay: groupedBySeller[seller][client].lateDay,
    }));

    return {
      description: seller,
      clients: clientsArray,
    };
  });

  return lateCustomers;
}
