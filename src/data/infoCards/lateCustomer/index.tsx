// Bibliotecas
import { GiTakeMyMoney } from 'react-icons/gi';
import { IoIosPeople } from 'react-icons/io';
import { ImWarning } from 'react-icons/im';

// Utils
import { formatCurrency } from '@/utils/mask/money';
import { calculateTotalByKey } from '@/utils/functions/sumValues';

// Tipagem
import { ItemsBillsToReceiveData } from '@/types/billsToReceive';
interface InfoCardFromLateCustomerProps {
    openBillsData: ItemsBillsToReceiveData[];
    overdueBillsData: ItemsBillsToReceiveData[];
}

export default function InfoCardFromLateCustomer({ openBillsData, overdueBillsData }: InfoCardFromLateCustomerProps) {
    const totalOutstanding = calculateTotalByKey(openBillsData, (item) => item.RESTANTE_RCB);
    const totalPaymentsReceived = calculateTotalByKey(openBillsData, (item) => item.VALOR_PAGO_RCB);
    const totalOverdueClients = overdueBillsData.length.toString();

    const infoCard = [
        {
            icon: <ImWarning className="w-5 h-5 text-white" />,
            title: "Total de Valores Atrasados",
            value: formatCurrency(totalOutstanding)
        },
        {
            icon: <GiTakeMyMoney className="w-5 h-5 text-white" />,
            title: "Total de Pagamentos Realizados",
            value: formatCurrency(totalPaymentsReceived)
        },
        {
            icon: <IoIosPeople className="w-5 h-5 text-white" />,
            title: "Número Total de Clientes Atrasados",
            value: totalOverdueClients
        }
    ]

    return infoCard
}