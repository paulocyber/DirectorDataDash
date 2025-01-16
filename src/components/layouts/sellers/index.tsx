'use client'

// Compononentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import ProgressBar from "@/components/ui/progressBar";
import GraphicContainer from "@/components/ui/Sciences/GraphicContainer";
import Card from "@/components/ui/card";
import BarChart from "@/components/ui/Sciences/BarChart";
import { Tooltip } from "@/components/ui/Sciences/ToolTip";

// Utils
import { getMonthName } from "@/utils/mask/date";
import { formatCurrency } from "@/utils/mask/money";
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/salesHandlers";

// Dados
import vibrantPalette from "@/data/pallets/vibrant.json"

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Biblioteca
import { FaHotel } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

// Next
import Link from "next/link";

// Tipagem
import { parseDate } from '@internationalized/date';
import { ItemsGoalProgress, ItemsTopClientsPlusBuyData } from "@/types/sales";
import { DateValue, RangeValue } from "@nextui-org/react";
interface LayoutSellersProps {
    goalProgressData: ItemsGoalProgress[];
    topClientsData: ItemsTopClientsPlusBuyData[];
    totalCommission: number;
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function LayoutSellers({ goalProgressData, month, today, topClientsData, totalCommission, year }: LayoutSellersProps) {
    const [goalProgress, setGoalProgress] = useState(goalProgressData);
    const [topClients, setTopClients] = useState(topClientsData)
    const [comission, setComission] = useState(totalCommission)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const lastDay = getLastDayOfMonth(date.end.year, date.end.month);
    const { token, user } = useContext(AuthContext)
    
    return (
        <>
            <Container>
                <ToolBar
                    title={`Metas de ${getMonthName(date.start.month)}`}
                    dateRange={date}
                    handleRefreshClick={() => handleRefresh({ date, sellerSurname: user, setComission, setGoalProgress, setLoading, setTopClients, token })}
                    handleCleanFilter={() => handleCleanFilter({ year, month, today, sellerSurname: user, token, setDate, setComission, setGoalProgress, setTopClients, setLoading })}
                    handleDateRangePicker={(date: RangeValue<DateValue> | null) => handleDateFilter({ date: date, sellerSurname: user, token, setLoading, setComission, setGoalProgress, setTopClients, setDate, })}
                />
                <div className="w-full flex-col px-7 py-2">
                    <ProgressBar minValue={goalProgress[0].value} maxValue={goalProgress[1].value} />
                    <div className="w-full flex flex-col py-3">
                        <span className="text-xl font-bold text-emerald-500 dark:text-white">{formatCurrency(goalProgress[0].value)}</span>
                        <p className="text-sm text-gray-700 dark:text-white">Acumulados da meta de <span className="font-bold">{formatCurrency(goalProgress[1].value)}</span></p>
                    </div>
                </div>
            </Container>
            <div className="w-full lg:flex ">
                <div className="lg:w-1/5">
                    <Card
                        title="Meta"
                        lastDay={lastDay}
                        month={date.start.month}
                        dataInformation={[
                            { icon: <FaHotel className="text-sm" />, label: 'Grupo Play', highlight: false },
                            { icon: <MdOutlineAttachMoney className="text-lg" />, label: `Comissão: ${formatCurrency(comission)}`, highlight: true },
                        ]}
                    />
                </div>

                <div className="w-full lg:w-4/5">
                    <Container>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="font-bold px-4 py-4">Top Clientes que mais compra</h2>
                            <Link
                                className="text-sm text-gray-800 hover:underline px-3"
                                href="/latecustomer"
                                aria-label="Visualizar clientes em atraso"
                            >
                                Visualizar Clientes em atraso
                            </Link>
                        </div>
                        <GraphicContainer loading={loading}>
                            <>
                                {topClients.length > 0 ? (
                                    <BarChart
                                        data={topClients}
                                        dataKey="VALOR_LIQUIDO"
                                        dataKeyXAxis="NOME_CLIENTE"
                                        displayXAxis={true}
                                        displayCartesianGrid={true}
                                        displayToolTip={true}
                                        palette={vibrantPalette}
                                        ToolTipComponent={(props) => (
                                            <Tooltip {...props} dataKey="NOME_CLIENTE" valueKey="VALOR_LIQUIDO" />
                                        )}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-5">
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                            Nenhum dado encontrado
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Parece que não há informações disponíveis no momento.
                                        </p>
                                    </div>

                                )}
                            </>

                        </GraphicContainer>
                    </Container>
                </div>
            </div>
        </>
    )
}