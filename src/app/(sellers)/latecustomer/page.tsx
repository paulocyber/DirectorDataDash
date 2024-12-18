// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getDate from "@/utils/date/currentDate";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import getUserName from "@/utils/data/getUser";

// Componentes
import UiLateCustomer from "@/components/layouts/LateCustomerPageUi";

// Next Framework
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Relatório de clientes atrasados",
    description: "Informações sobre clientes em atrasos",
};

export default async function LateCustomerPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string);

    const { year, month, yesterday } = getDate()
    const seller = await getUserName(token as string)
    const { billsToReceiveInOpen } = billsToReceiveQueries({ dateInit: `${year}/${month}/01`, dateEnd: `${year}/${month}/${yesterday}`, sellersSurname: seller })
    const { billsToReceiveInOpen: billsToReceiveLate } = billsToReceiveQueries({ dateInit: `${year}/01/01`, dateEnd: `${year}/${month}/${yesterday}`, sellersSurname: seller })

    const [respReceiveInOpen, respReceiveLate] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveInOpen }),
        api.post("/v1/find-db-query", { query: billsToReceiveLate })
    ])

    return (
        <UiLateCustomer dataReceiveInOpen={respReceiveInOpen.data.returnObject.body} year={year} month={month} yesterday={yesterday} dataReceiveLate={respReceiveLate.data.returnObject.body} />
    )
}