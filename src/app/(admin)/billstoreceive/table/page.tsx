// Next - Framework
import { cookies } from "next/headers";

// Dados
import InFoCardFromBillsToReceive from "@/data/infoCard/billsToReceive";

// Componentes
import UiBillsToReceiveTable from "@/components/layouts/billsToReceive/table";

// Utils
import { setupApiClient } from "@/services/api";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import getDate from "@/utils/date/currentDate";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";

export default async function BillsToReceivePage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)

    const { yesterday, month, year, today } = getDate()
    const { billsToReceiveAll } = billsToReceiveQueries({ dateInit: `${year}/${month}/${yesterday}`, dateEnd: today })

    const [respBillsToReceive] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveAll })
    ])

    const lateBillsToReceive: BillsToReceiveData[] = respBillsToReceive.data.returnObject.body
    const infoCard = InFoCardFromBillsToReceive({ billsToReceiveData: respBillsToReceive.data.returnObject.body })

    const filterBillsToReceiveInOpen = lateBillsToReceive.filter((receive) =>
        (receive.STATUS_RCB === "1" || receive.STATUS_RCB === "4") &&
        parseInt(receive.ATRASO_RCB) === 0
    );
    const filterBillsToReceiveInPaid = lateBillsToReceive.filter((receive) => receive.STATUS_RCB === "2")

    return (
        <UiBillsToReceiveTable
            infoCardData={infoCard}
            receiveData={respBillsToReceive.data.returnObject.body}
            receiptsInOpenData={filterBillsToReceiveInOpen}
            receiptsInPayedData={filterBillsToReceiveInPaid}
            year={year}
            month={month}
            yesterday={yesterday}
            today={today}
        />
    )
}