'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Dados
import vibrantPalette from '@/data/palettes/vibrant.json';
import InfoCardFromBillsToPay from "@/data/infoCard/billsToPay";

// Compoenentes
import InfoCard from "../ui/cards";
import ToolBar from "../ui/toolbar";
import Container from "../ui/container";
import GraphicContainer from "../ui/sciences/graphics/GraphicContainer";
import PieChart from "../ui/sciences/graphics/PieChart";
import { ToolTip } from "../ui/sciences/graphics/PieChart/ToolTip";
import { ExternalPieLabel } from "../ui/sciences/graphics/PieChart/Label";
import CustomLabelContent from "../ui/sciences/graphics/BarChart/Label";
import BarChart from "../ui/sciences/graphics/BarChart";
import DescriptionGraphic from "../ui/sciences/graphics/description";

// Utils
import { fetchBillsToPay } from "@/utils/fetchData/fetchBillsToPay";
import { SelectingCostCenter, TopCostCenter } from "@/utils/filters/billsToPay/topCostCenter";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
import { SelectionDescription } from "@/utils/types/SelectionDescription";

interface LayouProps {
    allBillets: BillsToPayItem[];
    listBilletInOpen: BillsToPayItem[];
    listBilletPaid: BillsToPayItem[];
    listOfExpiredInvoices: BillsToPayItem[];
    year: number;
    month: number;
    monthExpired: number;
    yesterday: number;
    today: string;
}

export default function Layout({ allBillets, listBilletInOpen, listBilletPaid, listOfExpiredInvoices, year, month, monthExpired, yesterday, today }: LayouProps) {
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

    const { sortedCostCenters, selectCostCenter } = TopCostCenter({ allBillets: billets, filter: filters })
    const { handleSelectingCostCenter } = SelectingCostCenter({ filters, setFilters });

    return (
        <>
            <InfoCard data={infoDetailCard} />
            <Container>
                <ToolBar title="Contas a pagar" displayCalendar={true} dateRange={date} handleRefreshClick={handleRefresh} handleDateRangePicker={handleDateRangerPicker} handleCleanFilter={handleCleanFilter} href="/billstopay/table" descriptionHref="Tabela" />
                <GraphicContainer loading={loading}>
                    <PieChart data={selectCostCenter} dataKey="value" displayToolTip={true} ToolTipComponent={ToolTip} label={(props) => <ExternalPieLabel {...props} data={selectCostCenter} />} />
                    <BarChart
                        displayToolTip={true}
                        ToolTipComponent={ToolTip}
                        data={selectCostCenter}
                        dataKey="value"
                        palette={vibrantPalette}
                        LabelListProps={{
                            dataKey: "value",
                            content: (props) => <CustomLabelContent {...props} data={selectCostCenter} />
                        }}
                    />
                </GraphicContainer>
                <div className="flex w-full py-4 overflow-auto">
                    <DescriptionGraphic data={sortedCostCenters} dataKey="description" handleSelection={handleSelectingCostCenter} />
                </div>
            </Container>
        </>
    )
}