// Next
import { Metadata } from "next";
import { cookies } from 'next/headers';

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";

// Componentes
import LayoutCustomer from "@/components/layouts/lateCustomer";

export const metadata: Metadata = {
    title: "Relatório de clientes atrasados",
    description: "Informações sobre clientes em atrasos",
};

export default async function LateCustomerPage() {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@nextauth.token')?.value

    const api = setupApiClient(token)

    const { year, today, yesterday } = getCurrentDateDetails()
    const { billsToReceiveInOpen } = billsToReceiveQueries({ dateInit: `2023/01/01`, dateEnd: today })
    const { billsToReceiveInOpen: billsToReceiveLate } = billsToReceiveQueries({ dateInit: `2023/01/01`, dateEnd: yesterday, })

    const [openBillsData, overdueBills] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveInOpen }),
        api.post("/v1/find-db-query", { query: billsToReceiveLate }),
    ])

    console.log("Query servidor: ", billsToReceiveInOpen)

    return (
        <LayoutCustomer
            openBills={openBillsData.data.returnObject.body}
            overdueBills={overdueBills.data.returnObject.body}
            today={today}
            admin={true}
        />
    )
} 