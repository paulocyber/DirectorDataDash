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
    const { yesterday, month } = getDate()

    const { billsToReceiveAll } = billsToReceiveQueries({ dateInit: `2024/${month}/${yesterday}`, dateEnd: `2024/${month}/${yesterday}` })

    const [respBillsToReceive] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveAll })
    ])

    const allBillsToReceive: BillsToReceiveData[] = respBillsToReceive.data.returnObject.body
    const infoCard = InFoCardFromBillsToReceive({ billsToReceiveData: allBillsToReceive })

    const filterBillsToReceiveInOpen = allBillsToReceive.filter((receive) => receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4")
    const filterBillsToReceiveInPaid = allBillsToReceive.filter((receive) => receive.STATUS_RCB === "2")

    const valueInOpen = TotalSum(filterBillsToReceiveInOpen, "RESTANTE_RCB")
    const valuePartiallyPaid = TotalSum(filterBillsToReceiveInOpen, "VALOR_PAGO_RCB")
    const totalPaid = TotalSum(filterBillsToReceiveInPaid, "VALOR_PAGO_RCB")

    const billsToReceiveData = [
        { name: "Valor em aberto", value: valueInOpen },
        { name: "Valor parcialmente pago", value: valuePartiallyPaid },
        { name: "Valor pago por total", value: totalPaid }
    ]
console.log("valores: ", billsToReceiveData)
    return (
        <UiBillsToReceive infoCard={infoCard} billsToReceiveData={billsToReceiveData} />
    )
}