// Next - Framework
import { cookies } from "next/headers";
import { Metadata } from "next";

// Biblioteca
import { setupApiClient } from "@/service/api";

// Utils
import getDate from "@/utils/currentDate";
import { salesQueries } from "@/utils/queries/sales";
import { Stock } from "@/utils/queries/stock";
import { groupSumBy } from "@/utils/filters/sumsByGroup";

// Componentes
import Layout from "@/components/SalesByGroup";

// MetasDados
export const metadata: Metadata = {
    title: "Relatório de vendas por grupo",
    description: "Informação sobre sade das vendas do produto",
};

export default async function SalesByGroupPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)

    const { today } = getDate();
    const { salesByGroup } = salesQueries({ dateInit: today, dateEnd: today })
    const { stockByGroup } = Stock({dateInit: '', dateEnd: '' })

    const [respSalesByGroup, respStockByGroup] = await Promise.all([api.post("/v1/find-db-query", { query: salesByGroup }), api.post("/v1/find-db-query", { query: stockByGroup })])
    const sumByGroup = groupSumBy(respSalesByGroup.data.returnObject.body, { key: 'GRUPO', valueKey: 'VALOR_BRUTO_SDI' })
    const sumByStock = groupSumBy(respStockByGroup.data.returnObject.body, { key: 'GRUPO', valueKey: 'TOTAL_VALOR_COMPRA' })

    return (
        <Layout listSalesByGroup={sumByGroup} listStockByGroup={sumByStock}/>
    )
}