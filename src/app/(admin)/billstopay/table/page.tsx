// Next
import { cookies } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToPayQueries } from "@/utils/queries/billstoPay";

// Componentes
import LayoutBillsToPayTable from "@/components/layouts/billsToPay/table";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";

export const metadata: Metadata = {
    title: "Relatório das Contas a Pagar",
    description: "Relatório Detalhado das Contas a Pagar",
};

export default async function BillsToPayTablePage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    const api = setupApiClient(token)

    const { year, month, today, yesterday } = getCurrentDateDetails()
    const { allBillet, billetPaid } = billsToPayQueries({ dateInit: `${year}/${month}/01`, dateEnd: today })
    const { expiredBillet } = billsToPayQueries({ dateInit: `${year}/01/01`, dateEnd: yesterday })

    const [allBillsResponse, overdueBillsResponse, paidBillsResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: allBillet }),
        api.post("/v1/find-db-query", { query: expiredBillet }),
        api.post("/v1/find-db-query", { query: billetPaid })
    ])

    const openBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToPay) => bill.STATUS_PGM === "1"
    );

    return (
        <LayoutBillsToPayTable
            allBilletsData={allBillsResponse.data.returnObject.body}
            openBillsData={openBills}
            paidBillsData={paidBillsResponse.data.returnObject.body}
            overdueBillsData={overdueBillsResponse.data.returnObject.body}
            year={year}
            month={month}
        />
    )
}