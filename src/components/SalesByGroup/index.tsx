'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Dados
import vibrantPalette from "@/data/palettes/vibrant.json"

// Utils
import getDate from "@/utils/currentDate";
import { formatCurrency } from "@/utils/mask/money";

// Componentes
import Container from "../ui/container";
import ToolBar from "../ui/toolbar";
import GraphicContainer from "../ui/sciences/graphics/GraphicContainer";
import BarChart from "../ui/sciences/graphics/BarChart";
import NumberAnimation from "../ui/animation/numberAnimation";

// Tipagem
import { SalesByGroupType } from "@/utils/types/salesByGroup";
import { StockByGroup } from "@/utils/types/stock";
import { fetchSalesByGroup } from "@/utils/fetchData/fetchSalesByGroup";

enum DateRange {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    MonthYesterday = 'month yesterday',
    Year = 'year'
}

type DateRangeState = {
    start: string;
    end: string;
};

export default function Layout({ listSalesByGroup, listStockByGroup }: { listSalesByGroup: SalesByGroupType[]; listStockByGroup: StockByGroup[] }) {
    const [salesByGroup, setSalesByGroup] = useState(listSalesByGroup || [])
    const [stockByGroup, setStockByGroup] = useState(listStockByGroup || [])
    const [selectedDateRange, setSelectedDateRange] = useState<string>('day');
    const [loading, setLoading] = useState<boolean>(false)

    const { today, year, month, day, startOfWeek, endOfWeek } = getDate()
    const [dateRange, setDateRange] = useState<DateRangeState>({
        start: today,
        end: today
    });

    const { token } = useContext(AuthContext)
    const handleRefresh = async () => {
        await fetchSalesByGroup({ token, dateInit: today, dateEnd: today, setLoading, setSalesByGroup, setStockByGroup })
    }

    const handleCleanFilter = async () => {
        setSelectedDateRange('day');
        await fetchSalesByGroup({ token, dateInit: today, dateEnd: today, setLoading, setSalesByGroup, setStockByGroup })
    }

    const handleData = async (date: string) => {
        setSelectedDateRange(date);
        switch (date) {
            case DateRange.Day:
                setDateRange({ start: today, end: today })
                await fetchSalesByGroup({ token, dateInit: today, dateEnd: today, setLoading, setSalesByGroup, setStockByGroup })
                break;

            case DateRange.Week:
                setDateRange({ start: startOfWeek, end: endOfWeek })

                await fetchSalesByGroup({ token, dateInit: startOfWeek, dateEnd: endOfWeek, setLoading, setSalesByGroup, setStockByGroup })
                break;

            case DateRange.Month:
                setDateRange({ start: `${year}/${month}/01`, end: today })
                await fetchSalesByGroup({ token, dateInit: `${year}/${month}/01`, dateEnd: today, setLoading, setSalesByGroup, setStockByGroup })
                break;

            case DateRange.MonthYesterday:
                setDateRange({ start: `${year}/${month - 1}/01`, end: today });
                await fetchSalesByGroup({ token, dateInit: `${year}/${month - 1}/01`, dateEnd: `${year}/${month - 1}/30`, setLoading, setSalesByGroup, setStockByGroup })
                break;

            case DateRange.Year:
                setDateRange({ start: `${year}/01/01`, end: today })
                await fetchSalesByGroup({ token, dateInit: `${year}/01/01`, dateEnd: today, setLoading, setSalesByGroup, setStockByGroup })
                break;
        }

    }

    return (
        <Container>
            <ToolBar title="Vendas por grupo" displayCalendar={false} displayBtnDate={true} displayFormOfPayment={true} handleRefreshClick={handleRefresh} handleDate={handleData} selectedDateRange={selectedDateRange} handleCleanFilter={handleCleanFilter} />
            <GraphicContainer
                loading={loading}
                children={
                    <>
                        <BarChart data={salesByGroup} dataKey="value" dataKeyXAxis="brand"  displayXAxis={true} displayCartesianGrid={true} palette={vibrantPalette} />
                        <div className="w-full flex pb-2 overflow-auto">
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
                    </>
                }
            />

        </Container>
    )
}