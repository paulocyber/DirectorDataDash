'use client'

// React
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"

// Dados
import InfoCardFromBillsToPay from "@/data/infoCard/billsToPay"
import collumns from "@/data/collumns/billsToPay/columns.json"

// Bibliotecas
import { DateValue, RangeValue } from "@nextui-org/react"

// Componentes
import InfoCard from "@/components/ui/InfoCard"
import Container from "@/components/ui/container"
import Table from "@/components/ui/table"
import ToolBar from "@/components/ui/toolbar"
import { renderCell } from "@/components/ui/renderCell/billsToPay/renderCell"

// Utils
import { fetchBillsToPay } from "@/utils/data/fetchData/refresh/fetchBillsToPay"
import { searchFilter } from "@/utils/filters/searchFilter"
import billsToPayPDF from "@/utils/relatory/pdf/billsToPay"

// Tipagem
import { BillsToPayData } from "@/types/billsToPay"
import { parseDate } from '@internationalized/date';

interface LayoutProps {
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

export default function UiBillsToPayTable({ allBillets, listBilletInOpen, listBilletPaid, listOfExpiredInvoices, year, month, yesterday, monthExpired, today }: LayoutProps) {
    const [billets, setBillets] = useState(allBillets || [])
    const [billetInopen, setBilletInOpen] = useState(listBilletInOpen || [])
    const [billetPaid, setBilletPaid] = useState(listBilletPaid || [])
    const [lateBills, setLateBills] = useState(listOfExpiredInvoices || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchParams, setSearchParams] = useState<string>('');
    const [clearFilter, setClearFilter] = useState<boolean>(true);
    const [filterStatus, setFilterStatus] = useState<string>('todos')
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const { token } = useContext(AuthContext)
    const filterSearch = searchFilter({ data: filterStatus === 'todos' ? billets : filterStatus === 'Paga' ? billetPaid : billetInopen, search: searchParams })
    const { infoDetailCard, openValues, pastDueAmounts, amountsPaid, totalInvoicesPaid } = InfoCardFromBillsToPay({ listBilletInOpen: billetInopen, listBilletPaid: billetPaid, listBilletExpired: lateBills, costCenterFilter: [], filterSearch })

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
        setSearchParams('')
        setClearFilter(false)
        setFilterStatus('todos')

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

    const generatePdf = () => {
        billsToPayPDF(filterStatus === 'todos' ? billets : filterStatus === 'Paga' ? billetPaid : billetInopen, openValues, pastDueAmounts, amountsPaid, totalInvoicesPaid)
    }
    
    return (
        <>
            <InfoCard data={infoDetailCard} />
            <Container>
                <ToolBar title="Contas a pagar" handleRefreshClick={handleRefresh} dateRange={date} handleDateRangePicker={handleDateRangerPicker} handleCleanFilter={handleCleanFilter} generatePDF={generatePdf} searchFilter={searchParams} setFilterSearch={setSearchParams} setFilterStatus={setFilterStatus} />
                <main className="flex h-[450px]">
                    <Table collumns={collumns} data={filterSearch} renderCell={renderCell} loading={loading} />
                </main>
            </Container>
        </>
    )
}