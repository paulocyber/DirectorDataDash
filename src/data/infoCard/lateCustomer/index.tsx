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
    receiveInOpen: BillsToReceiveData[]
}

export default function InFoCardFromLateCustomer({ receiveInOpen }: InFoCardFromLateCustomerProps) {
    const totalRemainingAmount = TotalSum(receiveInOpen, "RESTANTE_RCB")
    const totalPaid = TotalSum(receiveInOpen, "VALOR_PAGO_RCB")
    const totalClientsLate = receiveInOpen.length

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
            value: totalClientsLate.toString()
        }
    ]

    return infoCard
}