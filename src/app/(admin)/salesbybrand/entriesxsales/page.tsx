// MetaDados
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { StockQueries } from "@/utils/queries/stock";
import { salesQueries } from "@/utils/queries/sales";

// Dados
import InfoCardFromEntriesXSales from "@/data/infoCards/entriesXSales";

// Utils
import { suppliersQueries } from "@/utils/queries/suppliers";

// Componetes
import LayoutEntriesXSalesPage from "@/components/layouts/salesByBrand/entriesXSales";
import MainTence from "@/components/ui/maintenance";

export const metadata: Metadata = {
    title: "Vendas x Estoque em valor",
    description: "Relatório de vendas por marcas e Stock",
};

export default async function EntriesXSalesPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const api = setupApiClient(token as string)

    const { today, year, month } = getCurrentDateDetails()
    const { buyHistory } = StockQueries({ dateInit: `${year}/01/01`, dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })
    const { sellHistory } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })
    const suppliers = suppliersQueries()

    const [responseBuyHistory, responseSellHistory, responseSuppliers] = await Promise.all([
        api.post("/v1/find-db-query", { query: buyHistory }),
        api.post("/v1/find-db-query", { query: sellHistory }),
        api.post("/v1/find-db-query", { query: suppliers }),
    ])

    const entriesXSales = responseBuyHistory.data.returnObject.body
        .map((buyHistory: any) => {
            const matched = responseSellHistory.data.returnObject.body.find(
                (sellHistory: any) => sellHistory.ID_PRD === buyHistory.ID_PRD
            );

            return {
                ...buyHistory,
                VALOR_LIQUIDO: matched?.VALOR_LIQUIDO || 0,
                VALOR_VENDA: matched?.VALOR_FINAL || '0',
            };
        });

    return (
        <LayoutEntriesXSalesPage entriesSalesData={entriesXSales} suppliers={responseSuppliers.data.returnObject.body} dateInit={`${year}/01/01`} dateEnd={`${year}/${month}/01`} />
    )
}
