// MetaDados
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { StockQueries } from "@/utils/queries/stock";

// Utils
import { suppliersQueries } from "@/utils/queries/suppliers";

// Next
import { redirect } from "next/navigation";

// Componetes
import LayoutEntriesXSalesPage from "@/components/layouts/salesByBrand/entriesXSales";

export const metadata: Metadata = {
    title: "Vendas x Estoque em valor",
    description: "Relatório de vendas por marcas e Stock",
};

export default async function EntriesXSalesPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const api = setupApiClient(token as string)
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    const { today, year, month } = getCurrentDateDetails()
    const { entriesXExits, buyHistory } = StockQueries({ dateInit: `${year}/01/01`, dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })
    const suppliers = suppliersQueries()

    if (!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    const [responseEntries, responseBuyHistory, responseSuppliers] = await Promise.all([
        api.post("/v1/find-db-query", { query: entriesXExits }),
        api.post("/v1/find-db-query", { query: buyHistory }),
        api.post("/v1/find-db-query", { query: suppliers }),
    ])

    const entries = responseEntries.data.returnObject.body;
    const buys = responseBuyHistory.data.returnObject.body;

    const mergedData = entries.map((entry: any[]) => {
        const matchedBuy = buys.find((buy: any[]) => (buy as any).ID_PRD === (entry as any).ID_PRD);
        return matchedBuy
            ? { ...entry, PRECO_UNITARIO: matchedBuy.PRECO_VENDA }
            : entry;
    });

    return (
        <LayoutEntriesXSalesPage
            entriesSalesData={mergedData}
            suppliers={responseSuppliers.data.returnObject.body}
            dateInit={`${year}/01/01`}
            dateEnd={today}
        />
    )
}
