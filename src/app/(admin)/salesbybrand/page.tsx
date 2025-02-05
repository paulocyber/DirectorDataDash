// Next
import { Metadata } from "next";
import { cookies } from "next/headers";

// Biblioteca
import { setupApiClient } from "@/services/api";

// Atom

// Utils
import { salesQueries } from "@/utils/queries/sales";
import getCurrentDateDetails from "@/utils/getDate";
import { groupSumBy } from "@/utils/filters/groupSumBy";
import { StockQueries } from "@/utils/queries/stock";
import { billsToPayQueries } from '@/utils/queries/billstoPay';

// Componentes
import MainTence from "@/components/ui/maintenance";

// MetasDados
export const metadata: Metadata = {
    title: "Vendas x Estoque em valor",
    description: "Relatório de vendas por marcas e Stock",
};

export default async function SalesByBrandPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const api = setupApiClient(token as string)

    const { today, year } = getCurrentDateDetails()
    const { SalesByBrand: playCell } = salesQueries({ dateInit: today, dateEnd: today, company: ["1"], brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { SalesByBrand: playCustom } = salesQueries({ dateInit: today, dateEnd: today, company: ["2"], brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { SalesByBrand: playUp } = salesQueries({ dateInit: today, dateEnd: today, company: ["3"], brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { SalesByBrand: playCovers } = salesQueries({ dateInit: today, dateEnd: today, company: ["4"], brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { stockByBrand } = StockQueries({ dateInit: '', dateEnd: '', brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS',] })
    const { debtBySuppliers } = billsToPayQueries({ year, brands: ['BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA', 'KIMASTER', 'PEINING', 'DEVIA', 'B-MAX', 'INOVA'] })
    const { buyBySuppliers } = billsToPayQueries({ dateInit: today, dateEnd: today, brands: ['BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA', 'KIMASTER', 'PEINING', 'DEVIA', 'B-MAX', 'INOVA'] })

    const [responsePlayCell, responsePlayCustom, responsePlayUp, responsePlayCovers, responseStock, responseDebt, responseBuy] = await Promise.all([
        api.post("/v1/find-db-query", { query: playCell }),
        api.post("/v1/find-db-query", { query: playCustom }),
        api.post("/v1/find-db-query", { query: playUp }),
        api.post("/v1/find-db-query", { query: playCovers }),
        api.post("/v1/find-db-query", { query: stockByBrand }),
        api.post("/v1/find-db-query", { query: debtBySuppliers }),
        api.post("/v1/find-db-query", { query: buyBySuppliers })
    ])

    const salesData = [...responsePlayCell.data.returnObject.body, ...responsePlayCustom.data.returnObject.body, ...responsePlayUp.data.returnObject.body, ...responsePlayCovers.data.returnObject.body]
    const aggregatedSalesByBrand = groupSumBy(salesData, { key: 'MARCAS', valueKey: 'VALOR_BRUTO_SDI' })
        .sort((a, b) => b.value - a.value);
    const aggregatedStockByBrand = groupSumBy(responseStock.data.returnObject.body, { key: 'MARCA', valueKey: 'TOTAL_VALOR_COMPRA' })
        .sort((a, b) => b.value - a.value);

    const stockByBrandList = aggregatedStockByBrand
        .map((stock) => {
            const matchedDebt = responseDebt.data.returnObject.body.find(
                (debt: any) => debt.APELIDO_PSS === stock.brand
            );

            return {
                brand: stock.brand,
                valueInStock: stock.value,
                debtValue: matchedDebt
                    ? parseFloat(matchedDebt.VALOR_PGM.replace(",", "."))
                    : 0,
            };
        })
        .sort((a, b) => b.valueInStock - a.valueInStock);

    const salesAndBuy = aggregatedSalesByBrand
        .map((sales) => {
            const matchedSales = responseBuy.data.returnObject.body.find(
                (buy: any) => buy.APELIDO_PSS === sales.brand
            );

            return {
                brand: sales.brand,
                valueSales: sales.value,
                buyValue: matchedSales ? parseFloat(matchedSales.VALOR_PGM.replace(",", ".")) : 0,
            };
        })

    return (
        // <LayoutSalesByBrand
        //     salesByBrandData={salesAndBuy}
        //     stockAndDebtData={stockByBrandList}
        // />
        <MainTence />
    )
}