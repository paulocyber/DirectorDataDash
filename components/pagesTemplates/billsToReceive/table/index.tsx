"use client";

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Next
import { usePathname } from "next/navigation";

// Atom
import { Peoples } from "@/atom/filters/peoples";
import { refreshAtom } from "@/atom/isActivateRefresh";

// Dados
import BilletsInfoCard from "@/data/dataCards/billsToReceive";
import columnsBillsToReceive from "@/data/columns/billsToReceive/columns.json";
import DrawerSettingsJson from "@/data/drawerSettings/sales";
import collumnsProductsInDav from "@/data/columns/dav/products/columns.json";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { renderCell as billetsCell } from "@/components/renderCell/billsToReceive";
import Drawer from "@/components/ui/drawer";
import Filters from "@/components/ui/filters";
import { renderCell as prodcutsCell } from "@/components/renderCell/davs/products";

// Bibliotecas
import { DateValue, RangeValue, useDisclosure } from "@heroui/react";

// Utils
import { davsQueries } from "@/utils/querys/dav";
import {
  handleRefresh,
  handleCleanFilter,
  handleDateFilter,
} from "@/utils/filters/handleFilters/billsToReceive";
import { fetchData } from "@/utils/fetchs/fetchData";
import BillsToReceivePdf from "@/utils/relatorys/pdf/billstoreceive";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";
import { TypeFilterProps } from "@/types/filters/selecting";
import { useAtom } from "jotai";
import { parseDate } from "@internationalized/date";
interface LayoutBillsToReceiveTableProps {
  allbilletsData: ItemsBillsToReceive[];
  billetsOpenData: ItemsBillsToReceive[];
  peopleData: TypeFilterProps[];
  today: string;
}

export default function LayoutBillsToReceiveTable({
  allbilletsData,
  billetsOpenData,
  peopleData,
  today,
}: LayoutBillsToReceiveTableProps) {
  const [allBillets, setAllBilets] = useState(allbilletsData);
  const [billetsOpen, setBilletsOpen] = useState(billetsOpenData);
  const [detailDav, setDetailDav] = useState<any[] | undefined>(undefined);
  const [selectingPeoples, setSelectingPeoples] = useAtom(Peoples);
  const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(`${today}`).toISOString().split("T")[0]),
  });

  const currentPath = usePathname();
  const { token } = useContext(AuthContext);

  const infoCard = BilletsInfoCard({
    allBilletsData: allBillets,
    filter: selectingPeoples,
  });
  const routerDrawerSettings = DrawerSettingsJson({
    peoplesData: peopleData,
    selectPeoples: selectingPeoples,
    setSelectPeoples: setSelectingPeoples,
  });
  const currentDrawerSettings = routerDrawerSettings[currentPath];
  async function handleDetailDav(ID_ORIGEM: string, ID_PSS?: string) {
    setSelectingPeoples([`${ID_PSS}`]);

    const { obtainProductsContainedInDav } = davsQueries({ id: ID_ORIGEM });

    handleRefresh({
      token,
      date,
      peoples: [`${ID_PSS}`],
      setLoading,
      setBillsToReceive: setAllBilets,
      setBilletsOpen,
    });

    const queries = [
      fetchData({
        ctx: token,
        query: obtainProductsContainedInDav,
        setData: (data) => setDetailDav(data),
      }),
    ];

    await Promise.all(queries);
  }
  useEffect(() => {
    if (activeRefresh) {
      handleRefresh({
        token,
        date,
        peoples: selectingPeoples,
        setLoading,
        setBillsToReceive: setAllBilets,
        setBilletsOpen: setBilletsOpen,
      });
      setActiveRefresh(false);
    }
  }, [activeRefresh]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const generatePdf = () => {
    BillsToReceivePdf({
      allbilletsData,
      billetsOpenData,
      dateInit: `${date.start.day}/${date.start.month}/${date.start.year}`,
      dateEnd: `${date.end.day}/${date.end.month}/${date.end.year}`,
    });
  };

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <Container>
        <ToolBar
          title="Contas a receber"
          descriptionHref="Visualizar em Gráfico"
          href="/billstoreceive"
          handleExportToPdf={generatePdf}
          handleRefreshClick={() =>
            handleRefresh({
              token,
              date,
              peoples: selectingPeoples,
              setLoading,
              setBillsToReceive: setAllBilets,
              setBilletsOpen: setBilletsOpen,
            })
          }
          handleCleanFilter={() =>
            handleCleanFilter({
              date,
              token,
              setPeoples: setSelectingPeoples,
              setDate,
              setLoading,
              setBillsToReceive: setAllBilets,
              setBilletsOpen: setBilletsOpen,
              setDetailDav,
            })
          }
          handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
            handleDateFilter({
              date: newDate,
              token,
              peoples: selectingPeoples,
              setDate,
              setLoading,
              setBillsToReceive: setAllBilets,
              setBilletsOpen,
              setDetailDav,
            })
          }
          handleFilters={onOpen}
          dateRange={date}
        />
        <Table
          data={billetsOpen}
          columns={columnsBillsToReceive}
          renderCell={billetsCell}
          detail={handleDetailDav}
          loading={loading}
        />
      </Container>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setClear={currentDrawerSettings.clear}
      >
        <Filters
          title="Clientes"
          data={peopleData}
          idKey="ID_PSS"
          labelKey="NOME_PSS"
          valueKey="ID_PSS"
          value={selectingPeoples}
          setValue={setSelectingPeoples}
        />
      </Drawer>
      {detailDav && detailDav.length > 0 && (
        <Container>
          <div className="w-full flex justify-between items-center p-5">
            <h1 className="font-bold text-xl text-gray-800">Produtos</h1>
          </div>
          <Table
            columns={collumnsProductsInDav}
            data={detailDav}
            renderCell={prodcutsCell}
            loading={false}
          />
        </Container>
      )}
    </main>
  );
}
