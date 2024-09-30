// Framework - next
import { Metadata } from "next";
import { cookies } from "next/headers";

// Biblioteca
import { setupApiClient } from "@/service/api";

// Utils
import getDate from "@/utils/currentDate";
import { billsToPayQueries } from "@/utils/queries/billstoPay";

// Dados
import InfoCardFromBillsToPay from "@/data/infoCard/billsToPay";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";

// Componentes
import Layout from "@/components/BillsToPay/Layout";

// MetasDados
export const metadata: Metadata = {
    title: "Relatório das Contas a Pagar",
    description: "Relatório Detalhado das Contas a Pagar",
};

export default async function BillsToPayPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { year, month, today, yesterday, monthExpired } = getDate()

    const { expiredBilletAll, billetPaidAndOpen } = billsToPayQueries({
        dateInit: `${year}/${month}/01`,
        dateEnd: today,
        year,
        month: monthExpired,
        day: yesterday,
    });

    const [respExpiredBillet, respBilletPaidAndOpen] = await Promise.all([
        api.post("/v1/find-db-query", { query: expiredBilletAll }),
        api.post("/v1/find-db-query", { query: billetPaidAndOpen }),
    ]);

    const allBillets: BillsToPayItem[] = respBilletPaidAndOpen.data.returnObject.body;
    const filterBilletInOpen = allBillets.filter((billet) => billet.STATUS_PGM === "1" || billet.STATUS_PGM === "4")
    const filterBilletPaid = allBillets.filter((billet) => billet.STATUS_PGM === "2")

    return (
        <Layout
            allBillets={allBillets}
            listBilletInOpen={filterBilletInOpen}
            listBilletPaid={filterBilletPaid}
            listOfExpiredInvoices={respExpiredBillet.data.returnObject.body}
            month={month}
            year={year}
            today={today}
            monthExpired={monthExpired}
            yesterday={yesterday}
        />
    )
}