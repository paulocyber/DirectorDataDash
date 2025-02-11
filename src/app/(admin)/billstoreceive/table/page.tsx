// Next
import { cookies } from "next/headers";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { PeopleQueries } from "@/utils/queries/people";

// Componentes
import LayoutBillsToReceiveTable from "@/components/layouts/billsToReceive/table";

// Next
import { Metadata } from "next";
import { redirect } from "next/navigation";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

export const metadata: Metadata = {
    title: "Relatório dos Contas a receber",
    description: "Informações o que tem a receber",
};

export default async function BillsToReceiveTablePage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";
    
    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    const api = setupApiClient(token as string)
    const { year, today } = getCurrentDateDetails()
    const people = PeopleQueries()
    const { billsToReceiveAll } = billsToReceiveQueries({ dateInit: '2023/01/01', dateEnd: today })

    const [allBillsResponse, peopleResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveAll }),
        api.post("/v1/find-db-query", { query: people }),
    ]);

    const openBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToReceiveData) =>
            (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4")
    );
    
    return (
        <LayoutBillsToReceiveTable
            allBillsData={allBillsResponse.data.returnObject.body}
            openBillsData={openBills}
            peopleData={peopleResponse.data.returnObject.body}
            today={today}
        />
    )
}