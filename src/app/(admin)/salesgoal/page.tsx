// Next
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { salesQueries } from "@/utils/queries/sales";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import { goalsQueries } from "@/utils/queries/goals";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";

// Componentes
import LayoutSalesGoal from "@/components/layouts/salesGoal";

// Tipagem
import { ItemsTopSellers } from "@/types/sales";

export const metadata: Metadata = {
    title: "Relatório de vendas",
    description: "Informações sobre vendas e metas",
};

export default async function SalesPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token)

    const { year, month, today } = getCurrentDateDetails()
    const { sales, topSellers, profitsFromSale } = salesQueries({ dateInit: `${year}/${month}/01`, year, month, dateEnd: today, company: ["1, 2, 3, 4, 5"] })
    const { storeGoals } = goalsQueries({ month, year, company: ['1, 2, 3, 4, 5'] })

    const [salesResponse, topSellersResponse, storeGoalsResponse, profitFromSaleResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: topSellers }),
        api.post("/v1/find-db-query", { query: storeGoals }),
        api.post("/v1/find-db-query", { query: profitsFromSale })
    ]);

    const totalSalesValue = calculateTotalByKey(salesResponse.data.returnObject.body, (item) => (item as any).VALOR_LIQUIDO)
    const totalGoalsValue = calculateTotalByKey(storeGoalsResponse.data.returnObject.body, (item) => (item as any).VALOR_MTA)
    const totalProfitValue = calculateTotalByKey(profitFromSaleResponse.data.returnObject.body, (item) => (item as any).VALOR_LUCRO)

    const salesProgressData = [
        { name: "Sales", value: totalSalesValue },
        { name: "Lucro", value: totalProfitValue },
        { name: "Goals", value: totalGoalsValue },
    ];

    const convertedTopSellers = convertFieldsToNumber<ItemsTopSellers>(
        topSellersResponse.data.returnObject.body,
        ['VALOR_LIQUIDO']
    );

    return (
        <LayoutSalesGoal
            goalProgress={salesProgressData}
            topSellersData={convertedTopSellers}
            profitSalesData={profitFromSaleResponse.data.returnObject.body}
            year={year}
            month={month}
            today={today}
        />
    )
}