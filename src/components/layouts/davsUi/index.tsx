'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Framework
import { useRouter } from "next/navigation";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import { parseDate } from '@internationalized/date';
import ToolBar from "@/components/ui/ToolBar";
import Container from "@/components/ui/container";
import { renderCell } from "../../ui/renderCell/davs/renderCell"
import Table from "@/components/ui/table";

// Dados
import InfoCardFromDav from "@/data/infoCard/davs";
import collumns from "@/data/collumns/davs/columns.json"

// Utils
import { davsQueries } from "@/utils/queries/davs";
import { fetchData } from "@/utils/data/fetchData";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import { DateValue, RangeValue } from "@nextui-org/react";

export default function UiDav({ listDav, infoCard, today }: { listDav: ItemsDavData[]; infoCard: { icon: ReactNode; title: string; value: string }[]; today: string; }) {
    const [infoCardData, setInfoCardData] = useState(infoCard || [])
    const [dav, setDav] = useState(listDav || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(today).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const { token } = useContext(AuthContext)
    const router = useRouter()

    const handleRefresh = async () => {
        setLoading(true)

        const { davFinished } = davsQueries({ dateInit: today, dateEnd: today })
        await fetchData({ ctx: token, query: davFinished, setData: setDav })
        const InfoCard = InfoCardFromDav({ listDav: dav })
        setInfoCardData(InfoCard)

        setLoading(false)
    }

    const handleClick = async (ID_ORIGEM: string) => {
        await router.push(`/detaildavs/${ID_ORIGEM}`)
    }

    return (
        <>
            <InfoCard data={infoCardData} />
            <Container>
                <ToolBar title="Relatório Dav's" dateRange={date} handleRefreshClick={handleRefresh} />
                <Table collumns={collumns} data={dav} renderCell={renderCell} loading={loading} detail={handleClick} />
            </Container>
        </>
    )
}