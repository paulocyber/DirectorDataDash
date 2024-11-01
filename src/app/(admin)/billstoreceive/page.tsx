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
import { convertToNumeric } from "@/utils/convertToNumeric";

// Tipagem
import { BillsToReceiveData } from '@/types/billsToReceive';

export default async function BillsToReceivePage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { yesterday, monthExpired, month, year, today } = getDate()

    const { billsToReceiveAll: billsToReceiveLate, topClientLate } = billsToReceiveQueries({ dateInit: `${year}/${monthExpired}/${yesterday}`, dateEnd: today, year })

    const [respReceiveLate, respTopClientLate] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveLate }),
        api.post("/v1/find-db-query", { query: topClientLate })
    ])

    const lateBillsToReceive: BillsToReceiveData[] = respReceiveLate.data.returnObject.body
    const infoCard = InFoCardFromBillsToReceive({ billsToReceiveData: lateBillsToReceive })

    const filterBillsToReceiveInLate = lateBillsToReceive.filter((receive) =>
        (receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4") &&
        parseInt(receive.ATRASO_RCB) > 0
    );
    const filterBillsToReceiveInOpen = lateBillsToReceive.filter((receive) =>
        (receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4") &&
        parseInt(receive.ATRASO_RCB) === 0
    );
    const filterBillsToReceiveInPaid = lateBillsToReceive.filter((receive) => receive.STATUS_RCB === "2")

    const valueInLate = TotalSum(filterBillsToReceiveInLate, "RESTANTE_RCB")
    const valueInOpen = TotalSum(filterBillsToReceiveInOpen, "RESTANTE_RCB")
    const totalPaid = TotalSum(filterBillsToReceiveInPaid, "VALOR_PAGO_RCB")

    const billsToReceiveData = [
        { name: "Valor em atraso", value: valueInLate },
        { name: "Valor em aberto", value: valueInOpen },
        { name: "Valor recebido", value: totalPaid }
    ]

    const topClientsLate = convertToNumeric<BillsToReceiveData>(
        respTopClientLate.data.returnObject.body,
        ['RESTANTE_RCB']
    ).sort((a, b) => parseInt(b.RESTANTE_RCB) - parseInt(a.RESTANTE_RCB))

    return (
        <UiBillsToReceive
            infoCardData={infoCard}
            billsToReceiveData={billsToReceiveData}
            year={year}
            month={monthExpired}
            yesterday={yesterday}
            today={today}
            clientsLate={topClientsLate}
        />
    )
}