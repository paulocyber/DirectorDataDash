// Bibliotecas
import { setupApiClient } from "@/services/api";

// Next - framework
import { cookies } from "next/headers";
import { Metadata } from "next";

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

export const metadata: Metadata = {
    title: "Relatório dos Contas a receber",
    description: "Informações o que tem a receber",
};

export default async function BillsToReceivePage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { year, monthExpired, yesterday, today } = getDate()

    const { billsToReceiveAll: billsToReceiveLate, topClientLate, summaryReceive } = billsToReceiveQueries({ dateInit: `${year}/${monthExpired}/${yesterday}`, dateEnd: today, year })

    const [respReceiveLate, respTopClientLate, respSummaryReceive] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveLate }),
        api.post("/v1/find-db-query", { query: topClientLate }),
        api.post("/v1/find-db-query", { query: summaryReceive }),
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
    const filterBillsToReceiveInPaid = lateBillsToReceive.filter((receive) => receive.STATUS_RCB === "2" || receive.STATUS_RCB === "4")

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
            summaryReceive={respSummaryReceive.data.returnObject.body}
            year={year}
            month={monthExpired}
            yesterday={yesterday}
            today={today}
            clientsLate={topClientsLate}
        />
    )
}