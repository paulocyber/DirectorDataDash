// Utils
import { calculateTotalByKey } from "@/utils/functions/sumValues";

// Biblioteca
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { truncateString } from "@/utils/mask/trucanteString";

// Tipagem
import { ItemsDavData } from "@/types/dav";

interface InfoCardFromDavProps {
    davs: ItemsDavData[];
    detail?: boolean;
}

export default function InfoCardFromDav({ davs, detail }: InfoCardFromDavProps) {
    const grossValue = calculateTotalByKey(davs, (item) => item.VALOR_BRUTO_SDS)
    const netValue = calculateTotalByKey(davs, (item) => item.VALOR_LIQUIDO_TOTAL)
    let client = ""

    davs.forEach((items) => {
        client = items.CLIENTE;
    });

    const infoDetailCard = [
        {
            icon: <FaMoneyBillTrendUp className="w-5 h-5 text-white" />,
            title: "Total de vendas bruto",
            value: formatCurrency(grossValue),
        },
        {
            icon: <MdAttachMoney className="w-5 h-5 text-white" />,
            title: "Total de vendas liquido",
            value: formatCurrency(netValue),
        },
        {
            icon: detail ? <IoIosPeople className="w-5 h-5 text-white" /> : < IoIosPeople className="w-5 h-5 text-white" />,
            title: detail ? "Nome da pessoa" : "Total de clientes atendidos",
            value: detail ? truncateString(client, 30) : String(davs.length),
        }
    ]

    return infoDetailCard
}