"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { renderCell as coverSalesCell } from "@/components/renderCell/coverReport";
import { renderCell as curveCellAandB } from "@/components/renderCell/coverReport/curveAandB";

// Dados
import CoverSalesInfoCard from "@/data/dataCards/coverSales";
import coverSalesColumns from "@/data/columns/coverReport/columns.json";
import summaryCoverSalesColumns from "@/data/columns/coverReport/curveAandB/columns.json";

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
import { ItemsCoverReportData } from "@/types/coverReport";
interface LayoutCoverReportProps {
  coverSalesData: ItemsDavData[];
  salesSummaryData: ItemsCoverReportData[];
  today: string;
}

export default function LayoutCoverReport({
  coverSalesData,
  salesSummaryData,
  today,
}: LayoutCoverReportProps) {
  const [coverSales, setCoverSales] = useState(coverSalesData);
  const [salesSummary, setSalesSummary] = useState(salesSummaryData);
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
              handleRefresh({
                date,
                token,
                setCoverSales,
                setSalesSummary,
                setLoading,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                date: newDate,
                token,
                setDate,
                setCoverSales,
                setSalesSummary,
                setLoading,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                date,
                token,
                setCoverSales,
                setSalesSummary,
                setDate,
                setLoading,
              })
            }
            dateRange={date}
          />
          <Table
            data={coverSales}
            columns={coverSalesColumns}
            renderCell={coverSalesCell}
            loading={loading}
          />
        </Container>
        <Container>
          <ToolBar
            title="Relatório de Capas"
            handleRefreshClick={() =>
              handleRefresh({
                date,
                token,
                setCoverSales,
                setSalesSummary,
                setLoading,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                date: newDate,
                token,
                setDate,
                setCoverSales,
                setSalesSummary,
                setLoading,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                date,
                token,
                setCoverSales,
                setSalesSummary,
                setDate,
                setLoading,
              })
            }
            dateRange={date}
          />
          <Table
            data={salesSummary}
            columns={summaryCoverSalesColumns}
            renderCell={curveCellAandB}
            loading={loading}
          />
        </Container>
      </section>
    </>
  );
}
