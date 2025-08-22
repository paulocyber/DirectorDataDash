"use client";

// React
import { useContext, useEffect, useState } from "react";

// Next
import { redirect, usePathname } from "next/navigation";

// Bibliotecas
import { DateValue, RangeValue, useDisclosure } from "@heroui/react";
import { useAtom } from "jotai";
import { useTopLoader } from "nextjs-toploader";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { renderCell } from "@/components/renderCell/davs";
import Drawer from "@/components/ui/drawer";

// Dados
import DavInfoCard from "@/data/dataCards/dav";
import columns from "@/data/columns/dav/columns.json";

// Utils
import {
  handleCleanFilter,
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/davs";

// Providers
import { AuthContext } from "@/providers/auth";

// Atom
import { MethodsOfPayments } from "@/atom/filters/davs";
import { refreshAtom } from "@/atom/isActivateRefresh";
import { sellers } from "@/atom/filters/sellers";
import { Companies } from "@/atom/filters/company";

// tipagem
import { parseDate } from "@internationalized/date";
import { ItemsDavData } from "@/types/davs";
import DrawerSettingsJson from "@/data/drawerSettings/sales";
import { TypeFilterProps } from "@/types/filters/selecting";
import { Peoples } from "@/atom/filters/peoples";
interface LayoutDavTableProps {
  davsData: ItemsDavData[];
  profitData: string;
  paymentMethodData: TypeFilterProps[];
  companiesData?: TypeFilterProps[];
  peoplesData?: TypeFilterProps[];
  sellersData?: TypeFilterProps[];
  serachParams?: string[];
  today: string;
}

export default function LayoutDavTable({
  davsData,
  profitData,
  serachParams,
  paymentMethodData,
  companiesData,
  peoplesData,
  sellersData,
  today,
}: LayoutDavTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [davs, setDavs] = useState(davsData);
  const [profit, setProfit] = useState(profitData);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectingMethodsPayment, setSelectingMethodsPayment] =
    useAtom(MethodsOfPayments);
  const [selectSellers, setSelectSellers] = useAtom(sellers);
  const [selectTheCompany, setSelectTheCompany] = useAtom(Companies);
  const [selectPeoples, setSelectPeoples] = useAtom(Peoples);
  const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  const infoCard = DavInfoCard({ davs, profit });
  const loader = useTopLoader();
  const routerDrawerSettings = DrawerSettingsJson({
    paymentMethodData,
    sellersData,
    companiesData,
    peoplesData,
    selectingMethodsPayment,
    selectSellers,
    selectTheCompany,
    selectPeoples,
    setSelectingMethodsPayment,
    setSelectTheCompany,
    setSelectPeoples,
    setSelectSellers,
  });
  const currentPath = usePathname();
  const currentDrawerSettings = routerDrawerSettings[currentPath];

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (activeRefresh) {
      handleRefresh({
        date,
        token,
        formsOfPayments: selectingMethodsPayment,
        idSellers: selectSellers,
        selectPeoples,
        selectTheCompany,
        setDavs,
        setProfit,
        setLoading,
      });
      setActiveRefresh(false);
    }

    if (serachParams && serachParams?.length > 0) {
      setSelectingMethodsPayment(serachParams);
    }
  }, [activeRefresh]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleDetailDav(idOrigem: string, idPss?: string) {
    loader.start();

    redirect(`/davs/table/${idOrigem}`);
  }

  return (
    <>
      <InfoCard data={infoCard} />
      <section className="py-8">
        <Container>
          <ToolBar
            title="Relatório de DAV'S"
            handleRefreshClick={() =>
              handleRefresh({
                date,
                token,
                formsOfPayments: selectingMethodsPayment,
                idSellers: selectSellers,
                selectPeoples,
                setDavs,
                setProfit,
                setLoading,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                token,
                formsOfPayments: selectingMethodsPayment,
                idSellers: selectSellers,
                selectPeoples,
                date: newDate,
                setDate,
                setDavs,
                setProfit,
                setLoading,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                token,
                formsOfPayments: selectingMethodsPayment,
                setDate,
                setDavs,
                setLoading,
                setSelectTheCompany,
                setSelectPeoples,
                setProfit,
                setIdSellers: setSelectSellers,
              })
            }
            handleFilters={onOpen}
            descriptionHref="Visualizar em Gráfico"
            href="/davs"
            dateRange={date}
          />
          <Table
            data={davs}
            columns={columns}
            renderCell={renderCell}
            loading={loading}
            detail={handleDetailDav}
          />
        </Container>
      </section>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setClear={currentDrawerSettings.clear}
      >
        <currentDrawerSettings.Component {...currentDrawerSettings.props} />
      </Drawer>
    </>
  );
}
