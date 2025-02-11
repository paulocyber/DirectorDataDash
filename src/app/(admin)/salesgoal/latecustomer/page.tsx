// Next
import { Metadata } from "next";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { companyQueries } from "@/utils/queries/employees";

// Componentes
import LayoutCustomer from "@/components/layouts/lateCustomer";
import { employeesQueries } from "@/utils/queries/people";

export const metadata: Metadata = {
    title: "Relatório de clientes atrasados",
    description: "Informações sobre clientes em atrasos",
};

export default async function LateCustomerPage() {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@nextauth.token')?.value
    const role = (await cookieStore).get('@nextauth.role')?.value || "";
    
    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    const api = setupApiClient(token)

    const { year, today, yesterday } = getCurrentDateDetails()
    const employees = employeesQueries()
    const { billsToReceiveInOpen } = billsToReceiveQueries({ dateInit: `2023/01/01`, dateEnd: today })
    const { billsToReceiveInOpen: billsToReceiveLate } = billsToReceiveQueries({ dateInit: `2023/01/01`, dateEnd: yesterday, })

    const [openBillsData, overdueBills, responseCompany] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveInOpen }),
        api.post("/v1/find-db-query", { query: billsToReceiveLate }),
        api.post("/v1/find-db-query", { query: employees }),
    ])

    return (
        <LayoutCustomer
            openBills={openBillsData.data.returnObject.body}
            overdueBills={overdueBills.data.returnObject.body}
            employeesData={responseCompany.data.returnObject.body}
            today={today}
            admin={true}
        />
    )
} 