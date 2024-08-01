// Componentes
import Layout from "@/components/ui/layout"
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolbar"
import { Loading } from "@/components/ui/loading"
import { BarChartComponent } from "@/components/ui/sciences/BarChart/BarChartSimple"

// Utils
import { SalesByBrand } from "@/utils/queries/SalesByBrand"
import { groupSumByBrand } from "@/utils/filters/salesByBrand/groupSumByBrand"
import currentDate from "@/utils/CurrentDate"
import { formatCurrency } from './../../utils/masks/formatCurrency';

// Bibliotecas
import { DateValue, RangeValue } from "@nextui-org/react"

// React
import { useState } from "react"

// Framework - Servidor
import { canSSRAuth } from "@/utils/permissions/canSSRAuth"
import { setupApiClient } from "@/service/api"
import { Stock } from "@/utils/queries/Stock"
import { groupSumByStock } from "@/utils/filters/stock/brandSumPerShare"

type SalesByBrandType = {
    brand: string;
    value: number;
}

export default function SalesByBrandPage({ listSalesByBrand, listStockByBrand }: { listSalesByBrand: SalesByBrandType[]; listStockByBrand: SalesByBrandType[] }) {
    const [salesByBrand, setSalesByBrand] = useState(listSalesByBrand || [])
    const [stockByBrand, setStockByBrand] = useState(listStockByBrand || [])
    const [loading, setLoading] = useState<boolean>(false)

    const apiClient = setupApiClient();

    const fetchSalesByBrand = async (dataInit?: string, dataEnd?: string) => {
        setLoading(true)

        const salesByBrand = SalesByBrand({ dataInit, dataEnd })
        const resp = await apiClient.post("/v1/find-db-query", { query: salesByBrand });
        const result = groupSumByBrand(resp.data.returnObject.body)
        setSalesByBrand(result)
        
        setLoading(false)
    }

    const refresh = async () => {
        const { today } = currentDate()

        await fetchSalesByBrand(today, today)
    }

    const onDateChange = async (date?: RangeValue<DateValue>, isDate?: string) => {
        if (isDate === 'day') {
            const { today } = currentDate()
            await fetchSalesByBrand(today, today)
        } else if (isDate === 'week') {
            const { startOfWeek, endOfWeek } = currentDate()

            await fetchSalesByBrand(startOfWeek, endOfWeek)
        } else if (isDate === 'month') {
            const { month, year, today } = currentDate()
            const dateStart = `${year}/${month}/01`

            await fetchSalesByBrand(dateStart, today)
        } else {
            const dateInit = '2024/01/01'
            const { today } = currentDate()

            await fetchSalesByBrand(dateInit, today)
        }
    }

    return (
        <Layout description="Vendas por marcas">
            <Container>
                <ToolBar title="Vendas por marcas" handleRefreshClick={refresh} formOfPayment={true} handleDateFilter={onDateChange} />
                <main className="flex w-full h-[540px] flex-col px-5">
                    {loading
                        ?
                        <div className="h-[520px] flex items-center justify-center">
                            <Loading />
                        </div>
                        :
                        <div className="h-[410px]">
                            <BarChartComponent data={salesByBrand} mask={18} keyValue="value" description="brand" />

                            <div className="w-full flex px-6 ">
                                {stockByBrand.map((stock) => (
                                    <div className="flex mx-2 items-center px-1 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <div className="mx-5">
                                            <div className="text-gray-500 font-semibold text-sm">Preço de custo - {stock.brand}:</div>
                                            <h4 className="text-2xl font-bold text-gray-700 text-xs">{formatCurrency(stock.value)}</h4>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    }
                </main>
            </Container>
        </Layout>// restante estoque
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const { today } = currentDate()

    const salesByBrand = SalesByBrand({ dataInit: today, dataEnd: today })
    const stock = Stock()

    const respSales = await apiClient.post("/v1/find-db-query", { query: salesByBrand })
    const respStock = await apiClient.post("/v1/find-db-query", { query: stock })

    const totalValuePerBrandSale = groupSumByBrand(respSales.data.returnObject.body)
    const totalStockValuePerBrand = groupSumByStock(respStock.data.returnObject.body)

    return {
        props: {
            listSalesByBrand: totalValuePerBrandSale,
            listStockByBrand: totalStockValuePerBrand
        }
    }
})
