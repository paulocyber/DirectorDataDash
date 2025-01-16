// Next
import { cookies } from "next/headers"
import { Metadata } from "next"

// Biblioteca
import { setupApiClient } from "@/services/api"

// Componentes
import LayoutCustomer from "@/components/layouts/lateCustomer"

// Utils
import getCurrentDateDetails from "@/utils/getDate"
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive"

export const metadata: Metadata = {
    title: "Relatório de clientes atrasados",
    description: "Informações sobre clientes em atrasos",
};

export default async function SellerPage() {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@nextauth.token')?.value

    const api = setupApiClient(token)
    const user = await api.post('/v1/auth/validate', { token })

    const { today } = getCurrentDateDetails()
    const { billsToReceiveInOpen } = billsToReceiveQueries({ dateInit: `2023/01/01`, dateEnd: today, sellerSurname: user.data.returnObject.body.username })
    const { billsToReceiveInOpen: billsToReceiveLate } = billsToReceiveQueries({ dateInit: `2023/01/01`, dateEnd: today, sellerSurname: user.data.returnObject.body.username })

    const [openBillsData, overdueBills] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveInOpen }),
        api.post("/v1/find-db-query", { query: billsToReceiveLate }),
    ])

    return (
        <LayoutCustomer
            openBills={openBillsData.data.returnObject.body}
            overdueBills={overdueBills.data.returnObject.body}
            today={today}
        />
    )
}