// Componentes
import Container from "@/components/ui/container";
import PageLayout from "@/components/ui/layout";
import GraphicContainer from "@/components/ui/container/graphic";
import ToolBar from "@/components/ui/toolbar";
import BarChart from "@/components/ui/sciences/BarChart";
import CustomFormattedLabel from "@/components/ui/sciences/BarChart/labelList/salesByBrand";
import NumberAnimation from "@/components/ui/animated/numberAnimation";

// Framework - Next
import { getSalesByGroupPageProps } from "@/utils/server/salesByGroupPageProps";

// Dados
import { vibrantPalette } from "@/data/graphicColorPalette/vibrantPalette";

// Utils
import { fetchSalesByGroup } from "@/utils/fetchData/fetchSalesByGroup";
import getDate from "@/utils/date/currentDate";
import { formatCurrency } from "@/utils/mask/formatCurrency";

// React
import { useState } from "react";

// Tipagem
import { SalesByGroupType } from "@/utils/types/salesByGroup";
import { DateRange, DateRangeState } from "@/utils/types/data";
import { StockByGroup } from "@/utils/types/stock";

export default function SalesByGroupPage({ listSalesByGroup, listStockByGroup }: { listSalesByGroup: SalesByGroupType[]; listStockByGroup: StockByGroup[] }) {
    const [salesByGroup, setSalesByGroup] = useState(listSalesByGroup || [])
    const [stockByGroup, setStockByGroup] = useState(listStockByGroup || [])
    const [selectedDateRange, setSelectedDateRange] = useState<string>('day');
    const [loading, setLoading] = useState<boolean>(false)

    const { today, year, month, day, startOfWeek, endOfWeek } = getDate()
    const [dateRange, setDateRange] = useState<DateRangeState>({
        start: today,
        end: today
    });

    const handleFetchData = async () => { await fetchSalesByGroup({ dateInit: dateRange.start, dateEnd: dateRange.end, setLoading, setSalesByGroup, setStockByGroup }) }
    async function handleCleanFilter() {
        await fetchSalesByGroup({
            dateInit: dateRange.start,
            dateEnd: dateRange.end,
            setLoading,
            setSalesByGroup,
            setStockByGroup
        })
    }

    const handleDate = async (date: string) => {
        setSelectedDateRange(date);
        switch (date) {
            case DateRange.Day:
                setDateRange({ start: today, end: today });
                await fetchSalesByGroup({
                    dateInit: today,
                    dateEnd: today,
                    setLoading,
                    setSalesByGroup,
                    setStockByGroup
                })
                break;
            case DateRange.Week:
                setDateRange({ start: startOfWeek, end: endOfWeek });
                await fetchSalesByGroup({
                    dateInit: startOfWeek,
                    dateEnd: endOfWeek,
                    setLoading,
                    setSalesByGroup,
                    setStockByGroup
                })
                break;
            case DateRange.Month:
                setDateRange({ start: `${year}/${month}/01`, end: today });
                await fetchSalesByGroup({
                    dateInit: `${year}/${month}/01`,
                    dateEnd: today,
                    setLoading,
                    setSalesByGroup,
                    setStockByGroup
                })
                break;
            case DateRange.Year:
                setDateRange({ start: `${year}/01/01`, end: today });
                await fetchSalesByGroup({
                    dateInit: `${year}/01/01`,
                    dateEnd: today,
                    setLoading,
                    setSalesByGroup,
                    setStockByGroup
                })
                break;
        }
    };

    return (
        <PageLayout description="Vendas por grupos">
            <Container>
                <ToolBar title="Estoque por groupos" handleRefreshClick={handleFetchData} displayBtnDate={true} selectedDateRange={selectedDateRange} handleDate={handleDate} displayFormOfPayment={true} handleCleanFilter={handleCleanFilter}/>
                <GraphicContainer
                    loading={loading}
                    children={
                        <BarChart
                            data={salesByGroup}
                            dataKey="value"
                            dataKeyXAxis="group"
                            displayXAxis={true}
                            displayCartesianGrid={true}
                            palette={vibrantPalette}
                        />
                    }
                />
                <div className="w-full flex px-6 py-6 overflow-auto">
                    {stockByGroup.map((stock, index) => (
                        <div key={index} className="flex mx-2 items-center px-1 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="mx-5">
                                <div className="flex items-center">
                                    <p style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }} className="rounded-full p-1 "></p>

                                    <div className="text-gray-500 font-semibold text-sm pl-2 truncate">Estoque total em valor:</div>
                                </div>
                                <h4 className="text-2xl font-bold text-gray-700 text-xs">
                                    <NumberAnimation value={formatCurrency(stock.value)} />
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </PageLayout>
    )
}

export const getServerSideProps = getSalesByGroupPageProps;