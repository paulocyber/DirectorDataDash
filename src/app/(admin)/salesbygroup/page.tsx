// Next
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { StockQueries } from "@/utils/queries/stock";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";

// Componentes
import LayoutSalesByGroup from "@/components/layouts/salesByGroup";

// Tipagem
import { ItemsTopProducts } from "@/types/stock";

export const metadata: Metadata = {
    title: "Relatório de vendas por grupo",
    description: "Informação sobre sade das vendas do produto",
};

export default async function SalesByGroupPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)

    const { today } = getCurrentDateDetails()
    const { topsProductsByBrand } = StockQueries({ dateInit: today, dateEnd: today, brands: ["36"], company: ['1'] })

    const [responseTopsProducts] = await Promise.all([
        api.post("/v1/find-db-query", { query: topsProductsByBrand }),
    ])

    const topProducts = convertFieldsToNumber<ItemsTopProducts>(
        responseTopsProducts.data.returnObject.body,
        ['VALOR_CUSTO', 'VALOR_LIQUIDO']
    )

    return (
        <LayoutSalesByGroup topProducts={topProducts} />
    )
}