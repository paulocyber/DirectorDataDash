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
import { DateRangePicker, DateValue, RangeValue } from "@nextui-org/react"
import { parseDate } from '@internationalized/date';

enum DateRange {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    MonthYesterday = 'month yesterday',
    others = 'others',
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
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
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
        setBrands(['BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA', 'KIMASTER', 'PEINING', 'DEVIA', 'B-MAX', 'INOVA', 'HREBOS'])

        await fetchSalesByBrand({ token, dateInit: today, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands: ['BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA', 'KIMASTER', 'PEINING', 'DEVIA', 'B-MAX', 'INOVA', 'HREBOS'] })
    }

    const handleData = async (date: string) => {
        setSelectedDateRange(date);
        switch (date) {
            case DateRange.Day:
                setDate({ start: today, end: today })
                setShowDatePicker(false)
                await fetchSalesByBrand({ token, dateInit: today, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.Week:
                setDate({ start: startOfWeek, end: endOfWeek })
                setShowDatePicker(false)
                await fetchSalesByBrand({ token, dateInit: startOfWeek, dateEnd: endOfWeek, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.Month:
                setDate({ start: `${year}/${month}/01`, end: today })
                setShowDatePicker(false)
                await fetchSalesByBrand({ token, dateInit: `${year}/${month}/01`, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.MonthYesterday:
                setDate({ start: `${year}/${month - 1}/01`, end: today });
                setShowDatePicker(false)
                await fetchSalesByBrand({ token, dateInit: `${year}/${month - 1}/01`, dateEnd: `${year}/${month - 1}/30`, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;

            case DateRange.others:
                setShowDatePicker(true)
                break;

            case DateRange.Year:
                setDate({ start: `${year}/01/01`, end: today })
                setShowDatePicker(false)
                await fetchSalesByBrand({ token, dateInit: `${year}/01/01`, dateEnd: today, setLoading, setSalesByBrand, setStockByBrand, brands })
                break;
        }
    }

    const handleDateRangeChange = async (selected: RangeValue<DateValue> | null) => {
        if (selected?.start && selected?.end) {
            const start = selected.start.toString(); // Converte para string
            const end = selected.end.toString(); // Converte para string

            setDate({ start, end });
            await fetchSalesByBrand({
                token,
                dateInit: start,
                dateEnd: end,
                setLoading,
                setSalesByBrand,
                setStockByBrand,
                brands
            });
        }
    };

    return (
        <>
            <Container>
                <ToolBar title="Vendas por marcas" handleRefreshClick={handleRefresh} handleCleanFilter={handleCleanFilter} handleDate={handleData} selectedDateRange={selectedDateRange} displayFormOfPayment={true} />
                <div className="px-6">
                    <DateRangePicker
                        className="max-w-xs"
                        classNames={{
                            inputWrapper: `lg:flex bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500`,
                            base: `text-white  ${!showDatePicker && 'hidden'}`,
                            innerWrapper: "py-[0.2em] text-white ",
                            segment: "text-white",
                            selectorIcon: "text-center text-white",
                        }}
                        onChange={handleDateRangeChange}
                    />
                </div>
                <GraphicContainer loading={loading} children={<BarChart data={salesByBrand} dataKey="value" dataKeyXAxis="brand" displayXAxis={true} displayCartesianGrid={true} palette={highLightColor} LabelListProps={true}/>} />
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