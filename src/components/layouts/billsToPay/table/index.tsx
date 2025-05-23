'use client'

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/billsToPay";
import Modal from "@/components/ui/modal";
import { SettingsBillsToPay } from "@/components/ui/settings/billsToPay";

// Dados
import InfoCardFromBillsToPay from "@/data/infoCards/billsToPay";
import columns from "@/data/columns/billsToPay/columns.json"

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/billsToPay";
import BillsToPayPdf from "@/utils/relatorys/billsToPay";
import { searchFilter } from "@/utils/filters/searchFilter";

// Biblioteca
import { useAtom } from "jotai";

// Atom
import { statusAtom } from "@/atom/status";
import { costCenterAtom } from "@/atom/costCenter";
import { refreshAtom } from "@/atom/refresh";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
import { parseDate } from "@internationalized/date";
import { DateValue, RangeValue, useDisclosure } from "@heroui/react";

interface LayoutBillsToPayTable {
    allBilletsData: ItemsBillsToPay[];
    openBillsData: ItemsBillsToPay[];
    paidBillsData: ItemsBillsToPay[];
    overdueBillsData: ItemsBillsToPay[];
    costsCentersData: { ID_CNT: string, DESCRICAO_CNT: string }[],
    year: number;
    month: number;
}

export default function LayoutBillsToPayTable({ allBilletsData, openBillsData, paidBillsData, overdueBillsData, costsCentersData, year, month }: LayoutBillsToPayTable) {
    const [allBillets, setAllBillets] = useState(allBilletsData)
    const [openBills, setOpenBills] = useState(openBillsData)
    const [paidBills, setPaidBills] = useState(paidBillsData)
    const [overdueBills, setOverdueBills] = useState(overdueBillsData)
    const [clearFilter, setClearFilter] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [status,] = useAtom<string[]>(statusAtom)
    const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom)
    const [costsCenters, setCostsCenters] = useAtom(costCenterAtom)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const infoCard = InfoCardFromBillsToPay({ openBills, overdueBills, paidBills })

    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const filterSearch = searchFilter({
        data: status.includes('Em aberto') && status.includes('Pago')
            ? allBillets
            : status.includes('Em aberto')
                ? openBills
                : paidBills,
        search
    });

    const generatePdf = () => {
        BillsToPayPdf({ allBillets, status, billetFilter: status.includes('Em aberto') && status.includes('Pago') ? allBillets : status.includes('Em aberto') ? openBills : paidBills, dateStart: `${date.start.day}/${date.start.month}/${date.start.year}`, dateEnd: `${date.end.day}/${date.end.month}/${date.end.year}` })
    }

    useEffect(() => {
        if (activeRefresh) {
            handleRefresh({ date, token, costsCenters, setLoading, setAllBillets, setOpenBills, setOverdueBills, setPaidBills, clear: clearFilter })
            setActiveRefresh(false);
        }
    }, [activeRefresh]);

    return (
        <div className="flex flex-col">
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Contas a Pagar"
                    descriptionHref="Visualizar em Gráfico"
                    href="/billstopay"
                    handleRefreshClick={() => handleRefresh({ date, token, costsCenters, setLoading, setAllBillets, setOpenBills, setOverdueBills, setPaidBills, clear: clearFilter })}
                    handleCleanFilter={() => handleCleanFilter({ date, token, setClear: setClearFilter, setCostsCenters, setLoading, setDate, setAllBillets, setOpenBills, setOverdueBills, setPaidBills })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, costsCenters, setClear: setClearFilter, setLoading, setDate, setAllBillets, setOpenBills, setOverdueBills, setPaidBills })}
                    handleFilters={onOpen}
                    dateRange={date}
                    search={search}
                    setSearch={setSearch}
                    exportToPDF={generatePdf}
                />
                <Table data={filterSearch} columns={columns} renderCell={renderCell} loading={loading} />
            </Container>
            <Modal title="Configurações de Filtros" isopen={isOpen} onOpenChange={onOpenChange} displayFooter={true} setActiveRefresh={setActiveRefresh}>
                <SettingsBillsToPay costCenter={costsCentersData} />
            </Modal>
        </div>
    )
}