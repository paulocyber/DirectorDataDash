'use client'

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Componentes
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolbar";
import ProgressBar from "@/components/ui/progressBar";;
import Card from "@/components/ui/card";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer";
import BarChart from "@/components/ui/sciences/BarChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import DescriptionGraphic from "@/components/ui/sciences/description";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { getMonthName } from "@/utils/mask/date";
import { handleRefresh, handleDateFilter, handleCleanFilter } from "@/utils/handlersFilters/salesHandlers/(admin)";
import SalesPdf from "@/utils/relatorys/sales";

// Bibliotecas
import { FaHotel } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useAtom } from "jotai";

// Atom
import { enterprisesAtom } from "@/atom/employees";
import { refreshAtom } from "@/atom/refresh";
import { tablesAtom } from "@/atom/tables";

// Next
import Link from "next/link";

// Dados
import vibrantPalette from '@/data/pallets/vibrant.json';

// Tipagem
import { DateValue, parseDate } from "@internationalized/date";
import { RangeValue, useDisclosure } from "@heroui/react"
import { ItemsGoalProgress, ItemsProfitsFromSale, ItemsTopSellers } from "@/types/sales";
import Modal from "@/components/ui/modal";
import { SettingsSales } from "@/components/ui/settings/salesGoal";
interface LayoutSalesGoalProps {
    goalProgress: ItemsGoalProgress[];
    topSellersData: ItemsTopSellers[]
    profitSalesData: ItemsProfitsFromSale[];
    enterprises: { ID_EMP: string, SIGLA_EMP: string }[]
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function LayoutSalesGoal({ goalProgress, topSellersData, profitSalesData, enterprises, year, month, today }: LayoutSalesGoalProps) {
    const [salesProgress, setSalesProgress] = useState(goalProgress);
    const [topSellers, setTopSellers] = useState(topSellersData);
    const [profitSales, setProfitSales] = useState(profitSalesData);
    const [filterSellers, setFilterSellers] = useState<string>('');
    const [company, setCompany] = useAtom(enterprisesAtom)
    const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom)
    const [tables, setTables] = useAtom(tablesAtom)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function selection(description: string) {
        setFilterSellers(description)
        handleRefresh({ token, date, company, sellers: description, tables, setLoading, setSalesProgress, setTopSellers, setProfitSales })
    }

    function getGroupName(company: string[]): string {
        const allGroups = ['1', '2', '3', '4', '5'];

        if (company.length === 1 && company.includes('1')) return 'PlayCell';
        if (company.length === 1 && company.includes('2')) return 'PlayPerson';
        if (company.length === 1 && company.includes('3')) return 'PlayUp';
        if (company.length === 1 && company.includes('4')) return 'PlayCapas';
        if (company.length === 1 && company.includes('5')) return 'Inow';
        if (allGroups.every((group) => company.includes(group))) return 'Grupo Play';

        return 'Grupo Desconhecido';
    }

    function generatePdf() {
        SalesPdf({
            dateInit: `${date.start.day}/${date.start.month}/${date.start.year}`,
            dateEnd: `${date.end.day}/${date.end.month}/${date.end.year}`,
            company: getGroupName(company),
            goalProgress: salesProgress,
            profitSales: profitSales,
        })
    }

    useEffect(() => {
        if (activeRefresh) {
            handleRefresh({ token, date, company, sellers: filterSellers, tables, setLoading, setSalesProgress, setTopSellers, setProfitSales })
            setActiveRefresh(false);
        }
    }, [activeRefresh]);

    return (
        <>
            <Container>
                <ToolBar
                    title={`Metas de ${getMonthName(date.start.month)}`}
                    handleRefreshClick={() => handleRefresh({ token, date, company, sellers: filterSellers, tables, setLoading, setSalesProgress, setTopSellers, setProfitSales })}
                    handleDateRangePicker={(date: RangeValue<DateValue> | null) => handleDateFilter({ token, date: date, company, tables, setDate, setLoading, setSalesProgress, setTopSellers, setProfitSales })}
                    handleCleanFilter={() => handleCleanFilter({ token, company, setFilterSellers, setDate, setLoading, setSalesProgress, setTopSellers, setProfitSales, setCompany })}
                    dateRange={date}
                    exportToPDF={generatePdf}
                    handleFilters={onOpen}
                />
                <div className="w-full flex-col px-7 py-2">
                    <ProgressBar minValue={salesProgress[0].value} maxValue={salesProgress[2].value} />
                    <div className="w-full flex flex-col py-3">
                        <span className="text-xl font-bold text-emerald-500 dark:text-white">{formatCurrency(salesProgress[0].value)}</span>
                        <p className="text-sm text-gray-700 dark:text-white">Acumulados da meta de <span className="font-bold">{formatCurrency(salesProgress[2].value)}</span></p>
                    </div>
                </div>
            </Container>
            <div className="w-full lg:flex ">
                <div className="lg:w-1/5">
                    <Card
                        title="Meta"
                        lastDay={getLastDayOfMonth(date.end.year, date.end.month)}
                        month={date.start.month}
                        dataInformation={[
                            { icon: <FaHotel className="text-sm" />, label: `${getGroupName(company)}`, highlight: false },
                            { icon: <FaClockRotateLeft className="text-sm" />, label: `Agora atrás`, highlight: false },
                        ]}
                    />
                </div>

                <div className="w-full lg:w-4/5">
                    <Container>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="font-bold px-4 py-4">Ranking Vendas</h2>
                            <Link
                                className="text-sm text-gray-800 hover:underline px-3"
                                href="/latecustomer"
                                aria-label="Visualizar clientes em atraso"
                            >
                                Visualizar Clientes em atraso
                            </Link>
                        </div>

                        <div className="w-full flex">
                            <div className="w-5/6">
                                <GraphicContainer loading={loading}>
                                    <BarChart
                                        data={topSellers}
                                        dataKey="VALOR_LIQUIDO"
                                        palette={vibrantPalette}
                                        displayToolTip={true}
                                        displayCartesianGrid={true}
                                        ToolTipComponent={(props) => (<Tooltip {...props} dataKey='VENDEDOR' valueKey='VALOR_LIQUIDO' />)}
                                    />

                                </GraphicContainer>
                            </div>
                            <div className="flex-col h-[380px] w-1/6 overflow-auto rounded-lg">
                                <DescriptionGraphic data={topSellers} dataKey="VENDEDOR" selectingKey="ID_PSS" handleSelection={selection} />
                            </div>
                        </div>
                    </Container>
                </div >
            </div >
            <Modal title="Configurações de Filtros" isopen={isOpen} onOpenChange={onOpenChange} setActiveRefresh={setActiveRefresh}>
                <SettingsSales enterprises={enterprises} />
            </Modal>
        </>
    )
}