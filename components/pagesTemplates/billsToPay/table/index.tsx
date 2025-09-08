"use client";

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Componnetes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { RenderCell } from "@/components/renderCell/billsToPay";

// Bibliotecas
import { useAtom } from "jotai";

// Dados
import BilletsInfoCard from "@/data/dataCards/billsToPay";
import columns from "@/data/columns/billsToPay/columns.json";

// Atoms
import { costCenters } from "@/atom/filters/constCenters";
import { statusAtom } from "@/atom/filters/status";
import { refreshAtom } from "@/atom/isActivateRefresh";

// Utils
import BillsToPayPdf from "@/utils/relatorys/pdf/billstopay";
import {
  handleCleanFilter,
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/billsToPay";
import { ItemsFilterSelecting } from "@/types/filters/selecting";
import { searchFilter } from "@/utils/filters/searchFilter";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface LayoutBillsToPayTableProps {
  allBilletsData: ItemsBillsToPay[];
  openBilletsData: ItemsBillsToPay[];
  paidBilletsData: ItemsBillsToPay[];
  overdueBilletsData: ItemsBillsToPay[];
  year: number;
  month: number;
}

export default function LayoutBillsToPayTable({
  allBilletsData,
  openBilletsData,
  paidBilletsData,
  overdueBilletsData,
  year,
  month,
}: LayoutBillsToPayTableProps) {
  const [allBillets, setAllBillets] = useState(allBilletsData);
  const [openBillets, setOpenBillets] = useState(openBilletsData);
  const [paidBillets, setPaidBillets] = useState(paidBilletsData);
  const [overdueBillets, setOverdueBillets] = useState(overdueBilletsData);
  const [, setClear] = useState<boolean>(false);
  const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom);
  const [selectCostCenters, setSelectCostCenters] = useAtom(costCenters);
  const [search, setSearch] = useState<string>("");
  const [selectStatus, setSelectStatus] = useAtom(statusAtom);
  const [, setSelectingCostsCenters] = useState<ItemsFilterSelecting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });

  const filterSearch = searchFilter({
    data:
      selectStatus.includes("Em aberto") && selectStatus.includes("Pago")
        ? allBillets
        : selectStatus.includes("Em aberto")
          ? openBillets
          : paidBillets,
    search,
  });

  const infoCard = BilletsInfoCard({
    openBillets,
    overdueBillets,
    paidBillets,
  });
  const generatePdf = () => {
    BillsToPayPdf({
      allBillets,
      status: selectStatus,
      billetFilter:
        selectStatus.includes("Em aberto") && selectStatus.includes("Pago")
          ? allBillets
          : selectStatus.includes("Em aberto")
            ? openBillets
            : paidBillets,
      dateStart: `${date.start.day}/${date.start.month}/${date.start.year}`,
      dateEnd: `${date.end.day}/${date.end.month}/${date.end.year}`,
    });
  };

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (activeRefresh)
      handleRefresh({
        token,
        date,
        clear: true,
        costsCenters: selectCostCenters,
        setLoading,
        setAllBillets,
        setOpenBillets,
        setOverdueBillets,
        setPaidBillets,
      });

    setActiveRefresh(false);
  }, [activeRefresh]);

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <section className="py-8">
        <Container>
          <ToolBar
            title="Resumo do Contas a Pagar"
            handleExportToPdf={generatePdf}
            handleRefreshClick={() =>
              handleRefresh({
                token,
                date,
                clear: true,
                setLoading,
                setAllBillets,
                setOpenBillets,
                setOverdueBillets,
                setPaidBillets,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                token,
                date: newDate,
                clear: false,
                setLoading,
                setDate,
                setAllBillets,
                setOpenBillets,
                setPaidBillets,
                setOverdueBillets,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                token,
                date,
                setLoading,
                setClear,
                setDate,
                setAllBillets,
                setOpenBillets,
                setOverdueBillets,
                setPaidBillets,
                setCostsCenters: setSelectingCostsCenters,
              })
            }
            descriptionHref="Visualizar em Gráfico"
            href="/billstopay"
            dateRange={date}
            search={search}
            setSearch={setSearch}
          />
          <Table
            data={filterSearch}
            columns={columns}
            renderCell={RenderCell}
            loading={loading}
          />
        </Container>
      </section>
    </main>
  );
}
