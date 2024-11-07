// Next - Framework
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getDate from "@/utils/date/currentDate";
import { sellersQueries } from "@/utils/queries/employees/sellers";
import { goalsQueries } from "@/utils/queries/goals";
import { salesQueries } from "@/utils/queries/sales";
import { convertToNumeric } from "@/utils/convertToNumeric";
import { TotalSum } from "@/utils/functionSum";

// Componentes
import UiSales from './../../../components/layouts/salesUi/index';

// Tipagem
import { topClientsPlusBuyData, topSalesData } from "@/types/sales";

export const metadata: Metadata = {
    title: "Relatório de vendas",
    description: "Informações sobre vendas e metas",
};

export default async function SalesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string);
    const { year, month, today } = getDate();

    const { sales, topSellers, profitsFromSale } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, month, year, emp: "1" })
    const { sales: relatorySales } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, month, year, emp: "1, 2, 3" })
    const { topClientsPlusBuy } = salesQueries({ dateInit: today, dateEnd: today, emp: '1' })
    const { storeGoals, } = goalsQueries({ month, year, dateInit: `${year}/${month}/01`, emp: '1' })
    const { storeGoals: relatoryStoreGoals, } = goalsQueries({ month, year, dateInit: `${year}/${month}/01`, emp: '1, 2, 3' })
    const sellers = sellersQueries({ dateInit: `${year}/${month}/01` })

    const [respSales, respTopSellers, respGoals, respSellers, respTopClientBuy, respProfitFromSale, respRelatorySales, respRelatoryStoreGoals] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: topSellers }),
        api.post("/v1/find-db-query", { query: storeGoals }),
        api.post("/v1/find-db-query", { query: sellers }),
        api.post("/v1/find-db-query", { query: topClientsPlusBuy }),
        api.post("/v1/find-db-query", { query: profitsFromSale }),
        api.post("/v1/find-db-query", { query: relatorySales }),
        api.post("/v1/find-db-query", { query: relatoryStoreGoals }),
    ])

    const salesValue = respSales.data.returnObject?.body[0]?.VALOR_LIQUIDO ?
        TotalSum(respSales.data.returnObject?.body, 'VALOR_LIQUIDO') : 0

    const salesRelatory = TotalSum(respRelatorySales.data.returnObject.body, 'VALOR_LIQUIDO')
    const profitValueReport = TotalSum(respRelatorySales.data.returnObject.body, 'VALOR_LUCRO')

    const goalsRelatory = TotalSum(respRelatoryStoreGoals.data.returnObject.body, 'VALOR_MTA')

    const goalsValue = respGoals.data?.returnObject?.body[0]?.VALOR_MTA ?
        convertToNumeric(respGoals.data.returnObject?.body, ['VALOR_MTA'])[0].VALOR_MTA : 0;

    const salesProgress = [
        { name: "Vendas", value: salesValue },
        { name: "Metas", value: goalsValue }
    ]

    const progressSalesRelatory = [
        { name: "Vendas", value: salesRelatory },
        { name: "Lucro", value: profitValueReport },
        { name: "Meta grupo play", value: goalsRelatory }
    ]

    const formattedTopSeller = convertToNumeric<topSalesData>(
        respTopSellers.data.returnObject.body,
        ['VALOR_LIQUIDO']
    )

    const topClients = convertToNumeric<topClientsPlusBuyData>(
        respTopClientBuy.data.returnObject.body,
        ['VALOR_LIQUIDO']
    )

    return (
        <UiSales
            salesProgressData={salesProgress}
            sellersData={respSellers.data.returnObject.body}
            topSalesData={formattedTopSeller}
            topClientsData={topClients}
            salesAndGoalsRelatoryData={respProfitFromSale.data.returnObject.body}
            progressSalesRelatoryData={progressSalesRelatory}
            year={year}
            month={month}
            today={today}
        />
    )
}