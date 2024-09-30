// Biblioteca
import Layout from "@/components/sales/layout";
import { setupApiClient } from "@/service/api";

// Utils
import getDate from "@/utils/currentDate";
import { sellersQueries } from "@/utils/queries/employees/sellers";
import { goalsQueries } from "@/utils/queries/goals";
import { salesQueries } from "@/utils/queries/sales";

// Framework
import { cookies } from "next/headers";

// Tipagem
import { topSalesData } from "@/utils/types/sales";

// MetaDados
export const metadata: Metadata = {
    title: "Relatório de vendas",
    description: "Informações sobre vendas e metas",
};

export default async function SalesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string);
    const { year, month, today, getLastDayOfMonth } = getDate();

    const { sales, topTenSellers } = salesQueries({
        dateInit: `${year}/${month}/01`,
        dateEnd: today,
        emp: "1",
    });
    const { storeGoals } = goalsQueries({
        month,
        year,
        dateInit: `${year}/${month}/01`,
    });
    const sellers = sellersQueries({ dateInit: `${year}/${month}/01` });

    const [respSales, respTonTenSellers, respGoals, respSellers] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: topTenSellers }),
        api.post("/v1/find-db-query", { query: storeGoals }),
        api.post("/v1/find-db-query", { query: sellers })
    ]);

    const salesValue = respSales.data.returnObject?.body[0]?.VALOR_LIQUIDO ?
        parseFloat(respSales.data.returnObject.body[0].VALOR_LIQUIDO) : 0;

    const goalsValue = respGoals.data?.returnObject?.body[0]?.VALOR_MTA ?
        parseFloat(respGoals.data.returnObject.body[0].VALOR_MTA) : 0;

    const data = [
        { name: "Vendas", value: salesValue },
        { name: "Metas", value: goalsValue }
    ];

    const formattedTopSeller = respTonTenSellers.data.returnObject.body.map((item: topSalesData) => {
        const valueLiquid = typeof item.VALOR_TOTAL_LIQUIDO === "string"
            ? parseFloat(item.VALOR_TOTAL_LIQUIDO.replace(",", "."))
            : item.VALOR_TOTAL_LIQUIDO;

        return {
            ...item,
            VALOR_TOTAL_LIQUIDO: valueLiquid,
        }
    })

    return (
        <Layout
            salesData={data}
            topSalesData={formattedTopSeller}
            sellersData={respSellers.data.returnObject.body}
            year={year}
            month={month}
            today={today}
        />
    );
}