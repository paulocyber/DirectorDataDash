// Framework - Servidor
import { getSalesByBrandPageProps } from "@/utils/server/salesByBrandPageProps";

// Componentes
import PageLayout from "@/components/ui/layout";
import Container from "@/components/ui/container";
import ContainerGraphic from "@/components/ui/container/graphic";
import ToolBar from "@/components/ui/toolbar";
import CustomFormattedLabel from "@/components/ui/sciences/BarChart/labelList/salesByBrand";
import BarChart from "@/components/ui/sciences/BarChart";
import BarChartComparison from "@/components/ui/sciences/BarChart/comparison";

// React
import { useState } from "react";

// Dados
import { highlightedColor } from "@/data/graphicColorPalette/palletBrand";

// Utils
import getDate from "@/utils/date/currentDate";
import { fetchSalesByBrand } from "@/utils/fetchData/fetchSalesByBrand";
import { formatCurrency } from "@/utils/mask/formatCurrency";

// Tipagem
import { StockByBrand } from "@/utils/types/stock";
import { SalesByBrandType } from "@/utils/types/SalesByBrand";
import { DateRange, DateRangeState } from "@/utils/types/data";
interface SalesByBrandPageProps {
    listSalesByBrand: SalesByBrandType[];
    listStockByBrand: StockByBrand[]
}

export default function SalesByBrandPage({ listSalesByBrand, listStockByBrand }: SalesByBrandPageProps) {
    const [salesByBrand, setSalesByBrand] = useState(listSalesByBrand || [])
    const [stockByBrand, setStockByBrand] = useState(listStockByBrand || [])
    const [selectedDateRange, setSelectedDateRange] = useState<string>('day');
    const [loading, setLoading] = useState<boolean>(false)

    const { today, year, month, startOfWeek, endOfWeek } = getDate()
    const [dateRange, setDateRange] = useState<DateRangeState>({
        start: today,
        end: today
    });

    const handleFetchData = async () => { await fetchSalesByBrand({ dateInit: dateRange.start, dateEnd: dateRange.end, setLoading, setSalesByBrand, setStockByBrand }) }
    async function handleCleanFilter() {
        await fetchSalesByBrand({
            dateInit: dateRange.start,
            dateEnd: dateRange.end,
            setLoading,
            setSalesByBrand,
            setStockByBrand
        })
    }

    const handleDate = async (date: string) => {
        setSelectedDateRange(date);
        switch (date) {
            case DateRange.Day:
                setDateRange({ start: today, end: today });
                await fetchSalesByBrand({
                    dateInit: today,
                    dateEnd: today,
                    setLoading,
                    setSalesByBrand,
                    setStockByBrand
                })
                break;
            case DateRange.Week:
                setDateRange({ start: startOfWeek, end: endOfWeek });

                await fetchSalesByBrand({
                    dateInit: startOfWeek,
                    dateEnd: endOfWeek,
                    setLoading,
                    setSalesByBrand,
                    setStockByBrand
                })
                break;
            case DateRange.Month:
                setDateRange({ start: `${year}/${month}/01`, end: today });
                await fetchSalesByBrand({
                    dateInit: `${year}/${month}/01`,
                    dateEnd: today,
                    setLoading,
                    setSalesByBrand,
                    setStockByBrand
                })
                break;
            case DateRange.MonthYesterday:
                setDateRange({ start: `${year}/${month - 1}/01`, end: today });
                await fetchSalesByBrand({
                    dateInit: `${year}/${month - 1}/01`,
                    dateEnd: `${year}/${month - 1}/30`,
                    setLoading,
                    setSalesByBrand,
                    setStockByBrand
                })
                break;
            case DateRange.Year:
                setDateRange({ start: `${year}/01/01`, end: today });
                await fetchSalesByBrand({
                    dateInit: `${year}/01/01`,
                    dateEnd: today,
                    setLoading,
                    setSalesByBrand,
                    setStockByBrand
                })
                break;
        }
    };

    return (
        <PageLayout description="Vendas por marcas">
            <Container>
                <ToolBar title="Vendas por marcas" handleRefreshClick={handleFetchData} displayBtnDate={true} selectedDateRange={selectedDateRange} handleDate={handleDate} displayFormOfPayment={true} handleCleanFilter={handleCleanFilter} />
                <ContainerGraphic
                    loading={loading}
                    children={
                        <BarChart
                            data={salesByBrand}
                            dataKey="value"
                            dataKeyXAxis="brand"
                            displayXAxis={true}
                            displayCartesianGrid={true}
                            palette={highlightedColor}
                            LabelListProps={{
                                dataKey: "value",
                                content: (props) => (
                                    <CustomFormattedLabel
                                        {...props}
                                        position="top"
                                        formatter={formatCurrency}
                                        fill="#4b5563"
                                        className="font-bold text-[11px] items-center flex w-full justify-center truncate "
                                        value={(props as any).value}
                                    />
                                ),
                            }}
                        />
                    }
                />
            </Container>
            <Container>
                <h1 className="font-bold md:text-lg text-sm p-5">Estoque em valor X Endividamento por marca</h1>
                <ContainerGraphic loading={false} children={<BarChartComparison data={stockByBrand} xKey="brand" dataKeyOne="valueInStock" dataKeyTwo="debtValue" nameKeyOne="Estoque" nameKeyTwo="Dívida" />} />
            </Container>
        </PageLayout>
    )
}

export const getServerSideProps = getSalesByBrandPageProps; 