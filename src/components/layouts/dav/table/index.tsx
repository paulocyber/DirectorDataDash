'use client'

// Dados
import InfoCardFromDav from "@/data/infoCards/davs";
import columns from '@/data/columns/dav/columns.json';

// React
import { useState } from "react";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/davs";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import { RangeValue } from "@nextui-org/react";
import { DateValue, parseDate } from "@internationalized/date";
interface LayoutDavProps {
    davsData: ItemsDavData[];
    today: string;
}

export default function  LayoutDavTable({ davsData, today }: LayoutDavProps) {
    const [davs, setDavs] = useState(davsData);
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(today).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const infoCard = InfoCardFromDav({ davs })

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Relatório de DAV's"
                    dateRange={date}
                    handleRefreshClick={() => console.log("Ativou")}
                    handleCleanFilter={() => console.log("Ativou")}
                    handleDateRangePicker={() => console.log("Ativou")}
                />

                <Table data={davs} columns={columns} renderCell={renderCell} loading={loading} /* detail={handleDetailDav} */ />
            </Container>
        </>
    )
}