// Next - framework
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getDate from "@/utils/date/currentDate";
import { salesQueries } from "@/utils/queries/sales";
import { stockQueries } from "@/utils/queries/stock";
import { billsToPayQueries } from "@/utils/queries/billstoPay";
import { groupSumBy } from "@/utils/filters/sumsByGroup";

// Componentes
import UiSalesByBrand from "@/components/layouts/salesByBrand";

// MetasDados
export const metadata: Metadata = {
    title: "Vendas x Estoque em valor",
    description: "Relatório de vendas por marcas e Stock",
};

export default async function SalesByBrandPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { today, year } = getDate();

    const { SalesByBrand: playCell } = salesQueries({ dateInit: today, dateEnd: today, emp: "1", brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { SalesByBrand: playCustom } = salesQueries({ dateInit: today, dateEnd: today, emp: "2", brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { SalesByBrand: playUp } = salesQueries({ dateInit: today, dateEnd: today, emp: "3", brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { stockByBrand } = stockQueries({ dateInit: '', dateEnd: '', brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { openBillFromSuppliers } = billsToPayQueries({ year, brands: ['BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA', 'KIMASTER', 'PEINING', 'DEVIA', 'B-MAX', 'INOVA'] })

    const [respSalesPlayCell, respSalesPlayCustom, respSalesPlayUp, respStock, respDebt] = await Promise.all([
        api.post("/v1/find-db-query", { query: playCell }),
        api.post("/v1/find-db-query", { query: playCustom }),
        api.post("/v1/find-db-query", { query: playUp }),
        api.post("/v1/find-db-query", { query: stockByBrand }),
        api.post("/v1/find-db-query", { query: openBillFromSuppliers })
    ])

    const salesData = [...respSalesPlayCell.data.returnObject.body, ...respSalesPlayCustom.data.returnObject.body, ...respSalesPlayUp.data.returnObject.body]
    const sumByBrand = groupSumBy(salesData, { key: 'MARCAS', valueKey: 'VALOR_BRUTO_SDI' }).sort((a, b) => b.value - a.value)
    const sumOfStockByBrand = groupSumBy(respStock.data.returnObject.body, { key: "MARCA", valueKey: "TOTAL_VALOR_COMPRA" })
    
    const listStockByBrand = sumOfStockByBrand.map((stock) => {
        const groupedData = respDebt.data.returnObject.body.find((debt: any) => debt.APELIDO_PSS === stock.brand)

        return {
            brand: stock.brand,
            valueInStock: stock.value,
            debtValue: groupedData ? parseFloat(groupedData.VALOR_PGM.replace(',', '.')) : 0,
        }
    }).sort((a, b) => b.valueInStock - a.valueInStock)

    return (
        <UiSalesByBrand listSalesByBrand={sumByBrand} listStockByBrand={listStockByBrand} />
    )
}