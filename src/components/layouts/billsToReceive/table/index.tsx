'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Dados
import columns from "@/data/collumns/billsToReceive/columns.json"

// Compoentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/ui/renderCell/billsToReceive/renderCell";

// Utils
import { fetchBillsToReceive } from "@/utils/data/fetchData/refresh/fetchBillsToReceive";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";
import { parseDate } from '@internationalized/date';
import { DateValue, RangeValue } from "@nextui-org/react";

interface UiBillsToReceiveTableProps {
    receiveData: BillsToReceiveData[];
    receiptsInOpenData: BillsToReceiveData[];
    receiptsInPayedData: BillsToReceiveData[];
    infoCardData: { icon: ReactNode; title: string; value: string }[];
    year: number;
    month: number;
    yesterday: number;
    today: string;
}

export default function UiBillsToReceiveTable({ receiveData, receiptsInOpenData, receiptsInPayedData, infoCardData, year, month, yesterday, today }: UiBillsToReceiveTableProps) {
    const [receipts, setReceipts] = useState(receiveData)
    const [receiptsInOpen, setReceipsInOpen] = useState(receiptsInOpenData)
    const [receiptsInPayed, setReceiptsInPayed] = useState(receiptsInPayedData)
    const [infoCard, setInfoCard] = useState(infoCardData)
    const [loading, setLoading] = useState<boolean>(false)
    const [filterStatus, setFilterStatus] = useState<string>('todos')
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/${yesterday}`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const { token } = useContext(AuthContext)
    const handleRefresh = async () => {
        await fetchBillsToReceive({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            filterStatus,
            setReceipts,
            setReceiptsInOpen: setReceipsInOpen,
            setReceiptsInPayed: setReceiptsInPayed,
            setInfoCard,
            setLoading
        })
    }
    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)

        await fetchBillsToReceive({
            token,
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            filterStatus,
            setReceipts,
            setReceiptsInOpen: setReceipsInOpen,
            setReceiptsInPayed: setReceiptsInPayed,
            setInfoCard,
            setLoading
        })
    }

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/${yesterday}`).toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]), })
        setFilterStatus('todos')

        await fetchBillsToReceive({
            token,
            dateInit: `${year}/${month}/${yesterday}`,
            dateEnd: today,
            filterStatus,
            setReceipts,
            setReceiptsInOpen: setReceipsInOpen,
            setReceiptsInPayed: setReceiptsInPayed,
            setInfoCard,
            setLoading
        })
    }

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar title="Contas a receber" handleRefreshClick={handleRefresh} dateRange={date} handleDateRangePicker={handleDateRangePicker} setFilterStatus={setFilterStatus} handleCleanFilter={handleCleanFilter} descriptionHref="Grafico" href="/billstoreceive"/>
                <Table collumns={columns} renderCell={renderCell} data={filterStatus === 'todos' ? receipts : filterStatus === 'paga' ? receiptsInPayed : receiptsInOpen} loading={loading} />
            </Container>
        </>
    )
}