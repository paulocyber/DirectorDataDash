'use client'

// React
import React, { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Biblioteca
import { Autocomplete, AutocompleteItem, DateValue, Progress, RangeValue } from "@nextui-org/react";
import { IoIosArrowDown } from "react-icons/io";
import { FaFlag, FaHotel } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { toast } from "react-toastify";

// Dados
import vibrantPalette from "@/data/palettes/vibrant.json"

// Compnentes
import Container from "../ui/container";
import { Button } from "../ui/button";
import GraphicContainer from "../ui/sciences/graphics/GraphicContainer";
import ToolBar from "../ui/toolbar";
import BarChart from "../ui/sciences/graphics/BarChart";
import SalesTooltip from "../ui/sciences/graphics/PieChart/ToolTip/sellers";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { getEmpName } from "@/utils/emp/getEmpName";
import { getMonthName } from "@/utils/mask/date/getMonthName";
import { fetchSales } from "@/utils/fetchData/fetchSales/admin";

// Tipagem
import { Sellers } from "@/utils/types/sellers";
import { salesData, topSalesData } from "@/utils/types/sales"
import { parseDate } from '@internationalized/date';
interface SalesProps {
    salesData: salesData[];
    sellersData: Sellers[];
    topSalesData: topSalesData[];
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function Layout({ salesData, sellersData, topSalesData, year, month, today }: SalesProps) {
    const [sales, setSales] = useState<salesData[]>(salesData || [])
    const [sellers, setSellers] = useState(sellersData || []);
    const [emp, setEmp] = useState('1')
    const [selectSeller, setSelectSeller] = useState<string>('')
    const [topSeller, setTopSaller] = useState(topSalesData || [])
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const lastDay = getLastDayOfMonth(date.end.year, date.end.month);
    const { token } = useContext(AuthContext)

    const handleRefresh = async () => {
        await fetchSales({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            year: date.start.year,
            month: date.start.month,
            emp,
            setSales,
            setTopSaller
        })
    }

    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)
        await fetchSales({
            token,
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            year: newDate.start.year,
            month: newDate.start.month,
            emp,
            setSales,
            setTopSaller
        })

    }

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(today).toISOString().split('T')[0]) })

        await fetchSales({
            token,
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            year,
            month,
            emp,
            setSales,
            setTopSaller
        })
    }

    const handleFilters = async (key: React.Key | null) => {
        setSelectSeller(key as string)
        setSelectSeller('')

        await fetchSales({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            year: date.start.year,
            month: date.start.month,
            emp,
            surname: key ? key.toString() : '',
            setSales,
            setTopSaller
        })
    }

    return (
        <>
            <Container>
                <ToolBar title={`Metas de ${getMonthName(date.start.month)}`} emp={emp} displayCalendar={true} displayEmp={true} handleRefreshClick={handleRefresh} dateRange={date} handleDateRangePicker={handleDateRangePicker} handleCleanFilter={handleCleanFilter} setEmp={setEmp}>
                    <div className="w-full sm:flex">
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
                <div className='mr-auto mb-2 w-full sm:hidden flex w-full px-4'>
                    <Autocomplete
                        aria-label="Filtro de vendedores"
                        placeholder="Selecione o vendedor"
                        size="sm"
                        value={selectSeller}
                        onSelectionChange={handleFilters}
                        variant="bordered"
                        defaultItems={sellers}
                        className=""
                        allowsCustomValue={true}
                    >
                        {(seller) => (
                            <AutocompleteItem key={seller.ID_FNC}>
                                {seller.APELIDO_PSS}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                </div>
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
            <div className="w-full lg:flex ">
                <div className="lg:w-1/3">
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
                            <div className="flex w-full px-4 pb-3 items-center">
                                <FaFlag className="text-sm" />
                                <span className="pl-3 text-sm flex truncate ">
                                    01 de {getMonthName(date.start.month)} -
                                    <p className="text-sm pl-2 truncate">
                                        {lastDay} de {getMonthName(date.start.month)}
                                    </p>
                                </span>
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
                                displayToolTip={true}
                                ToolTipComponent={SalesTooltip}
                                displayXAxis={true}
                                displayCartesianGrid={true}
                                palette={vibrantPalette}
                            />
                        </GraphicContainer>
                    </Container>
                </div>
            </div>
        </>
    )
}