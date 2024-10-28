// Utils
import { TotalSum } from "@/utils/functionSum";
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { ImWarning } from "react-icons/im";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";

interface InFoCardFromLateCustomerProps {
    receiveInOpen: BillsToReceiveData[];
    dataReceiveLate?: BillsToReceiveData[];
    admin?: boolean;
}

export default function InFoCardFromLateCustomer({ receiveInOpen, dataReceiveLate, admin }: InFoCardFromLateCustomerProps) {
    const totalRemainingAmount = TotalSum(receiveInOpen, "RESTANTE_RCB")
    const totalPaid = TotalSum(receiveInOpen, "VALOR_PAGO_RCB")
    const totalClientsLate = admin
        ? receiveInOpen.length.toString()
        : dataReceiveLate?.length?.toString() ?? "0";

    const infoCard = [
        {
            icon: <ImWarning className="w-5 h-5" />,
            title: "Total de Valores Atrasados",
            value: formatCurrency(totalRemainingAmount)
        },
        {
            icon: <GiTakeMyMoney className="w-5 h-5" />,
            title: "Total de Pagamentos Realizados",
            value: formatCurrency(totalPaid)
        },
        {
            icon: <IoIosPeople className="w-5 h-5" />,
            title: "Número Total de Clientes Atrasados",
            value: totalClientsLate
        }
    ]

    return infoCard
}