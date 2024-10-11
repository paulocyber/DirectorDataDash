'use client'

// React
import { formatCurrency } from "@/utils/mask/money";
import { AuthContext } from "@/contexts/AuthContext";

// Componente
import ToolBar from "../ui/toolbar";
import { useContext, useState } from "react";
import { DateValue, Progress, RangeValue } from "@nextui-org/react";
import Container from "../ui/container";
import { Button } from "../ui/button";
import GraphicContainer from "../ui/sciences/graphics/GraphicContainer";
import BarChart from "../ui/sciences/graphics/BarChart";

// Dados
import highLightColor from "@/data/palettes/brands/highlightedColor.json"

// Biblioteca
import { IoIosArrowDown } from "react-icons/io";
import { FaFlag, FaHotel } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

// Utils
import { getMonthName } from "@/utils/mask/date/getMonthName";
import { getEmpName } from "@/utils/emp/getEmpName";
import { fetchSales } from "@/utils/fetchData/fetchSales";

// Tipagem
import { parseDate } from '@internationalized/date';
import { topClientsPlusBuyData } from "@/utils/types/sales";
import { SellersTooltip } from "../ui/sciences/graphics/PieChart/ToolTip/sellers";
type SalesData = {
    name: string;
    value: number;
};

interface LayoutProps {
    salesAndGolas: SalesData[];
    topClients: topClientsPlusBuyData[]
    commision: number;
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function Layout({ salesAndGolas, topClients, commision, year, month, today }: LayoutProps) {
    const [sales, setSales] = useState<SalesData[]>(salesAndGolas);
    const [clients, setClients] = useState(topClients)
    const [commisionValue, setComissionValue] = useState(commision || 0)
    const [emp, setEmp] = useState('1');
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const lastDay = getLastDayOfMonth(date.end.year, date.end.month);
    const { token, user } = useContext(AuthContext)

    const handleRefresh = async () => {
        await fetchSales({
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            setLoading,
            setSales,
            setComission: setComissionValue,
            setClients,
            surname: user,
            token
        })
    }

    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate);
        await fetchSales({
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            setLoading,
            setSales,
            setComission: setComissionValue,
            setClients,
            surname: user,
            token
        });
    };

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(today).toISOString().split('T')[0]) })
        await fetchSales({
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            setLoading,
            setSales,
            setComission: setComissionValue,
            setClients,
            surname: user,
            token
        })
    }

    return (
        <>
            <Container>
                <ToolBar
                    title={`Metas de ${getMonthName(date.start.month)}`}
                    displayCalendar={true}
                    dateRange={date}
                    handleRefreshClick={handleRefresh}
                    handleDateRangePicker={handleDateRangePicker}
                    handleCleanFilter={handleCleanFilter}
                />
                <div className="w-full flex px-7">
                    <Progress
                        size="md"
                        value={sales[0].value}
                        maxValue={sales[1].value !== 0 ? sales[1].value : 1}
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
                                <MdOutlineAttachMoney className="text-lg" />
                                <p className="pl-2 text-sm flex">Comissão: <span className="font-bold px-2">{formatCurrency(commisionValue)}</span></p>
                            </div>
                        </div>
                    </Container>
                </div>

                <div className="w-full">
                    <Container>
                        <h2 className="font-bold px-4 py-4">Top Clientes do dia</h2>
                        <GraphicContainer loading={false} children={<BarChart data={clients} dataKey="VALOR_LIQUIDO" dataKeyXAxis="NOME_CLIENTE" displayXAxis={true} displayCartesianGrid={true} palette={highLightColor} displayToolTip={true} ToolTipComponent={SellersTooltip}/>} />
                    </Container>
                </div>
            </div>
        </>
    )
}