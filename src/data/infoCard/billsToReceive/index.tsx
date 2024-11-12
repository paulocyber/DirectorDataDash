// Utils
import { TotalSum } from "@/utils/functionSum";
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { ImWarning } from "react-icons/im";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";

interface InFoCardFromBillsToReceiveProps {
    billsToReceiveData: BillsToReceiveData[]
}

export default function InFoCardFromBillsToReceive({ billsToReceiveData }: InFoCardFromBillsToReceiveProps) {
    const filterBillsToReceiveInOpen = billsToReceiveData.filter((receive) => receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4")
    const filterBillsToReceiveInPaid = billsToReceiveData.filter((receive) => receive.STATUS_RCB === "2" || receive.STATUS_RCB === "4")

    const valueInOpen = TotalSum(filterBillsToReceiveInOpen, "RESTANTE_RCB")
    const valueReceive = TotalSum(filterBillsToReceiveInPaid, "VALOR_PAGO_RCB")
    const totalPaid = filterBillsToReceiveInPaid.length

    const infoCard = [
        {
            icon: <ImWarning className="w-5 h-5" />,
            title: "Total de Valores Pendentes",
            value: formatCurrency(valueInOpen)
        },
        {
            icon: <GiTakeMyMoney className="w-5 h-5" />,
            title: "Valor Total Recebido",
            value: formatCurrency(valueReceive)
        },
        {
            icon: <IoIosPeople className="w-5 h-5" />,
            title: "Clientes com Pagamento Concluído",
            value: totalPaid.toString()
        }
    ]

    return infoCard
}