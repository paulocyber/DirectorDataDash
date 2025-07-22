"use client";

// React
import { ReactNode, useEffect, useRef, useState } from "react";

// Next
import { usePathname } from "next/navigation";

// Componentes
import SideNav from "@/components/ui/menu/sideNav";
import { HeaderNav } from "../menu/headerNav";
import Drawer from "../drawer";

// Bibliotecas
import { useDisclosure } from "@heroui/react";
import { useAtom } from "jotai";

// Dados
import DrawerSettingsJson from "@/data/drawerSettings/sales";

// Atoms
import { MethodsOfPayments } from "@/atom/filters/davs";
import { Companies } from "@/atom/filters/company";
import { Tables } from "@/atom/filters/tables";
import { costCenters } from "@/atom/filters/constCenters";
import { statusAtom } from "@/atom/filters/status";
import { Peoples } from "@/atom/filters/peoples";
import { suppliers } from "@/atom/filters/suppliers";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
interface LayoutProps {
  role: string;
  children: ReactNode;
  paymentMethodData?: TypeFilterProps[];
  companiesData?: TypeFilterProps[];
  costCentersData?: TypeFilterProps[];
  peoplesData?: TypeFilterProps[];
  suppliersData?: TypeFilterProps[];
}

export default function Layout({
  children,
  role,
  paymentMethodData,
  companiesData,
  costCentersData,
  peoplesData,
  suppliersData,
}: LayoutProps) {
  const [isOpen, setIsopen] = useState<boolean>(false);
  const [selectingMethodsPayment, setSelectingMethodsPayment] =
    useAtom(MethodsOfPayments);
  const [selectTheCompany, setSelectTheCompany] = useAtom(Companies);
  const [selectCostCenters, setSelectCostCenters] = useAtom(costCenters);
  const [selectStatus, setSelectStatus] = useAtom(statusAtom);
  const [selectTables, setSelectTables] = useAtom(Tables);
  const [selectPeoples, setSelectPeoples] = useAtom(Peoples);
  const [selectSuppliers, setSelectSuppliers] = useAtom(suppliers);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsopen(false);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsopen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { isOpen: openSettings, onOpen, onOpenChange } = useDisclosure();

  const drawerSettings = DrawerSettingsJson({
    // Dados
    companiesData,
    costCentersData,
    paymentMethodData,
    peoplesData,
    suppliersData,
    // Filtro de seleção
    selectingMethodsPayment,
    selectTables,
    selectStatus,
    selectCostCenters,
    selectTheCompany,
    selectPeoples,
    selectSuppliers,
    setSelectingMethodsPayment,
    setSelectStatus,
    setSelectCostCenters,
    setSelectTheCompany,
    setSelectTables,
    setSelectPeoples,
    setSelectSuppliers,
  });

  const drawerConfig = drawerSettings[router];

  return (
    <main className="w-full bg-[#f8fafc] h-screen overflow-auto">
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50" />
      )}
      <div ref={menuRef}>
        <SideNav role={role} toggleMenuState={isOpen} close={setIsopen} />
      </div>
      <HeaderNav
        role={role}
        open={setIsopen}
        openSettings={drawerConfig ? onOpen : undefined}
      />
      <section className="p-4 xl:ml-72 z-20">{children}</section>
      {drawerConfig && (
        <Drawer
          isOpen={openSettings}
          onOpenChange={onOpenChange}
          setClear={drawerConfig.clear}
        >
          <drawerConfig.Component {...drawerConfig.props} />
        </Drawer>
      )}
    </main>
  );
}
