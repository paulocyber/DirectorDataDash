'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import ProgressBar from "@/components/ui/progressBar";
import Card from "@/components/ui/card";
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer";
import BarChart from "@/components/ui/sciences/graphics/BarChart/index";
import { CustomTooltip } from "@/components/ui/sciences/toolTip";

// Bibliotecas
import { FaHotel } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

// Dados
import paletteVibrant from "@/data/palettes/vibrant.json"

// Utils
import { getMonthName } from "@/utils/mask/date";
import { formatCurrency } from './../../../utils/mask/money/index';
import { getEmpName } from "@/utils/mask/nameEnterprise";
import { fetchSales } from "@/utils/data/fetchData/refresh/fetchSales";

// Tipagem
import { parseDate } from '@internationalized/date';
import { salesProgressData, topClientsPlusBuyData } from "@/types/sales";
import { DateValue, RangeValue } from "@nextui-org/react";

interface UiSellersProps {
    goalProgressData: { name: string; value: number; }[];
    topClientsData: topClientsPlusBuyData[]
    valueComission: number;
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function UiSellers({ goalProgressData, topClientsData, valueComission, year, month, today }: UiSellersProps) {
    const [goalProgress, setGoalProgress] = useState<salesProgressData[]>(goalProgressData);
    const [topClients, setTopClients] = useState(topClientsData)
    const [commissionValue, setCommissionValue] = useState(valueComission)
    const [emp, setEmp] = useState('1')
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });
    const [loading, setLoading] = useState<boolean>(false)

    const lastDay = getLastDayOfMonth(date.end.year, date.end.month);
    const { token, user } = useContext(AuthContext)

    const handleRefresh = async () => {
        await fetchSales({
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            sellersSurname: user,
            token,
            setLoading,
            setCommissionValue,
            setGoalProgress,
            setTopClients
        })
    }

    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)
        await fetchSales({
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            sellersSurname: user,
            token,
            setLoading,
            setCommissionValue,
            setGoalProgress,
            setTopClients
        })
    }

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(today).toISOString().split('T')[0]) })
        await fetchSales({
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            sellersSurname: user,
            token,
            setLoading,
            setCommissionValue,
            setGoalProgress,
            setTopClients
        })
    }

    return (
        <>
            <Container>
                <ToolBar title={`Metas de ${getMonthName(date.start.month)}`} dateRange={date} handleRefreshClick={handleRefresh} handleDateRangePicker={handleDateRangePicker} handleCleanFilter={handleCleanFilter} />
                <ProgressBar minValue={goalProgress[0].value} maxValue={goalProgress[1].value} />
            </Container>
            <div className="w-full lg:flex ">
                <div className="lg:w-1/3">
                    <Card
                        title="Meta"
                        lastDay={lastDay}
                        month={date.start.month}
                        dataInformation={[{ icon: <FaHotel className="text-sm" />, label: `Loja ${getEmpName(emp)}`, highlight: false }, { icon: <MdOutlineAttachMoney className="text-lg" />, label: `Comissão: ${formatCurrency(commissionValue)}`, highlight: true }]}
                    />
                </div>

                <div className="w-full">
                    <Container>
                        <h2 className="font-bold px-4 py-4">Top Clientes do dia</h2>
                        <GraphicContainer
                            loading={loading}
                            children={
                                <BarChart
                                    data={topClients}
                                    dataKey="VALOR_LIQUIDO"
                                    dataKeyXAxis="NOME_CLIENTE"
                                    displayXAxis={true}
                                    displayCartesianGrid={true}
                                    palette={paletteVibrant}
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <CustomTooltip {...props} dataKey='NOME_CLIENTE' />
                                    )}
                                />
                            }
                        />
                    </Container>
                </div>
            </div>
        </>
    )
}