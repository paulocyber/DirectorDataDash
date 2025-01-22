// Utils
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { GiTakeMyMoney } from "react-icons/gi";
import { ImWarning } from "react-icons/im";
import { IoIosPeople } from "react-icons/io";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface InFoCardFromBillsToReceiveProps {
    allBillsData: ItemsBillsToReceiveData[];
    filter?: { ID_PSS: string, NOME_PSS: string, APELIDO_PSS: string }[] | string[];
}

export default function InFoCardFromBillsToReceive({ allBillsData, filter }: InFoCardFromBillsToReceiveProps) {
    const openBills = allBillsData.filter((bill) => bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4");
    const paidBills = allBillsData.filter((bill) => bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4");

    const overdueBills = allBillsData.filter(
        (bill: ItemsBillsToReceiveData) =>
            (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
            parseInt(bill.ATRASO_RCB) > 0
    );

    const totalPendingAmount = calculateTotalByKey(overdueBills, (bill) => bill.RESTANTE_RCB);
    const totalOpenAmount = calculateTotalByKey(openBills, (bill) => bill.RESTANTE_RCB);
    const totalReceivedAmount = calculateTotalByKey(paidBills, (bill) => bill.VALOR_PAGO_RCB)
    const totalCompletedPayments = paidBills.length;

    const infoCardData = [
        {
            icon: <ImWarning className="w-5 h-5" />,
            title: "Total de Valores Pendentes",
            value: formatCurrency(totalPendingAmount),
        },
        {
            icon: <GiTakeMyMoney className="w-5 h-5" />,
            title: "Valor Total Recebido",
            value: formatCurrency(totalReceivedAmount),
        },
        {
            icon: <IoIosPeople className="w-5 h-5" />,
            title: filter?.length === 0 ? "Clientes com Pagamento Concluído" : "Valor que ainda falta a receber ",
            value: filter?.length === 0 ? totalCompletedPayments.toString() : formatCurrency(totalOpenAmount),
        },
    ];

    return infoCardData
}