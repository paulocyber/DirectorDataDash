// Next
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Biblioteca
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToPayQueries } from "@/utils/queries/billstoPay";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";

// Componentes
import LayoutBillsToPay from "@/components/layouts/billsToPay";

export const metadata: Metadata = {
    title: "Relatório das Contas a Pagar",
    description: "Relatório Detalhado das Contas a Pagar",
};

export default async function BillsToPayPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    if(!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    const api = setupApiClient(token)

    const { year, month, today, yesterday } = getCurrentDateDetails()
    const { allBillet } = billsToPayQueries({ dateInit: `${year}/${month}/01`, dateEnd: today })
    const { expiredBillet } = billsToPayQueries({ dateInit: `${year}/01/01`, dateEnd: yesterday })

    const [allBillsResponse, overdueBillsResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: allBillet }),
        api.post("/v1/find-db-query", { query: expiredBillet })
    ])

    const openBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToPay) => bill.STATUS_PGM === "1" || bill.STATUS_PGM === "4"
    );
    const paidBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToPay) => bill.STATUS_PGM === "2"
    );

    return (
        <LayoutBillsToPay
            allBilletsData={allBillsResponse.data.returnObject.body}
            openBillsData={openBills}
            paidBillsData={paidBills}
            overdueBillsData={overdueBillsResponse.data.returnObject.body}
            year={year}
            month={month}
        />
    )
}