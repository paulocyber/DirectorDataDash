// Componentes
import Container from "@/components/ui/container";
import Layout from "@/components/ui/layout";
import ToolBar from "@/components/ui/toolbar";
import { canSSRAuth } from "@/utils/permissions/canSSRAuth";
import { BarChartComponent } from "@/components/ui/sciences/BarChart/BarChartSimple";
import { Loading } from "@/components/ui/loading";

// Utils
import { SalesByGroup } from './../../utils/queries/SalesByGroup';
import currentDate from "@/utils/CurrentDate";
import { Stock } from "@/utils/queries/Stock";
import { groupSumByGroup } from "@/utils/filters/salesByGroup/groupSumByGroup";
import { formatCurrency } from "@/utils/masks/formatCurrency";
import { groupSumByStock } from "@/utils/filters/stock/groupSumPerShare";

// Next - Servidor
import { setupApiClient } from "@/service/api";

// React
import { useState } from "react";

// Tipagem
import { DateValue, RangeValue } from "@nextui-org/react";
import { vibrantPalette } from "@/data/graphicColorPalette";
type SalesByGroupType = {
    brand: string; // Organizacao - mudar o nome custom pela pro
    value: number;
}

export default function SalesByGroupPage({ listSalesByGroup, listStockByGroup }: { listSalesByGroup: SalesByGroupType[]; listStockByGroup: SalesByGroupType[] }) {
    const [salesByGroup, setSalesByGroup] = useState(listSalesByGroup || [])
    const [stockByGroup, setStockByGroup] = useState(listStockByGroup || [])
    const [loading, setLoading] = useState<Boolean>()

    const fetchSalesByGroup = async (dataInit?: string, dataEnd?: string) => {
        setLoading(true)

        const apiClient = setupApiClient();

        let salesByGroup = SalesByGroup({ dataInit, dataEnd })
        const { stockByGroup } = Stock();

        const [respSalesByGroup, respStockByGroup] = await Promise.all([
            apiClient.post("/v1/find-db-query", { query: salesByGroup }),
            apiClient.post("/v1/find-db-query", { query: stockByGroup })
        ]);

        const resultSales = groupSumByGroup(respSalesByGroup.data.returnObject.body);
        const resultStock = groupSumByStock(respStockByGroup.data.returnObject.body)
        setSalesByGroup(resultSales)
        setStockByGroup(resultStock)

        setLoading(false)
    }

    const refresh = async () => {
        const { today } = currentDate()

        await fetchSalesByGroup(today, today)
    }

    const onDateChange = async (date?: RangeValue<DateValue>, isDate?: string) => {
        if (isDate === 'day') {
            const { today } = currentDate()
            await fetchSalesByGroup(today, today)
        } else if (isDate === 'week') {
            const { startOfWeek, endOfWeek } = currentDate()

            await fetchSalesByGroup(startOfWeek, endOfWeek)
        } else if (isDate === 'month') {
            const { month, year, today } = currentDate()
            const dateStart = `${year}/${month}/01`

            await fetchSalesByGroup(dateStart, today)
        } else {
            const { today, year } = currentDate()
            const dateInit = `${year}/01/01`

            await fetchSalesByGroup(dateInit, today)
        }
    }

    return (
        <Layout description="Vendas por grupos">
            <Container>
                <ToolBar title="Vendas por grupos" handleRefreshClick={refresh} formOfPayment={true} handleDateFilter={onDateChange} />
                <main className="flex w-full h-[540px] flex-col px-5">
                    {loading
                        ?
                        <div className="h-[520px] flex items-center justify-center">
                            <Loading />
                        </div>
                        :
                        <div className="h-[410px]">
                            <BarChartComponent data={salesByGroup} mask={18} keyValue="value" description="brand" />

                            <div className="w-full flex px-6 ">
                                {stockByGroup.map((stock, index) => (
                                    <div key={index} className="flex mx-2 items-center px-1 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <div className="mx-5">
                                            <div className="flex items-center">
                                                <p style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }} className="rounded-full p-1 "></p>

                                                <div className="text-gray-500 font-semibold text-sm pl-2">Estoque total em valor:</div>
                                            </div>
                                            <h4 className="text-2xl font-bold text-gray-700 text-xs">{formatCurrency(stock.value)}</h4>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    }
                </main>
            </Container>
        </Layout>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const { today } = currentDate()

    let salesByGroup = SalesByGroup({ dataInit: today, dataEnd: today })
    let { stockByGroup } = Stock()

    const [respSalesByGroup, respStockByGroup] = await Promise.all([
        apiClient.post("/v1/find-db-query", { query: salesByGroup }),
        apiClient.post("/v1/find-db-query", { query: stockByGroup })
    ]);

    const totalValuePerGroupSale = groupSumByGroup(respSalesByGroup.data.returnObject.body);
    const totalStockValuePerGroup = groupSumByStock(respStockByGroup.data.returnObject.body)

    return {
        props: {
            listSalesByGroup: totalValuePerGroupSale,
            listStockByGroup: totalStockValuePerGroup
        }
    }
});