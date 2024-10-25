'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";

// Dados
import colummns from "@/data/collumns/lateCustomer/columns.json"
import { renderCell } from "@/components/ui/renderCell/lateCustomer/renderCell";
import InFoCardFromLateCustomer from "@/data/infoCard/lateCustomer";

// Utils
import { fetchLateCustomer } from "@/utils/data/fetchData/refresh/fetchLateCustomer";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

interface UiLateCustomerProps {
    dataReceiveInOpen: BillsToReceiveData[];
    admin?: boolean;
    year: number;
    month: number;
    yesterday: number;
}

export default function UiLateCustomer({ dataReceiveInOpen, admin, year, month, yesterday }: UiLateCustomerProps) {
    const [receiveInOpen, setReceiveInOpen] = useState(dataReceiveInOpen)
    const [loading, setLoading] = useState<boolean>(false)
    const [cleanFilter, setCleanFilter] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(`${year}/${month}/${yesterday}`).toISOString().split('T')[0])
    })

    const { token, user } = useContext(AuthContext)
    const infoCard = InFoCardFromLateCustomer({ receiveInOpen: receiveInOpen })

    const handleRefresh = async () => {
        !admin ?
            await fetchLateCustomer({
                token,
                dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
                dateEnd: cleanFilter ? `${date.end.year}/${date.end.month}/${date.end.day}` : `${year}/${month}/${yesterday}`,
                seller: user,
                setReceiveInOpen,
                setLoading
            })
            :
            await fetchLateCustomer({
                token,
                dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
                dateEnd: cleanFilter ? `${date.end.year}/${date.end.month}/${date.end.day}` : `${year}/${month}/${yesterday}`,
                setReceiveInOpen,
                setLoading
            })

    }

    const handleDateRangerPicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)
        setCleanFilter(false);

        !admin ?
            await fetchLateCustomer({
                token,
                dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
                dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
                seller: user,
                setReceiveInOpen,
                setLoading
            })
            :
            await fetchLateCustomer({
                token,
                dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
                dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
                setReceiveInOpen,
                setLoading
            })
    }

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(`${year}/${month}/${yesterday}`).toISOString().split('T')[0]) })
        setCleanFilter(true);

        !admin
            ?
            await fetchLateCustomer({
                token,
                dateInit: `${year}/${month}/01`,
                dateEnd: `${year}/${month}/${yesterday}`,
                seller: user,
                setReceiveInOpen,
                setLoading
            })
            :
            await fetchLateCustomer({
                token,
                dateInit: `${year}/${month}/01`,
                dateEnd: `${year}/${month}/${yesterday}`,
                setReceiveInOpen,
                setLoading
            })
    }

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar title="Clientes em atraso" dateRange={date} handleRefreshClick={handleRefresh} handleDateRangePicker={handleDateRangerPicker} handleCleanFilter={handleCleanFilter} />
                <main className="py-2">
                    <Table data={receiveInOpen} collumns={colummns} renderCell={renderCell} loading={loading} />
                </main>
            </Container>
        </>
    )
}