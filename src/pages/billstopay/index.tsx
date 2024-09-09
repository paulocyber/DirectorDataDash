// Framework - Servidor
import { getBillsToPayPageProps } from "@/utils/server/billsToPayPageProps";

// Componentes
import PageLayout from "@/components/ui/layout";
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import ContainerGraphic from "@/components/ui/container/graphic";
import { ToolTip } from "@/components/ui/sciences/pieChart/toolTip/billsToPay";
import BarChart from "@/components/ui/sciences/BarChart";
import { CustomLabel } from "@/components/ui/sciences/pieChart/label/billsToPay";
import DescriptionGraphic from "@/components/ui/sciences/descriptionGraphic";
import CustomLabelContent from "@/components/ui/sciences/BarChart/labelList/billsToPay";
import PieChart from "@/components/ui/sciences/pieChart";

// React
import { useState } from "react";

// Dados
import { InfoCardFromBillsToPay } from "@/data/infoCard/billsToPay";
import { vibrantPalette } from "@/data/graphicColorPalette/vibrantPalette";

// Utils
import { fetchBillsToPay } from "@/utils/fetchData/fetchBillsToPay";
import { TopCostCenter } from "@/utils/filters/billsToPay/topCostCenter";
import { SelectingCostCenter } from "@/utils/filters/billsToPay/handleSelectingCosCenter";
import getDate from "@/utils/date/currentDate";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { SelectionDescription } from "@/utils/types/selectionDescription";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
interface BillsToPayProps {
    listBilletInOpen: BillsToPayItem[];
    listBilletPaid: BillsToPayItem[];
    listOfExpiredInvoices: BillsToPayItem[];
    listBilletPaidAndInOpen: BillsToPayItem[];
}

export default function BillsToPayPage({ listBilletInOpen, listBilletPaid, listOfExpiredInvoices, listBilletPaidAndInOpen }: BillsToPayProps) {
    const [billetInopen, setBilletInOpen] = useState(listBilletInOpen || [])
    const [billetPaid, setBilletPaid] = useState(listBilletPaid || [])
    const [lateBills, setLateBills] = useState(listOfExpiredInvoices || [])
    const [allBillets, setAllBillets] = useState(listBilletPaidAndInOpen || [])
    const [expiredByDate, setExpiredByDate] = useState<boolean>(false)
    const [filters, setFilters] = useState<SelectionDescription[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    // Filtro por data 
    const { year, month, today } = getDate()

    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const { infoDetailCard } = InfoCardFromBillsToPay({ listBilletExpired: lateBills, listBilletInOpen: billetInopen, listBilletPaid: billetPaid, costCenterFilter: filters })

    const { handleSelectingCostCenter } = SelectingCostCenter({ filters, setFilters });
    const handleFetchData = async () => { await fetchBillsToPay({ dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`, dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`, setLoading, setBilletInOpen, setBilletPaid, setLateBills, setAllBillets, expiredByDate }) }
    async function handleCleanFilter() {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) })
        setFilters([])
        setExpiredByDate(false);

        await fetchBillsToPay({
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            setLoading,
            setBilletInOpen,
            setBilletPaid,
            setLateBills,
            setAllBillets,
            expiredByDate: false
        })
    }

    async function handleDateRangePicker(newDate: RangeValue<DateValue>) {
        setDate(newDate);
        setFilters([])
        setExpiredByDate(true);

        // Passar o novo valor de `newDate` diretamente
        await fetchBillsToPay({
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            setLoading,
            setBilletInOpen,
            setBilletPaid,
            setLateBills,
            setAllBillets,
            expiredByDate: true
        });
    }

    const { sortedCostCenters, selectCostCenter } = TopCostCenter({ allBillets, filter: filters })

    return (
        <PageLayout description="Contas a pagar">
            <InfoCard data={infoDetailCard} />
            <Container>
                <ToolBar title="Contas a pagar" handleRefreshClick={handleFetchData} displayCalendar={true} handleCleanFilter={handleCleanFilter} dateRange={date} handleDateRangePicker={handleDateRangePicker} href="/billstopay/table" descriptionHref="Tabela" displayInputSearch={false}/>
                <ContainerGraphic loading={loading}>
                    <PieChart displayToolTip={true} ToolTipComponent={ToolTip} data={selectCostCenter} dataKey="value" label={(props) => <CustomLabel {...props} data={selectCostCenter} />} />
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
                </ContainerGraphic>
                <div className="w-full flex px-6 overflow-auto">
                    <DescriptionGraphic data={sortedCostCenters} dataKey="description" handleSelection={handleSelectingCostCenter} />
                </div>
            </Container>
        </PageLayout>
    )
}

export const getServerSideProps = getBillsToPayPageProps; 