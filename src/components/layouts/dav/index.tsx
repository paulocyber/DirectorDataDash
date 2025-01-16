'use client'

// Next
import { useRouter } from "next/navigation";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Dados
import InfoCardFromDav from "@/data/infoCards/davs";
import columns from "@/data/columns/dav/columns.json"

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/davs";

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/davs";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

interface LayoutDavProps {
  davsData: ItemsDavData[];
  today: string;
}

export default function LayoutDav({ davsData, today }: LayoutDavProps) {
  const [davs, setDavs] = useState(davsData);
  const [loading, setLoading] = useState<boolean>(false)
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(today).toISOString().split('T')[0]),
    end: parseDate(new Date(today).toISOString().split('T')[0]),
  });

  const { token } = useContext(AuthContext)
  const router = useRouter()
  const infoCard = InfoCardFromDav({ davs })

  const handleDetailDav = (ID_ORIGEM: string) => {
    router.push(`/davs/${ID_ORIGEM}`)
  }

  return (
    <>
      <InfoCard data={infoCard} />
      <Container>
        <ToolBar
          title="Relatório de Dav's"
          dateRange={date}
          handleRefreshClick={() => handleRefresh({ date, token, setDavs, setLoading })}
          handleCleanFilter={() => handleCleanFilter({ token, setDate, setDavs, setLoading })}
          handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ token, date: newDate, setDate, setDavs, setLoading })}
        />
        <Table data={davs} columns={columns} renderCell={renderCell} loading={loading} detail={handleDetailDav} />
      </Container>
    </>
  );
}
