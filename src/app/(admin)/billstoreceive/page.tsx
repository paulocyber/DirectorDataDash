// Bibliotecas
import { setupApiClient } from "@/services/api";

// Next - framework
import { cookies } from "next/headers";

// Dados
import InFoCardFromBillsToReceive from "@/data/infoCard/billsToReceive";

// Componentes
import UiBillsToReceive from "@/components/layouts/billsToReceive";

// Utils
import getDate from "@/utils/date/currentDate";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { TotalSum } from "@/utils/functionSum";

// Tipagem
import { BillsToReceiveData } from '@/types/billsToReceive';

export default async function BillsToReceivePage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { yesterday, month, year } = getDate()

    const { billsToReceiveAll: billsToReceiveLate } = billsToReceiveQueries({ dateInit: `${year}/${month}/${yesterday}`, dateEnd: `${year}/${month}/${yesterday}` })

    const [respReceiveLate] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveLate })
    ])

    const lateBillsToReceive: BillsToReceiveData[] = respReceiveLate.data.returnObject.body
    const infoCard = InFoCardFromBillsToReceive({ billsToReceiveData: lateBillsToReceive })

    const filterBillsToReceiveInOpen = lateBillsToReceive.filter((receive) => receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4")
    const filterBillsToReceiveInPaid = lateBillsToReceive.filter((receive) => receive.STATUS_RCB === "2")

    const valueInOpen = TotalSum(filterBillsToReceiveInOpen, "RESTANTE_RCB")
    const valuePartiallyPaid = TotalSum(filterBillsToReceiveInOpen, "VALOR_PAGO_RCB")
    const totalPaid = TotalSum(filterBillsToReceiveInPaid, "VALOR_PAGO_RCB")
    
    const billsToReceiveData = [
        { name: "Valor em atraso", value: valueInOpen },
        { name: "Valor parcialmente pago", value: valuePartiallyPaid },
        { name: "Valor pago por total", value: totalPaid }
    ]

    return (
        <UiBillsToReceive infoCardData={infoCard} billsToReceiveData={billsToReceiveData} />
    )
}