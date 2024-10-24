// Next - Framework
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getDate from "@/utils/date/currentDate";
import { salesQueries } from "@/utils/queries/sales";
import { stockQueries } from "@/utils/queries/stock";
import { groupSumBy } from "@/utils/filters/sumsByGroup";
import { convertToNumeric } from "@/utils/convertToNumeric";

// Componentes
import UiSalesByGroup from "@/components/layouts/salesByGroupUi";

// MetaDados
export const metadata: Metadata = {
    title: "Relatório de vendas por grupo",
    description: "Informação sobre sade das vendas do produto",
};

// Tipagem
import { TopProducts } from "@/types/stock";

export default async function SalesByGroupPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)

    const { today, year, month, day, startOfWeek, endOfWeek } = getDate();
    const { salesByGroup } = salesQueries({ dateInit: today, dateEnd: today })
    const { stockByGroup, topsProductsByBrand } = stockQueries({ dateInit: today, dateEnd: today, idBrands: ['36'], emp: '1' })

    const [respSalesByGroup, respStockByGroup, respTopsProductsByBrand] = await Promise.all([api.post("/v1/find-db-query", { query: salesByGroup }), api.post("/v1/find-db-query", { query: stockByGroup }), api.post("/v1/find-db-query", { query: topsProductsByBrand })])
    const sumByStock = groupSumBy(respStockByGroup.data.returnObject.body, { key: 'GRUPO', valueKey: 'TOTAL_VALOR_COMPRA' })

    const formattedTopProducts = convertToNumeric<TopProducts>(
        respTopsProductsByBrand.data.returnObject.body,
        ['VALOR_CUSTO', 'VALOR_LIQUIDO']
    )

    return (
        <UiSalesByGroup
            listStockByGroup={sumByStock}
            listTopProducts={formattedTopProducts}
            year={year}
            month={month}
            day={day}
            today={today}
            startOfWeek={startOfWeek}
            endOfWeek={endOfWeek}
        />
    )
}