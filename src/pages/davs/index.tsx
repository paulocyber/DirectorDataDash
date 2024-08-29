// Framework - Next
import { getDavReportPageProps } from "@/utils/server/davReportPageProps";
import { useRouter } from "next/router";

// React
import { useState } from "react";

// Dados
import { InfoCardFromDav } from "@/data/infoCard/davs";
import { columns } from "@/data/columns/dav/columns";

// Componentes
import PageLayout from "@/components/ui/layout";
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ContainerTable from "@/components/ui/container/table";
import { renderCell } from "@/components/rowsTable/dav/renderCell";

// Utils
import getDate from "@/utils/date/currentDate";
import { davsQueries } from "@/utils/queries/dav";
import { fetchData } from "@/utils/fetchData/fetchData";

// Tipagem
import { ItemsDav } from "@/utils/types/dav";

export default function DavReportPage({ listDav }: { listDav: ItemsDav[] }) {
    const [dav, setDav] = useState(listDav || [])
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const infoDetailCard = InfoCardFromDav({ listDav: dav })

    const handleClick = (ID_ORIGEM: string) => {
        router.push(`/detaildavs/${ID_ORIGEM}`);
    };

    const fetchItemDavs = async () => {
        setLoading(true)

        const { today } = getDate()
        const { davFinished } = davsQueries({ dateInit: today, dateEnd: today })

        await fetchData({ query: davFinished, setData: setDav })

        setLoading(false)
    }

    return (
        <PageLayout description="Relatorios dav's">
            <InfoCard data={infoDetailCard} />
            <Container>
                <ContainerTable
                    title="Relatrio Dav's"
                    displayCalendar={true}
                    collumns={columns}
                    renderCell={renderCell}
                    data={dav}
                    detail={handleClick}
                    handleRefreshClick={fetchItemDavs}
                    loading={loading}
                />
            </Container>
        </PageLayout>
    )
}

export const getServerSideProps = getDavReportPageProps; 