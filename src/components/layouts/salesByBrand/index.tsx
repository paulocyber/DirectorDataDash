'use client'

// React
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"

// Componentes
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolbar"
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer"
import BarChart from "@/components/ui/sciences/graphics/BarChart"
import BarChartComparison from "@/components/ui/sciences/graphics/BarChart/BarChartComparison"

// Bibliotecas
import { useRecoilState, useRecoilValue } from "recoil"

// Atoms
import { brandsAtom } from "@/atom/brandsAtom"

// Dados
import highLightColor from "@/data/palettes/highlightedColor.json"

// Utils
import { fetchSalesByBrand } from "@/utils/data/fetchData/refresh/fetchSalesByBrand"
import getDate from "@/utils/date/currentDate"

// Tipagem
import { SalesByBrandType } from "@/types/salesByBrand"
import { StockByBrand } from "@/types/stock"

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

export default function UiSalesByBrand({ listSalesByBrand, listStockByBrand }: SalesByBrandPageProps) {
    const [salesByBrand, setSalesByBrand] = useState(listSalesByBrand || [])
    const [stockByBrand, setStockByBrand] = useState(listStockByBrand || [])
    const [selectedDateRange, setSelectedDateRange] = useState<string>('day');
    const [brands, setBrands] = useRecoilState(brandsAtom)
    const [loading, setLoading] = useState<boolean>(false)

    const { today, year, month, startOfWeek, endOfWeek } = getDate()
    const [date, setDate] = useState<DateRangeState>({
        start: today,
        end: today
    });
    const { token } = useContext(AuthContext)
    const handleRefresh = async () => {
        await fetchSalesByBrand({ token, dateInit: date.start, dateEnd: date.end, setLoading, setSalesByBrand, setStockByBrand, brands })
    }

    const handleCleanFilter = async () => {
        setSelectedDateRange('day')
        setBrands(['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'])

        await fetchSalesByBrand({ token, dateInit: today, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })
    }

    const handleData = async (date: string) => {
        setSelectedDateRange(date);
        switch (date) {
            case DateRange.Day:
                setDate({ start: today, end: today })
                await fetchSalesByBrand({ token, dateInit: today, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.Week:
                setDate({ start: startOfWeek, end: endOfWeek })

                await fetchSalesByBrand({ token, dateInit: startOfWeek, dateEnd: endOfWeek, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.Month:
                setDate({ start: `${year}/${month}/01`, end: today })
                await fetchSalesByBrand({ token, dateInit: `${year}/${month}/01`, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.MonthYesterday:
                setDate({ start: `${year}/${month - 1}/01`, end: today });
                await fetchSalesByBrand({ token, dateInit: `${year}/${month - 1}/01`, dateEnd: `${year}/${month - 1}/30`, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.Year:
                setDate({ start: `${year}/01/01`, end: today })
                await fetchSalesByBrand({ token, dateInit: `${year}/01/01`, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;
        }
    }

    return (
        <>
            <Container>
                <ToolBar title="Vendas por marcas" handleRefreshClick={handleRefresh} handleCleanFilter={handleCleanFilter} handleDate={handleData} selectedDateRange={selectedDateRange} displayFormOfPayment={true} />
                <GraphicContainer loading={loading} children={<BarChart data={salesByBrand} dataKey="value" dataKeyXAxis="brand" displayXAxis={true} displayCartesianGrid={true} palette={highLightColor} />} />
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