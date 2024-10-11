'use client'

// React
import React, { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Biblioteca
import { Autocomplete, AutocompleteItem, DateValue, Progress, RangeValue } from "@nextui-org/react";
import { IoIosArrowDown } from "react-icons/io";
import { FaFlag, FaHotel } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

// Dados
import highLightColor from '@/data/palettes/brands/highlightedColor.json';

// Compnentes
import Container from "../ui/container";
import { Button } from "../ui/button";
import GraphicContainer from "../ui/sciences/graphics/GraphicContainer";
import ToolBar from "../ui/toolbar";
import { CustomActiveShapePieChart } from './../ui/sciences/graphics/PieChart/CustomActiveShapePieChart/index';
import { InternalPieLabel } from "../ui/sciences/graphics/PieChart/Label"
import DescriptionGraphic from "../ui/sciences/graphics/description";
import { SalesTooltip, SellersTooltip } from "../ui/sciences/graphics/PieChart/ToolTip/sellers";
import BarChart from "../ui/sciences/graphics/BarChart";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { getEmpName } from "@/utils/emp/getEmpName";
import { getMonthName } from "@/utils/mask/date/getMonthName";
import { fetchSales } from "@/utils/fetchData/fetchSales/admin";

// Tipagem
import { Sellers } from "@/utils/types/sellers";
import { salesData, topClientsPlusBuyData, topSalesData } from "@/utils/types/sales"
import { parseDate } from '@internationalized/date';
interface SalesProps {
    salesData: salesData[];
    sellersData: Sellers[];
    topSalesData: topSalesData[];
    topClientsData: topClientsPlusBuyData[];
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function Layout({ salesData, sellersData, topSalesData, topClientsData, year, month, today }: SalesProps) {
    const [sales, setSales] = useState<salesData[]>(salesData || [])
    const [sellers, setSellers] = useState(sellersData || []);
    const [emp, setEmp] = useState('1')
    const [selectSeller, setSelectSeller] = useState<string>('')
    const [topSeller, setTopSaller] = useState(topSalesData || [])
    const [topClients, setTopClients] = useState(topClientsData || [])
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
            setTopSaller,
            setTopClients
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
            setTopSaller,
            setTopClients
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
            setTopSaller,
            setTopClients
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
            surname: key ? key.toString() : '',
            emp,
            setSales,
            setTopSaller,
            setTopClients
        })
    }

    return (
        <>
            <Container>
                <ToolBar
                    title={`Metas de ${getMonthName(date.start.month)}`}
                    emp={emp}
                    displayCalendar={true}
                    displayEmp={true}
                    handleRefreshClick={handleRefresh}
                    dateRange={date}
                    handleDateRangePicker={handleDateRangePicker}
                    handleCleanFilter={handleCleanFilter}
                    setEmp={setEmp}
                >
                    <div className="w-full sm:flex">
                        <div className="mr-auto md:mr-4 mt-2 md:w-56 small-screen:w-full">
                            <Autocomplete
                                aria-label="Filtro de vendedores"
                                placeholder="Selecione o vendedor"
                                size="sm"
                                value={selectSeller}
                                onSelectionChange={handleFilters}
                                variant="bordered"
                                defaultItems={sellers}
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
                        aria-label="Progressão das vendas"
                        classNames={{
                            value: "text-sm"
                        }}
                    />
                </div>

                <div className="w-full flex flex-col py-3 px-7">
                    <span className="text-xl font-bold text-emerald-500 dark:text-white">
                        {formatCurrency(sales[0].value)}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-white">
                        Acumulados da meta de <span className="font-bold">{formatCurrency(sales[1].value)}</span>
                    </p>
                </div>
            </Container>

            <div className="w-full lg:flex">
                <div className="lg:w-2/5 flex-col">
                    <Container>
                        <h2 className="font-bold px-4 pt-3">Top 10 Vendedores</h2>
                        <div className="w-full justify-center flex">
                            <div className="w-full flex justify-center">
                                <GraphicContainer loading={false}>
                                    <CustomActiveShapePieChart data={topSeller} valueKey="VALOR_TOTAL_LIQUIDO" displayToolTip={true} ToolTipComponent={SalesTooltip} label={(props) => <InternalPieLabel {...props} data={topSeller} />} />
                                </GraphicContainer>
                            </div>

                            <div className="flex px-2 max-h-full justify-end items-center">
                                <div className="hidden lg:flex lg:flex-col overflow-auto">
                                    <DescriptionGraphic data={topSeller} dataKey="VENDEDOR" />
                                </div>
                            </div>
                        </div>
                    </Container>

                    <Container>
                        <div className="w-full flex px-4 justify-between items-center p-2">
                            <h2 className="font-bold">Meta</h2>
                            <Button startContent={<IoIosArrowDown />} className="bg-transparent" size="sm" />
                        </div>

                        <div className="w-full">
                            <div className="flex w-full px-4 pb-3 items-center">
                                <FaFlag className="text-sm" />
                                <span className="pl-3 text-sm flex">
                                    01 de {getMonthName(date.start.month)} -
                                    <p className="text-sm pl-2 truncate">{lastDay} de {getMonthName(date.start.month)}</p>
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
                <div className="lg:w-3/5 flex-col">
                    <Container>
                        <h2 className="font-bold p-3">Top Clientes</h2>
                        <GraphicContainer loading={false} children={<BarChart data={topClients} dataKey="VALOR_LIQUIDO" dataKeyXAxis="NOME_CLIENTE" displayXAxis={true} displayCartesianGrid={true} palette={highLightColor} displayToolTip={true} ToolTipComponent={SellersTooltip}/>} />
                    </Container>
                </div>
            </div>
        </>
    )
}