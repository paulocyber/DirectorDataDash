'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Dados
import InfoCardFromBillsToPay from "@/data/infoCards/billsToPay";
import vibrantPalette from '@/data/pallets/vibrant.json';

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer"
import PieChart from "@/components/ui/sciences/PieChart";
import { ExternalPieLabel } from "@/components/ui/sciences/labelChart/ExternalPieLabel";
import { Tooltip } from "@/components/ui/sciences/toolTip"
import BarChart from "@/components/ui/sciences/BarChart"
import DescriptionGraphic from "@/components/ui/sciences/description"

// Utils
import { FilterSelecting, SelectingCostCenter } from "@/utils/handlersFilters/billsToPay/selecting";
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/billsToPay";

// Tipagem
import { DateValue, RangeValue } from "@heroui/react";
import { ItemsBillsToPay } from "@/types/billsToPay";
import { parseDate } from '@internationalized/date';
interface LayoutBillsToPayProps {
    allBilletsData: ItemsBillsToPay[];
    openBillsData: ItemsBillsToPay[];
    paidBillsData: ItemsBillsToPay[];
    overdueBillsData: ItemsBillsToPay[];
    year: number;
    month: number;
}

type SelectionDescription = {
    description: string;
    color: string;
    id: number;
};

export default function LayoutBillsToPay({ allBilletsData, openBillsData, paidBillsData, overdueBillsData, year, month }: LayoutBillsToPayProps) {
    const [allBillets, setAllBillets] = useState(allBilletsData)
    const [openBills, setOpenBills] = useState(openBillsData)
    const [paidBills, setPaidBills] = useState(paidBillsData)
    const [overdueBills, setOverdueBills] = useState(overdueBillsData)
    const [filters, setFilters] = useState<SelectionDescription[]>([])
    const [clearFilter, setClearFilter] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const infoCard = InfoCardFromBillsToPay({ openBills, overdueBills, paidBills, costCenterFilter: filters })

    const { token } = useContext(AuthContext)
    const { selectCostCenter, sortedCostCenters } = FilterSelecting({ data: allBillets, filter: filters })
    const { handleSelectingCostCenter } = SelectingCostCenter({ setFilters, filters })

    return (
        <div className="flex flex-col">
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Resumo do Contas a Pagar"
                    descriptionHref="Visualizar em tabela"
                    href="/billstopay/table"
                    handleRefreshClick={() => handleRefresh({ date, token, setLoading, setAllBillets, setOpenBills, setOverdueBills, setPaidBills, clear: clearFilter })}
                    handleCleanFilter={() => handleCleanFilter({ date, token, setClear: setClearFilter, setLoading, setDate, setFilters, setAllBillets, setOpenBills, setOverdueBills, setPaidBills })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, setClear: setClearFilter, setFilters, setLoading, setDate, setAllBillets, setOpenBills, setOverdueBills, setPaidBills })}
                    dateRange={date}
                />
                <div className="flex p-2 overflow-auto border-t rounded-lg">
                    <DescriptionGraphic
                        data={sortedCostCenters}
                        dataKey="description"
                        handleSelection={handleSelectingCostCenter}
                    />
                </div>
            </Container>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                <div className="w-full">
                    <Container>
                        <GraphicContainer loading={loading}>
                            <PieChart
                                data={selectCostCenter}
                                dataKey="value"
                                displayToolTip={true}
                                ToolTipComponent={(props) => (
                                    <Tooltip {...props} dataKey={'suppliers'} />
                                )}
                                label={(props) => (
                                    <ExternalPieLabel {...props} data={selectCostCenter} />
                                )}
                            />
                        </GraphicContainer>
                    </Container>
                </div>

                <div className="w-full">
                    <Container>
                        <GraphicContainer loading={loading}>
                            <BarChart
                                data={selectCostCenter}
                                displayCartesianGrid={true}
                                dataKey="value"
                                palette={vibrantPalette}
                                displayToolTip={true}
                                ToolTipComponent={(props) => (
                                    <Tooltip {...props} dataKey={'suppliers'} />
                                )}
                            />
                        </GraphicContainer>
                    </Container>
                </div>
            </div>
        </div>
    )
}