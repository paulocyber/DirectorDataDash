'use client'

// Componentes
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolbar"
import { renderCell } from "@/components/cells/entriesXSales"
import Table from "@/components/ui/table"
import InfoCard from "@/components/ui/InfoCard"

// Dados
import columns from "@/data/columns/entriesXSales/columns.json"
import InfoCardFromEntriesXSales from "@/data/infoCards/entriesXSales"

// React
import { useState } from "react"

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales"
import { DateValue, RangeValue } from "@nextui-org/react"
import { parseDate } from "@internationalized/date"
interface LayoutEntriesXSalesProps {
    entriesSalesData: EntriesXSales[];
    dateInit: string;
    dateEnd: string;
}

export default function LayoutEntriesXSalesPage({ entriesSalesData, dateInit, dateEnd }: LayoutEntriesXSalesProps) {
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${dateInit}`).toISOString().split('T')[0]),
        end: parseDate(new Date(`${dateEnd}`).toISOString().split('T')[0]),
    })

    const infoCard = InfoCardFromEntriesXSales({ entriesSalesData: entriesSalesData })

    return (
        <div className="flex flex-col">
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Entrada X Saída"
                    handleRefreshClick={() => console.log("Ativou  ")}
                    handleCleanFilter={() => console.log("Ativou")}
                    dateRange={date}
                    handleFilters={() => console.log("Filtro")}
                />
                <Table data={entriesSalesData} columns={columns} renderCell={renderCell} loading={false} />
            </Container>
        </div>
    )
}   