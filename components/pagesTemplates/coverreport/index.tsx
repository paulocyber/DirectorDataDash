"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { renderCell } from "@/components/renderCell/coverReport";

// Dados
import CoverSalesInfoCard from "@/data/dataCards/coverSales";
import columns from "@/data/columns/coverReport/columns.json";

// Utils
import {
  handleCleanFilter,
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/coverReport";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import { type DateValue, parseDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
interface LayoutCoverReportProps {
  coverSalesData: ItemsDavData[];
  today: string;
}

export default function LayoutCoverReport({
  coverSalesData,
  today,
}: LayoutCoverReportProps) {
  const [coverSales, setCoverSales] = useState(coverSalesData);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  const { token } = useContext(AuthContext);
  const infoCards = CoverSalesInfoCard({ coverSales });

  return (
    <>
      <InfoCard data={infoCards} />
      <section className="py-8">
        <Container>
          <ToolBar
            title="Relatório de Capas"
            handleRefreshClick={() =>
              handleRefresh({ date, token, setCoverSales, setLoading })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                date: newDate,
                token,
                setDate,
                setCoverSales,
                setLoading,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                date,
                token,
                setCoverSales,
                setDate,
                setLoading,
              })
            }
            dateRange={date}
          />
          <Table
            data={coverSales}
            columns={columns}
            renderCell={renderCell}
            loading={loading}
          />
        </Container>
      </section>
    </>
  );
}
