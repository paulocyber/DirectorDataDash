// MetaDados
import { Metadata } from "next";
import { cookies } from "next/headers";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { StockQueries } from "@/utils/queries/stock";
import { salesQueries } from "@/utils/queries/sales";
import { formatCurrency } from "@/utils/mask/money";

// Componetes
import LayoutEntriesXSalesPage from "@/components/layouts/salesByBrand/entriesXSales/page";
import MainTence from "@/components/ui/maintenance";

export const metadata: Metadata = {
    title: "Vendas x Estoque em valor",
    description: "Relatório de vendas por marcas e Stock",
};

export default async function EntriesXSalesPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const api = setupApiClient(token as string)

    const { today, year } = getCurrentDateDetails()
    const { buyHistory } = StockQueries({ dateInit: `${year}/01/01`, dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })
    const { sellHistory } = salesQueries({ dateInit: `${year}/01/01`, dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })

    const [responseBuyHistory, responseSellHistory] = await Promise.all([
        api.post("/v1/find-db-query", { query: buyHistory }),
        api.post("/v1/find-db-query", { query: sellHistory }),
    ])

    const entriesXSales = responseBuyHistory.data.returnObject.body
        .map((buyHistory: any) => {
            const matched = responseSellHistory.data.returnObject.body.find(
                (sellHistory: any) => sellHistory.ID_PRD === buyHistory.ID_PRD
            );

            return {
                ...buyHistory,
                sellValue: matched ? formatCurrency(matched.VALOR_FINAL) : formatCurrency(0),
            };
        });

    return (
        // <LayoutEntriesXSalesPage entriesSalesData={entriesXSales} />
        <MainTence />
    )
}
