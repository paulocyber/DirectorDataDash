'use client'

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Biblioteca
import { DateValue, RangeValue, useDisclosure } from "@heroui/react";
import { parseDate } from '@internationalized/date';
import { useAtom } from "jotai";

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/billsToReceive/table";
import { fetchData } from "@/utils/fetchData";
import { davsQueries } from "@/utils/queries/dav"
import BillsToReceivePdf from "@/utils/relatorys/billsToReceive";

// Dados
import InFoCardFromBillsToReceive from "@/data/infoCards/billsToReceive";
import columnsProducts from "@/data/columns/billsToReceive/productsInBillsReceive/columns.json"
import columnsBillsToReceive from "@/data/columns/billsToReceive/columns.json"

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell as cellReceive } from "@/components/cells/billsToReceive";
import { renderCell as cellProducts } from "@/components/cells/billsToReceive/produtosInBillsToReceive";
import Modal from "@/components/ui/modal";
import { SettingsBillsToReceive } from "@/components/ui/settings/billsToReceive/indext";

// Atom
import { peopleAtom } from "@/atom/people";
import { refreshAtom } from "@/atom/refresh";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

interface LayoutBillsToReceiveProps {
    allBillsData: ItemsBillsToReceiveData[];
    openBillsData: ItemsBillsToReceiveData[];
    peopleData: { ID_PSS: string, NOME_PSS: string, APELIDO_PSS: string }[]
    today: string;
}

export default function LayoutBillsToReceiveTable({ allBillsData, openBillsData, peopleData, today }: LayoutBillsToReceiveProps) {
    const [billsToReceive, setBillsToReceive] = useState(allBillsData);
    const [openBills, setOpenBills] = useState(openBillsData)
    const [detailDav, setDetailDav] = useState<any[] | undefined>(undefined);
    const [people, setPeople] = useAtom(peopleAtom)
    const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`2023/01/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(`${today}`).toISOString().split('T')[0]),
    })

    const infoCard = InFoCardFromBillsToReceive({ allBillsData: billsToReceive, filter: people })
    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    async function handleDetailDav(ID_ORIGEM: string, ID_PSS?: string) {
        setPeople([`${ID_PSS}`])

        const { obtainProductsContainedInDav } = davsQueries({ id: ID_ORIGEM })

        handleRefresh({ date, token, people: [`${ID_PSS}`], setLoading, setBillsToReceive, setOpenBills })
        const queries = [
            fetchData({ ctx: token, query: obtainProductsContainedInDav, setData: (data) => setDetailDav(data) })
        ]

        await Promise.all(queries)
    }

    const generatePdf = () => {
        BillsToReceivePdf({ token, allBillsData: billsToReceive, openBillsData: openBills, dateStart: `${date.start.day}/${date.start.month}/${date.start.year}`, dateEnd: `${date.end.day}/${date.end.month}/${date.end.year}` })
    }

    useEffect(() => {
        if (activeRefresh) {
            handleRefresh({ date, token, people, setLoading, setBillsToReceive, setOpenBills })
            setActiveRefresh(false);
        }
    }, [activeRefresh]);

    return (
        <div className="flex flex-col">
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Contas a receber"
                    descriptionHref="Visualizar em Gráfico"
                    href="/billstoreceive"
                    handleRefreshClick={() => handleRefresh({ date, token, people, setLoading, setBillsToReceive, setOpenBills })}
                    handleCleanFilter={() => handleCleanFilter({ date, token, setPeople, setDate, setLoading, setBillsToReceive, setOpenBills, setDetailDav })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, people, setDate, setLoading, setBillsToReceive, setOpenBills, setDetailDav })}
                    handleFilters={onOpen}
                    exportToPDF={generatePdf}
                    dateRange={date}
                />
                <Table data={openBills} columns={columnsBillsToReceive} renderCell={cellReceive} detail={handleDetailDav} loading={loading} />
            </Container>
            <Modal title="Configurações de Filtros" isopen={isOpen} onOpenChange={onOpenChange} setActiveRefresh={setActiveRefresh}>
                <SettingsBillsToReceive people={peopleData} />
            </Modal>
            {detailDav && detailDav.length > 0 && (
                <Container>
                    <div className="w-full flex justify-between items-center p-5">
                        <h1 className="font-bold text-xl text-gray-800">Produtos</h1>
                    </div>
                    <Table columns={columnsProducts} data={detailDav} renderCell={cellProducts} loading={false} />
                </Container>
            )}
        </div>
    )
}