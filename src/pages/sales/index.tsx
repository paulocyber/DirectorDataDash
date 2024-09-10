// React
import { useState } from "react";

// Components
import Container from "@/components/ui/container";
import GraphicContainer from "@/components/ui/container/graphic";
import PageLayout from "@/components/ui/layout";
import { CustomLabel } from "@/components/ui/sciences/pieChart/label/billsToPay";
import SalesTooltip from "@/components/ui/sciences/pieChart/toolTip/sales";
import ToolBar from "@/components/ui/toolbar";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/ui/sciences/BarChart";

// Biblioteca
import { IoIosArrowDown } from "react-icons/io";
import { Autocomplete, AutocompleteItem, DateValue, Progress, RangeValue } from "@nextui-org/react";
import { FaClockRotateLeft, FaFlag, FaHotel } from "react-icons/fa6";

// Utils
import { fetchSales } from "@/utils/fetchData/fetchSales";
import getDate from "@/utils/date/currentDate";
import { getSalesPageProps } from "@/utils/server/salesPageProps";
import { formatCurrency } from "@/utils/mask/formatCurrency";
import { getMonthName } from "@/utils/date/getMonthName";
import { getEmpName } from "@/utils/emp/getEmpName";

// Types
import { salesData, topSalesData } from "@/utils/types/sales";
import { Sellers } from "@/utils/types/sellers";
import { parseDate } from '@internationalized/date';
import { vibrantPalette } from "@/data/graphicColorPalette/vibrantPalette";
interface SalesProps {
    salesData: salesData[];
    sellersData: Sellers[];
    topTenSellerData: topSalesData[];
}

export default function SalesPage({ salesData, sellersData, topTenSellerData }: SalesProps) {
    const [sales, setSales] = useState<salesData[]>(salesData);
    const [sellers, setSellers] = useState(sellersData);
    const [topSeller, setTopSeller] = useState<topSalesData[]>(topTenSellerData)
    const [selectSeller, setSelectSeller] = useState<string>('')
    const [emp, setEmp] = useState('1');
    const [loading, setLoading] = useState<boolean>(false);

    const { year, month, today } = getDate();
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const handleRefresh = async () => {
        await fetchSales({
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            emp,
            sellers: selectSeller,
            setLoading,
            setSales,
            setTopSeller
        });
    };

    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate);
        await fetchSales({
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            emp,
            sellers: selectSeller,
            setLoading,
            setTopSeller,
            setSales
        });
    };

    const handleCleanFilter = async () => {
        const initialDate = {
            start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
            end: parseDate(new Date(today).toISOString().split('T')[0])
        };
        setDate(initialDate);
        setSelectSeller('')
        await fetchSales({
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            emp,
            setLoading,
            setSales,
            setTopSeller
        });
    };

    const handleFilters = async (key: React.Key | null) => {
        setSelectSeller(key as string);

        await fetchSales({
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            setLoading,
            setSales,
            setTopSeller,
            emp,
            sellers: key ? key.toString() : ''
        });
    };

    const getLastDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    return (
        <PageLayout description="Vendas e Metas">
            <Container>
                <ToolBar
                    title={`Metas de ${getMonthName(date.start.month)}`}
                    handleRefreshClick={handleRefresh}
                    displayCalendar={true}
                    dateRange={date}
                    handleDateRangePicker={handleDateRangePicker}
                    handleCleanFilter={handleCleanFilter}
                    displayEmp={true}
                    setEmp={setEmp}
                    emp={emp}
                >
                    <div className="w-full sm:flex ">
                        <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
                            <Autocomplete
                                aria-label="Filtro de vendedores"
                                placeholder="Selecione o vendedor"
                                size="sm"
                                value={selectSeller}
                                onSelectionChange={handleFilters}
                                variant="bordered"
                                defaultItems={sellers}
                                className="max-w-xs"
                                allowsCustomValue={true}
                            >
                                {(seller) => (
                                    <AutocompleteItem key={seller.ID_FNC}>
                                        {seller.APELIDO_PSS}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                        </div>
                    </div>
                </ToolBar>
                <div className="w-full flex px-7">
                    <Progress
                        size="md"
                        value={sales[0].value}
                        maxValue={sales[1].value}
                        color="primary"
                        showValueLabel={true}
                        className=""
                        aria-label="Progressão das vendas"
                        classNames={{
                            value: "text-sm"
                        }}
                    />
                </div>

                <div className="w-full flex flex-col py-3 px-7">
                    <span className="text-xl font-bold text-emerald-500 dark:text-white">{formatCurrency(sales[0].value)}</span>
                    <p className="text-sm text-gray-700 dark:text-white">Acumulados da meta de <span className="font-bold">{formatCurrency(sales[1].value)}</span></p>
                </div>
            </Container>
            <div className="w-full flex">
                <div className="w-1/3">
                    <Container>
                        <div className="w-full flex px-4 justify-between items-center p-2">
                            <div>
                                <h2 className="font-bold">Meta</h2>
                            </div>
                            <div>
                                <Button startContent={<IoIosArrowDown />} className="bg-transparent" size="sm" />
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="flex px-4 pb-3 items-center">
                                <FaFlag className="text-sm" />
                                <span className="pl-3 text-sm flex">01 de {getMonthName(date.start.month)} -  <p className="text-sm pl-2">{getLastDayOfMonth(date.start.year, date.start.month)} de {getMonthName(date.start.month)}</p></span>
                            </div>
                            <div className="flex px-4 pb-3 items-center">
                                <FaHotel className="text-sm" />
                                <span className="pl-3 text-sm flex">Loja {getEmpName(emp)}</span>
                            </div>
                            <div className="flex px-4 pb-3 items-center">
                                <FaClockRotateLeft className="text-sm" />
                                <span className="pl-3 text-sm flex">Agora atrás</span>
                            </div>
                        </div>
                    </Container>
                </div>
                <div className="w-full">
                    <Container>
                        <h2 className="font-bold px-4 pt-3">Top 10 Vendedores</h2>
                        <GraphicContainer loading={false}>
                            <BarChart
                                data={topSeller}
                                dataKey="VALOR_TOTAL_LIQUIDO"
                                dataKeyXAxis="VENDEDOR"
                                displayXAxis={true}
                                displayCartesianGrid={true}
                                palette={vibrantPalette}
                            />
                        </GraphicContainer>
                    </Container>
                </div>
            </div>
        </PageLayout>
    );
}

export const getServerSideProps = getSalesPageProps;