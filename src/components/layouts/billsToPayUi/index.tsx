'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/ToolBar";
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer";
import { CustomTooltip } from '@/components/ui/sciences/toolTip';
import PieChart from "@/components/ui/sciences/graphics/pieChart";
import { ExternalPieLabel } from "@/components/ui/sciences/label";
import BarChart from "@/components/ui/sciences/graphics/barChart";
import DescriptionGraphic from "@/components/ui/sciences/description";

// Utils
import { FilterSelecting, SelectingCostCenter } from "@/utils/filters/billsToPay/selecting";
import { fetchBillsToPay } from "@/utils/data/fetchData/refresh/fetchBillsToPay";

// Dados
import InfoCardFromBillsToPay from "@/data/infoCard/billsToPay";
import vibrantPalette from '@/data/palettes/vibrant.json';

// Tipagem
import { BillsToPayData } from "@/types/billsToPay";
import { SelectionDescription } from "@/types/filters/selectionDescription";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

interface LayouProps {
    allBillets: BillsToPayData[];
    listBilletInOpen: BillsToPayData[];
    listBilletPaid: BillsToPayData[];
    listOfExpiredInvoices: BillsToPayData[];
    year: number;
    month: number;
    monthExpired: number;
    yesterday: number;
    today: string;
}

export default function UiBillsToPay({ allBillets, listBilletInOpen, listBilletPaid, listOfExpiredInvoices, year, month, monthExpired, yesterday, today }: LayouProps) {
    const [billets, setBillets] = useState(allBillets || [])
    const [billetInopen, setBilletInOpen] = useState(listBilletInOpen || [])
    const [billetPaid, setBilletPaid] = useState(listBilletPaid || [])
    const [lateBills, setLateBills] = useState(listOfExpiredInvoices || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [filters, setFilters] = useState<SelectionDescription[]>([])
    const [clearFilter, setClearFilter] = useState<boolean>(true);
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const { token } = useContext(AuthContext)
    const { infoDetailCard } = InfoCardFromBillsToPay({ listBilletInOpen: billetInopen, listBilletPaid: billetPaid, listBilletExpired: lateBills, costCenterFilter: filters })
    const { selectCostCenter, sortedCostCenters } = FilterSelecting({ data: billets, filter: filters })
    const { handleSelectingCostCenter } = SelectingCostCenter({ setFilters, filters })

    const handleRefresh = async () => {
        await fetchBillsToPay({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            year,
            month: monthExpired,
            day: yesterday,
            clear: clearFilter,
            setBillets,
            setBilletInOpen,
            setBilletPaid,
            setLateBills,
            setLoading
        })
    }

    const handleDateRangerPicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)
        setClearFilter(true)

        await fetchBillsToPay({
            token,
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            year,
            month: monthExpired,
            day: yesterday,
            clear: true,
            setBillets,
            setBilletInOpen,
            setBilletPaid,
            setLateBills,
            setLoading
        })
    }

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(today).toISOString().split('T')[0]) })
        setFilters([])
        setClearFilter(false)

        await fetchBillsToPay({
            token,
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            year,
            month: monthExpired,
            day: yesterday,
            clear: false,
            setBillets,
            setBilletInOpen,
            setBilletPaid,
            setLateBills,
            setLoading
        })
    }

    return (
        <>
            <InfoCard data={infoDetailCard} />
            <Container>
                <ToolBar title="Contas a pagar" descriptionHref="Tabela" href="/billstopay/table" dateRange={date} handleRefreshClick={handleRefresh} handleDateRangePicker={handleDateRangerPicker} handleCleanFilter={handleCleanFilter} />
                <GraphicContainer loading={loading}>
                    <PieChart data={selectCostCenter} displayToolTip={true} ToolTipComponent={(props) => (<CustomTooltip {...props} dataKey={'suppliers'} />)} dataKey="value" label={(props) => <ExternalPieLabel {...props} data={selectCostCenter} />} />
                    <BarChart data={selectCostCenter} dataKey="value" palette={vibrantPalette} displayToolTip={true} ToolTipComponent={(props) => (<CustomTooltip {...props} dataKey={'suppliers'} />)} />
                </GraphicContainer>
                <div className="flex w-full p-2 overflow-auto">
                    <DescriptionGraphic data={sortedCostCenters} dataKey="description" handleSelection={handleSelectingCostCenter} />
                </div>
            </Container>
        </>
    )
}