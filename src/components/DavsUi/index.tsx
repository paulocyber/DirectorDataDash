'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Dados
import collumns from "@/data/collumns/davs/columns.json"
import InfoCardFromDav from "@/data/infoCard/davs";

// Framework - Next
import { useRouter } from "next/navigation";

// Componentes
import InfoCard from "../ui/cards";
import ToolBar from "../ui/toolbar";
import Container from "../ui/container";
import Table from "../ui/table";
import { renderCell } from "../ui/renderCell/davs";

// Utils
import getDate from "@/utils/currentDate";
import { davsQueries } from "@/utils/queries/davs";
import { fetchData } from "@/utils/fetchData";

// Tipagem
import { ItemsDav } from "@/utils/types/davs";

export default function Layout({ listDav, infoCard }: { listDav: ItemsDav[]; infoCard: { icon: ReactNode; title: string; value: string }[] }) {
    const [dav, setDav] = useState(listDav || [])
    const [infoCardData, setInfoCardData] = useState(infoCard || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingActive, setLoaderActive] = useState<boolean>(false)

    const { token } = useContext(AuthContext)
    const router = useRouter()

    const handleRefresh = async () => {
        setLoading(true)

        const { today } = getDate()
        const { davFinished } = davsQueries({ dateInit: today, dateEnd: today })

        await fetchData({ query: davFinished, setData: setDav, ctx: token })
        const infoCard = InfoCardFromDav({ listDav: dav })
        setInfoCardData(infoCard)
        setLoading(false)
    }

    const handleClick = async (ID_ORIGEM: string) => {
        setLoaderActive(true)
        await router.push(`/detaildavs/${ID_ORIGEM}`)
        setLoaderActive(false)
    }

    if(loadingActive) {
        return <p>Carregando...</p>
    }

    return (
        <>
            <InfoCard data={infoCardData} />
            <Container>
                <ToolBar title="Relatório Dav's" displayCalendar={true} handleRefreshClick={handleRefresh} />
                <Table collumns={collumns} data={dav} renderCell={renderCell} loading={loading} detail={handleClick} />
            </Container>
        </>
    )
}