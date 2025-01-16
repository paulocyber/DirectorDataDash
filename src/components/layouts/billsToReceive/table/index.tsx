'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Biblioteca
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/billsToReceive/table";

// Dados
import InFoCardFromBillsToReceive from "@/data/infoCards/billsToReceive";
import columns from "@/data/columns/billsToReceive/columns.json"

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/billsToReceive";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface LayoutBillsToReceiveProps {
    allBillsData: ItemsBillsToReceiveData[];
    openBillsData: ItemsBillsToReceiveData[];
    today: string;
}

export default function LayoutBillsToReceiveTable({ allBillsData, openBillsData, today }: LayoutBillsToReceiveProps) {
    const [billsToReceive, setBillsToReceive] = useState(allBillsData);
    const [openBills, setOpenBills] = useState(openBillsData)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`2023/01/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(`${today}`).toISOString().split('T')[0]),
    })

    const infoCard = InFoCardFromBillsToReceive({ allBillsData: billsToReceive })
    const { token } = useContext(AuthContext)

    return (
        <div className="flex flex-col">
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Contas a receber"
                    descriptionHref="Visualizar em Gráfico"
                    href="/billstoreceive"
                    handleRefreshClick={() => handleRefresh({ date, token, setLoading, setBillsToReceive, setOpenBills })}
                    handleCleanFilter={() => handleCleanFilter({ date, token, setDate, setLoading, setBillsToReceive, setOpenBills })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, setDate, setLoading, setBillsToReceive, setOpenBills })}
                    dateRange={date}
                />
                <Table data={openBills} columns={columns} renderCell={renderCell} loading={loading} />
            </Container>
        </div>
    )
}