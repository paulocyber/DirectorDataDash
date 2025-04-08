// Next
import { cookies } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import { salesQueries } from "@/utils/queries/sales";
import getCurrentDateDetails from "@/utils/getDate";
import { groupSumBy } from "@/utils/filters/groupSumBy";

// Componentes
import LayoutSalesByGroup from "@/components/layouts/salesByGroup";

export const metadata: Metadata = {
    title: "Relatório de vendas por grupo",
    description: "Informação sobre sade das vendas do produto",
};

export default async function SalesByGroupPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    const api = setupApiClient(token as string)

    const { firstDayPrevMonth, lastDayPrevMonth, year, month, today } = getCurrentDateDetails()

    if (!token || ['Fiscal'].includes(role)) {
        redirect('/taxbilling')
    }

    if (!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    const { salesByGroup: currentMonthSales } = salesQueries({
        dateInit: `${year}/${month}/01`,
        dateEnd: today,
        groups: ['CAPAS', 'SUA CAPA', 'CAPA ORIGINAL', 'CAPA RIGIDA LISA', 'CAPA SOFT', 'CAPA TRANSPARANTE', 'CAPAS DIVERSAS', 'CAPA RIGIDA FOSCA', 'CAPA REVESTIDA', 'CAPA REVESTIDA MAGSAFE', 'CAPA AVELUDADO',
            'CAPA SPACE 2', 'CAPA SAPECE ACRILICA', 'pelicula', 'fosca 3D pelicula', 'película de camera', 'pelicula cerâmica fosca', 'pelicula ceramica fosca priv', 'pelicula 3d grossa', 'pelicula 3d privacidade',
            'pelicula 3d fina', 'pelicula play up']
    })
    const { salesByGroup: lastMonthSales } = salesQueries({
        dateInit: firstDayPrevMonth,
        dateEnd: lastDayPrevMonth,
        groups: ['CAPAS', 'SUA CAPA', 'CAPA ORIGINAL', 'CAPA RIGIDA LISA', 'CAPA SOFT', 'CAPA TRANSPARANTE', 'CAPAS DIVERSAS', 'CAPA RIGIDA FOSCA', 'CAPA REVESTIDA', 'CAPA REVESTIDA MAGSAFE', 'CAPA AVELUDADO',
            'CAPA SPACE 2', 'CAPA SAPECE ACRILICA', 'pelicula', 'fosca 3D pelicula', 'película de camera', 'pelicula cerâmica fosca', 'pelicula ceramica fosca priv', 'pelicula 3d grossa', 'pelicula 3d privacidade',
            'pelicula 3d fina', 'pelicula play up']
    })

    const [currentMonthSalesResponse, lastMonthSalesResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: currentMonthSales }),
        api.post("/v1/find-db-query", { query: lastMonthSales }),
    ])

    const currentMonthAggregatedSales = groupSumBy(currentMonthSalesResponse.data.returnObject.body, { key: 'GRUPO', valueKey: 'TOTAL_VALOR_COMPRA' })
    const lastMonthAggregatedSales = groupSumBy(lastMonthSalesResponse.data.returnObject.body, { key: 'GRUPO', valueKey: 'TOTAL_VALOR_COMPRA' })

    return (
        <LayoutSalesByGroup
            currentSalesData={currentMonthAggregatedSales}
            lastSalesData={lastMonthAggregatedSales}
        />
    )
}