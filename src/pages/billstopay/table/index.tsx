// Utils
import { getBillsToPayPageProps } from "@/utils/server/billsToPayPageProps";
import getDate from "@/utils/date/currentDate";
import { fetchBillsToPay } from "@/utils/fetchData/fetchBillsToPay";
import billsToPayPDF from "@/utils/relatorys/billsToPay";
import { TotalSum } from "@/utils/functionSum";

// Componentes
import PageLayout from "@/components/ui/layout";
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import renderCell from "@/components/rowsTable/billsToPay/renderCell";
import ContainerTable from "@/components/ui/container/table";

// Dados
import { InfoCardFromBillsToPay } from "@/data/infoCard/billsToPay";
import { SearchFilter } from "@/utils/filters/billsToPay/searchFilter";
import { columns } from "@/data/columns/billsToPay/columns";

// React
import { useState } from "react";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
interface BillsToPayProps {
    listBilletInOpen: BillsToPayItem[];
    listBilletPaid: BillsToPayItem[];
    listOfExpiredInvoices: BillsToPayItem[];
    listBilletPaidAndInOpen: BillsToPayItem[];
}

export default function BillsToPayPageTable({ listBilletInOpen, listBilletPaid, listOfExpiredInvoices, listBilletPaidAndInOpen }: BillsToPayProps) {
    const [billetInopen, setBilletInOpen] = useState(listBilletInOpen || [])
    const [billetPaid, setBilletPaid] = useState(listBilletPaid || [])
    const [lateBills, setLateBills] = useState(listOfExpiredInvoices || [])
    const [allBillets, setAllBillets] = useState(listBilletPaidAndInOpen || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [expiredByDate, setExpiredByDate] = useState<boolean>(false)
    const [search, setFilterSearch] = useState<string>('')

    // Filtro por data 
    const { year, month, today } = getDate()

    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const filterSearch = SearchFilter(allBillets, search)
    const { infoDetailCard, amountsPaid, openValues, pastDueAmounts, totalInvoicesPaid } = InfoCardFromBillsToPay({ listBilletExpired: lateBills, listBilletInOpen: billetInopen, listBilletPaid: billetPaid, costCenterFilter: [], filterSearch: filterSearch })

    const handleFetchData = async () => { await fetchBillsToPay({ dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`, dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`, setLoading, setBilletInOpen, setBilletPaid, setLateBills, setAllBillets, expiredByDate }) }

    async function handleDateRange(newDate: RangeValue<DateValue>) {
        setDate(newDate)
        setExpiredByDate(true)

        await fetchBillsToPay({
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            setLoading,
            setBilletInOpen,
            setBilletPaid,
            setLateBills,
            setAllBillets,
            expiredByDate: true
        })
    }

    async function handleCleanFilter() {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) })
        setFilterSearch('')

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

    const generatePdf = () => {
        billsToPayPDF(allBillets, openValues, pastDueAmounts, amountsPaid, totalInvoicesPaid)
    }

    return (
        <PageLayout description="Contas a pagar">
            <InfoCard data={infoDetailCard} />
            <Container>
                <ContainerTable
                    title="Contas a pagar"
                    collumns={columns}
                    renderCell={renderCell}
                    data={filterSearch}
                    handleRefreshClick={handleFetchData}
                    loading={loading}
                    href="/billstopay"
                    descriptionHref="Grafico"
                    displayCalendar={true}
                    dateRange={date}
                    handleDateRangePicker={handleDateRange}
                    displayInputSearch={true}
                    setFilterSearch={setFilterSearch}
                    searchFilter={search}
                    handleCleanFilter={handleCleanFilter}
                    generatePDF={generatePdf}
                />
            </Container>
        </PageLayout>
    )
}

export const getServerSideProps = getBillsToPayPageProps; 