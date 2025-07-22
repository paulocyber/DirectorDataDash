"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Dados
import LateCustomerCard from "@/data/dataCards/billsToReceive/lateCustomer";
import columns from "@/data/columns/billsToReceive/lateCustomer/columns.json";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import { renderCell } from "@/components/renderCell/billsToReceive/lateCustomer";
import Table from "@/components/ui/tables";

// tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface LayoutLateCustomerProps {
  billetsInOpenData: ItemsBillsToReceive[];
  today: string;
}

export default function LayoutLateCustomer({
  billetsInOpenData,
  today,
}: LayoutLateCustomerProps) {
  const [billetsInOpen, setBilletsInOpen] = useState(billetsInOpenData);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  const { token } = useContext(AuthContext);

  const infoCard = LateCustomerCard({ billetsInOpen });

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <Container>
        <ToolBar
          title="Clientes em atraso"
          handleRefreshClick={() => console.log("Ativou!")}
          handleCleanFilter={() => console.log("Limpou!")}
          handleDateRangePicker={() => console.log("Data")}
          dateRange={date}
        />
        <Table
          data={billetsInOpen}
          columns={columns}
          renderCell={renderCell}
          loading={loading}
        />
      </Container>
    </main>
  );
}
