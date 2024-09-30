'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Componentes
import Container from "../ui/container";
import ToolBar from "../ui/toolbar";
import GraphicContainer from "../ui/sciences/graphics/GraphicContainer";
import BarChart from "../ui/sciences/graphics/BarChart";
import BarChartComparison from "../ui/sciences/graphics/BarChart/BarChartComparison";

// Dados
import highLightColor from "@/data/palettes/brands/highlightedColor.json"

// Utils
import { fetchSalesByBrand } from "@/utils/fetchData/fetchSalesByBrand";
import getDate from "@/utils/currentDate";

// Tipagem
import { SalesByBrandType } from "@/utils/types/salesByBrand";
import { StockByBrand } from "@/utils/types/stock";

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

interface SalesByBrandPageProps {
    listSalesByBrand: SalesByBrandType[];
    listStockByBrand: StockByBrand[];
}

export default function Layout({ listSalesByBrand, listStockByBrand }: SalesByBrandPageProps) {
    const [salesByBrand, setSalesByBrand] = useState(listSalesByBrand || [])
    const [stockByBrand, setStockByBrand] = useState(listStockByBrand || [])
    const [selectedDateRange, setSelectedDateRange] = useState<string>('day');
    const [loading, setLoading] = useState<boolean>(false)

    const { today, year, month, startOfWeek, endOfWeek } = getDate()
    const [dateRange, setDateRange] = useState<DateRangeState>({
        start: today,
        end: today
    });

    const { token } = useContext(AuthContext)
    const handleRefresh = async () => {
        await fetchSalesByBrand({ token, dateInit: dateRange.start, dateEnd: dateRange.end, setLoading, setSalesByBrand, setStockByBrand })
    }

    const handleData = async (date: string) => {
        setSelectedDateRange(date);
        switch (date) {
            case DateRange.Day:
                setDateRange({ start: today, end: today })
                await fetchSalesByBrand({ token, dateInit: today, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand })
                break;

            case DateRange.Week:
                setDateRange({ start: startOfWeek, end: endOfWeek })

                await fetchSalesByBrand({ token, dateInit: startOfWeek, dateEnd: endOfWeek, setLoading, setSalesByBrand, setStockByBrand })
                break;

            case DateRange.Month:
                setDateRange({ start: `${year}/${month}/01`, end: today })
                await fetchSalesByBrand({ token, dateInit: `${year}/${month}/01`, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand })
                break;

            case DateRange.MonthYesterday:
                setDateRange({ start: `${year}/${month - 1}/01`, end: today });
                await fetchSalesByBrand({ token, dateInit: `${year}/${month - 1}/01`, dateEnd: `${year}/${month - 1}/30`, setLoading, setSalesByBrand, setStockByBrand })
                break;

            case DateRange.Year:
                setDateRange({ start: `${year}/01/01`, end: today })
                await fetchSalesByBrand({ token, dateInit: `${year}/01/01`, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand })
                break;
        }

    }

    const handleCleanFilter = async () => {
        setSelectedDateRange('day');
        await fetchSalesByBrand({ token, dateInit: today, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand })
    }

    return (
        <>
            <Container>
                <ToolBar title="Vendas por marcas" displayCalendar={false} displayBtnDate={true} displayFormOfPayment={true} handleRefreshClick={handleRefresh} handleDate={handleData} selectedDateRange={selectedDateRange} handleCleanFilter={handleCleanFilter}/>
                <GraphicContainer
                    loading={loading}
                    children={
                        <BarChart data={salesByBrand} dataKey="value" dataKeyXAxis="brand" displayXAxis={true} displayCartesianGrid={true} palette={highLightColor} />
                    }
                />
            </Container>
            <Container>
                <h1 className="font-bold md:text-lg text-sm p-5">Estoque em valor X Endividamento por marca</h1>
                <GraphicContainer
                    loading={false}
                    children={
                        <BarChartComparison data={stockByBrand} xKey="brand" dataKeyOne="valueInStock" dataKeyTwo="debtValue" nameKeyOne="Estoque" nameKeyTwo="Dívida" />
                    }
                />
            </Container>
        </>
    )
}