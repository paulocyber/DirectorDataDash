'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell, renderCellAdmin } from "@/components/cells/lateCustomer";

// Biblioteca
import { useAtom } from "jotai";

// Atom
import { peopleAtom } from "@/atom/people";

// Dados
import InfoCardFromLateCustomer from "@/data/infoCards/lateCustomer";
import columns from "@/data/columns/lateCustomer/columns.json"
import columnsAdmin from "@/data/columns/lateCustomer/(admin)/columns.json"

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/lateCustomer";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
interface LayoutCustomerProps {
    openBills: ItemsBillsToReceiveData[];
    overdueBills: ItemsBillsToReceiveData[];
    today: string;
    admin?: boolean;
}

export default function LayoutCustomer({ openBills, overdueBills, today, admin }: LayoutCustomerProps) {
    const [openBillsData, setOpenBillsData] = useState(openBills);
    const [overdueBillsData, setOverdueBillsData] = useState(overdueBills);
    const [loading, setLoading] = useState<boolean>(false)
    const [people, setPeople] = useAtom(peopleAtom)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`2023/01/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    })

    const { token, user } = useContext(AuthContext)
    const infoCard = InfoCardFromLateCustomer({ openBillsData, overdueBillsData })

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Clientes em atraso"
                    handleRefreshClick={() => handleRefresh({ date, sellerSurname: admin ? undefined : user, people, token, setLoading, setOpenBillsData, setOverdueBillsData })}
                    dateRange={date}
                    handleCleanFilter={() => handleCleanFilter({ sellerSurname: admin ? undefined : user, people, token, setLoading, setOpenBillsData, setOverdueBillsData, setDate, setPeople })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, sellerSurname: admin ? undefined : user, people, token, setLoading, setOpenBillsData, setOverdueBillsData, setDate })}
                />
                <Table data={openBillsData} columns={admin ? columnsAdmin : columns} loading={loading} renderCell={admin ? renderCellAdmin : renderCell} />
            </Container>
        </>
    )
}