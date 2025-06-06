'use client'

// Dados
import InfoCardFromDav from "@/data/infoCards/davs";
import columns from '@/data/columns/dav/columns.json';

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { redirect } from "next/navigation";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/davs";
import Modal from "@/components/ui/modal";
import { SettingsDavs } from "@/components/ui/settings/davs";

// Atom
import { refreshAtom } from "@/atom/refresh";
import { MethodsOfPayments } from "@/atom/MethodsOfPayments";

// Biblioteca
import { useAtom } from "jotai";

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/davs";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import { DateValue, RangeValue, useDisclosure } from "@heroui/react";
import { parseDate } from '@internationalized/date';
interface LayoutDavProps {
    davsData: ItemsDavData[];
    formOfPayments: { ID_FRM: string, DESCRICAO_FRM: string }[]
    today: string;
}

export default function LayoutDavTable({ davsData, formOfPayments, today }: LayoutDavProps) {
    const [davs, setDavs] = useState(davsData);
    const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom)
    const [selectingMethodsPayment, setSelectingMethodsPayment] = useAtom(MethodsOfPayments)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(today).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const infoCard = InfoCardFromDav({ davs })

    useEffect(() => {
        if (activeRefresh) {
            handleRefresh({ date, token, formsOfPayments: selectingMethodsPayment, setDavs, setLoading })
            setActiveRefresh(false);
        }
    }, [activeRefresh]);

    function handleDetailDav(idOrigem: string, idPss?: string) {
        redirect(`/davs/${idOrigem}`)
    }

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Relatório de DAV's"
                    dateRange={date}
                    handleRefreshClick={() => handleRefresh({ date, token, formsOfPayments: selectingMethodsPayment, setDavs, setLoading })}
                    handleCleanFilter={() => handleCleanFilter({ token, formsOfPayments: selectingMethodsPayment, setDate, setFormsOfPayments: setSelectingMethodsPayment, setDavs, setLoading })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ token, formsOfPayments: selectingMethodsPayment, date: newDate, setDate, setDavs, setLoading })}
                    handleFilters={onOpen}
                />
                <Table data={davs} columns={columns} renderCell={renderCell} loading={loading} detail={handleDetailDav} />
            </Container>
            <Modal title="Configurações de Filtros" isopen={isOpen} onOpenChange={onOpenChange} setActiveRefresh={setActiveRefresh}>
                <SettingsDavs formOfPaymentsData={formOfPayments} />
            </Modal>
        </>
    )
}