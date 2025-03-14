'use client'

// Componentes
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolbar"
import { renderCell } from "@/components/cells/entriesXSales"
import Table from "@/components/ui/table"
import InfoCard from "@/components/ui/InfoCard"
import Modal from "@/components/ui/modal"
import { SettingsSalesByBrand } from "@/components/ui/settings/salesByBrand"

// Dados
import columns from "@/data/columns/entriesXSales/columns.json"
import InfoCardFromEntriesXSales from "@/data/infoCards/entriesXSales"

// React
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/auth"

// Bibliotecas
import { DateValue, RangeValue, useDisclosure } from "@heroui/react"
import { useAtom } from "jotai"

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/EntriesXSales"

// Atom
import { suppliersAtoms } from "@/atom/suppliers"
import { refreshAtom } from "@/atom/refresh"

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales"
import { parseDate } from "@internationalized/date"
interface LayoutEntriesXSalesProps {
    entriesSalesData: EntriesXSales[];
    suppliers: { ID_MRC: string, DESCRICAO_MRC: string, STATUS_MRC: string }[]
    dateInit: string;
    dateEnd: string;
}

export default function LayoutEntriesXSalesPage({ entriesSalesData, suppliers, dateInit, dateEnd }: LayoutEntriesXSalesProps) {
    const [entriesSales, setEntriesSales] = useState(entriesSalesData)
    const [loading, setLoading] = useState<boolean>(false)
    const [brands, setBrands] = useAtom(suppliersAtoms)
    const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${dateInit}`).toISOString().split('T')[0]),
        end: parseDate(new Date(`${dateEnd}`).toISOString().split('T')[0]),
    })

    const infoCard = InfoCardFromEntriesXSales({ entriesSalesData: entriesSales })

    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (activeRefresh) {
            handleRefresh({ date, token, brands, setLoading, setEntriesSales })
            setActiveRefresh(false);
        }
    }, [activeRefresh]);

    return (
        <div className="flex flex-col">
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Entrada X Saída"
                    handleRefreshClick={() => handleRefresh({ date, token, brands, setLoading, setEntriesSales })}
                    handleCleanFilter={() => handleCleanFilter({ token, brands, setBrands, setDate, setLoading, setEntriesSales })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, brands, setLoading, setDate, setEntriesSales })}
                    dateRange={date}
                    handleFilters={onOpen}
                />
                <Table data={entriesSales} columns={columns} renderCell={renderCell} loading={loading} />
            </Container>
            <Modal title="Configurações de Filtros" isopen={isOpen} onOpenChange={onOpenChange}>
                <SettingsSalesByBrand suppliers={suppliers} />
            </Modal>
        </div>
    )
}   