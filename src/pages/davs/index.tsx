// Framework - Next
import { canSSRAuth } from "@/utils/permissions/canSSRAuth";
import { useRouter } from "next/router";

// Componentes
import Layout from "@/components/ui/layout";
import Cards from "@/components/ui/cards";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import TableGrid from "@/components/ui/table";
import { Loading } from "@/components/ui/loading";

// React
import { useState } from "react";

// Biblioteca
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

// Dados
import { columns } from "@/data/collumnsDav"

// Utils
import currentDate from "@/utils/CurrentDate";
import { davsQueries } from "@/utils/queries/Davs";
import { setupApiClient } from "@/service/api";
import { InfoCardFromDav } from "@/utils/getFromData/infoCard/infoCardFromDav";
import { formatCurrency } from "@/utils/masks/formatCurrency";
import { InfiniteScroll } from "@/utils/InfiniteScroll";
import { fetchData } from "@/utils/fetchData";

// Tipagem
import { ItemsDav } from "@/utils/types/listDav";

export default function DavSummaryPage({ listDav }: { listDav: ItemsDav[] }) {
    const [dav, setDav] = useState(listDav || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [limit, setLimit] = useState(0);

    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const infoDetailCard = InfoCardFromDav({ listDav: dav })

    const router = useRouter();

    const renderCell = (item: ItemsDav, columnKey: string) => {
        switch (columnKey) {
            case "nDav":
                return item.ID_SDS;
            case "cliente":
                return item.CLIENTE;
            case "vendedor":
                return item.VENDEDOR;
            case "valorBruto":
                return formatCurrency(Number(item.VALOR_BRUTO_SDS.replace(",", ".")));
            case "dataFinalização":
                return item.DATAHORA_FINALIZACAO_SDS.split(' ')[0];
            default:
                return null;
        }
    };

    const fetchItemDavs = async () => {
        setLoading(true)

        const { today } = currentDate()
        const { davFinished } = davsQueries({ dataInit: today, dataEnd: today })

        await fetchData({ query: davFinished, setData: setDav })

        setLoading(false)
    }

    const fetchMore = () => {
        if (limit < listDav.length) {
            setLimit(limit + 10);
        }
    };

    const handleClick = (ID_ORIGEM: string) => {
        router.push(`/detaildavs/${ID_ORIGEM}`);
    };


    return (
        <Layout description="Relatorios dav's">
            <Cards data={infoDetailCard} />
            <Container>
                <ToolBar title="Contas abertas: " handleRefreshClick={fetchItemDavs} date={date}/>
                <main className="flex w-full pb-6 h-[450px] flex-col px-5">
                    {loading ?
                        <div className="flex w-full justify-center items-center">
                            <Loading />
                        </div>
                        :
                        <div className="overflow-auto">
                            <TableGrid collumns={columns} data={dav.slice(0, limit)} renderCell={renderCell} detail={handleClick} />
                            <InfiniteScroll fetchMore={fetchMore} />
                        </div>
                    }
                </main>
            </Container>
        </Layout>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx);
    const { today } = currentDate()

    const { davFinished } = davsQueries({ dataInit: today, dataEnd: today })

    const resp = await apiClient.post("/v1/find-db-query", { query: davFinished })

    return {
        props: {
            listDav: resp.data.returnObject.body
        }
    }

})