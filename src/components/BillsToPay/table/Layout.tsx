'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Dados
import InfoCardFromBillsToPay from "@/data/infoCard/billsToPay";
import collumns from "@/data/collumns/billsToPay/columns.json"

// Componentes
import InfoCard from "@/components/ui/cards";
import Container from "@/components/ui/container";
import Table from "@/components/ui/table";
import ToolBar from "@/components/ui/toolbar";
import { renderCell } from "@/components/ui/renderCell/billsToPay/index"

// Utils
import { fetchBillsToPay } from "@/utils/fetchData/fetchBillsToPay";
import { searchFilter } from "@/utils/filters/search";
import billsToPayPDF from "@/utils/relatory/pdf/billsToPay";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

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
    const [searchParams, setSearchParams] = useState<string>('');
    const [clearFilter, setClearFilter] = useState<boolean>(true);
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const { token } = useContext(AuthContext)
    const filterSearch = searchFilter({ data: billets, search: searchParams })
    const { infoDetailCard, amountsPaid, openValues, pastDueAmounts, totalInvoicesPaid } = InfoCardFromBillsToPay({ listBilletInOpen: billetInopen, listBilletPaid: billetPaid, listBilletExpired: lateBills, costCenterFilter: [], filterSearch: filterSearch })

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
        billsToPayPDF(billets, openValues, pastDueAmounts, amountsPaid, totalInvoicesPaid)
    }

    return (
        <>
            <InfoCard data={infoDetailCard} />
            <Container>
                <ToolBar
                    title="Contas a pagar"
                    displayCalendar={true}
                    dateRange={date}
                    displayInputSearch={true}
                    handleRefreshClick={handleRefresh}
                    handleDateRangePicker={handleDateRangerPicker}
                    handleCleanFilter={handleCleanFilter}
                    searchFilter={searchParams}
                    setFilterSearch={setSearchParams}
                    descriptionHref="Grafico"
                    href="/billstopay"
                    generatePDF={generatePdf}
                />
                <main className="flex h-[450px]">
                    <Table
                        collumns={collumns}
                        data={filterSearch}
                        renderCell={renderCell}
                        loading={loading}
                    />
                </main>
            </Container>
        </>
    )
}