"use client";

// Biblioteca
import {
  DateRangePicker,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoSync } from "react-icons/io5";
import { RiFormatClear } from "react-icons/ri";
import { BsTable } from "react-icons/bs";
import { FaChartPie, FaFilter, FaRegFilePdf } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

// React
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Data
import RulesByUsers from "@/data/rulesByUsers";

// Next
import { usePathname } from "next/navigation";

// Componentes
import { Input } from "../input";

// Tipagem
import { RangeValue } from "@react-types/shared";
import type { DateValue } from "@internationalized/date";
import { Button } from "@heroui/button";
interface ToolBarProps {
  title: string;
  descriptionHref?: string;
  href?: string;
  dateRange?: RangeValue<DateValue>;
  search?: string;
  titleAdd?: string;
  setSearch?: (value: string) => void;
  handleDateRangePicker?: (date: RangeValue<DateValue> | null) => void;
  handleRefreshClick: () => void;
  handleCleanFilter?: () => void;
  handleAdd?: () => void;
  handleFilters?: () => void;
  handleExportToPdf?: () => void;
}

export default function ToolBar({
  title,
  descriptionHref,
  dateRange,
  href,
  search,
  titleAdd,
  setSearch,
  handleAdd,
  handleRefreshClick,
  handleDateRangePicker,
  handleCleanFilter,
  handleFilters,
  handleExportToPdf,
}: ToolBarProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null);
  const { role } = useContext(AuthContext);

  const rules = useMemo(() => RulesByUsers({ role }), [role]);
  const pathname = usePathname();

  let routeColor = `bg-gradient-to-b from-orange-400 to-orange-600`;

  const activeSection = rules.find((section) =>
    section.items.some((item) => pathname === item.href)
  );

  if (activeSection) {
    const item = activeSection.items.find((item) => pathname === item.href);
    if (item?.color) {
      routeColor = `bg-gradient-to-b ${item.color}`;
    }
  }

  const hoverClasses = useMemo(() => {
    return routeColor
      .split(" ")
      .map((c) => `hover:${c}`)
      .join(" ");
  }, [routeColor]);

  return (
    <div className="flex flex-col w-full p-3">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-extrabold sm:text-xl truncate pr-2 text-lg text-gray-800">
          {title}
        </h1>
        <div className="flex items-center space-x-3">
          <Input
            size="sm"
            placeholder="Pesquise algo"
            className={search === undefined ? "hidden" : "max-w-xs"}
            startContent={<CiSearch className="w-4 h-4 text-gray-500" />}
            value={search}
            onChange={(e) => setSearch && setSearch(e.target.value)}
          />

          {handleAdd && (
            <Button
              onClick={handleAdd}
              className={`hidden md:inline-flex items-center text-white ${routeColor} hover:opacity-90 transition min-w-36`}
            >
              {titleAdd}
            </Button>
          )}

          {/* <DateRangePicker
  pageBehavior="single"
  disableAnimation
  value={date}
  size="sm"
  onChange={(newDate: RangeValue<DateValue> | null) =>
    handleDateFilter({
      setDate()
    })
  }
/> */}
          <Dropdown onClose={() => setOpen(false)}>
            <DropdownTrigger>
              <button
                className={`p-2 rounded-lg ${hoverClasses}  ${open && `${routeColor} text-white`} hover:text-white transition-all`}
                onClick={() => setOpen(!open)}
                aria-label="Abrir menu de ações"
              >
                <BiDotsHorizontalRounded className="text-2xl hover:text-gray-800" />
              </button>
            </DropdownTrigger>

            <DropdownMenu variant="faded" aria-label="Menu de ações">
              <DropdownItem
                aria-label="Filtro de data"
                key="FiltroDeData"
                textValue="Filtro de data"
                classNames={{ title: "font-bold text-gray-800" }}
                className={`lg:hidden ${!dateRange && "hidden"}`}
              >
                {/* <DateRangePicker
                  aria-label="Filtro de data"
                  disableAnimation
                  size="sm"
                  // value={dateRange}
                  onChange={handleDateRangePicker}
                /> */}
              </DropdownItem>

              <DropdownItem
                key="Refresh"
                textValue="Atualizar"
                classNames={{ title: "font-bold text-gray-800" }}
                startContent={<IoSync className="text-lg font-bold" />}
                onPress={handleRefreshClick}
              >
                Atualizar
              </DropdownItem>

              <DropdownItem
                key="Filters"
                textValue="Filtros"
                startContent={<FaFilter />}
                onPress={handleFilters}
                classNames={{
                  base: `${!handleFilters && "hidden"}`,
                  title: "font-bold text-gray-800",
                }}
              >
                Filtros
              </DropdownItem>

              <DropdownItem
                key="generatePdf"
                startContent={<FaRegFilePdf className="text-lg" />}
                className={
                  !handleExportToPdf
                    ? "hidden"
                    : "flex justify-center items-center w-full text-sm font-medium py-2"
                }
                onClick={handleExportToPdf}
                textValue="Gerar PDF"
                endContent={
                  <span className="md:text-sm text-xs font-bold w-full">
                    Gerar PDF
                  </span>
                }
              />

              <DropdownItem
                key="Clear"
                textValue="Limpar Filtro"
                classNames={{ title: "font-bold text-gray-800" }}
                startContent={<RiFormatClear className="text-lg" />}
                onPress={handleCleanFilter}
              >
                Limpar Filtro
              </DropdownItem>

              <DropdownItem
                key="ToggleView"
                textValue="Descrição"
                startContent={
                  descriptionHref === "Visualizar em Gráfico" ? (
                    <FaChartPie className="text-lg" />
                  ) : (
                    <BsTable className="text-lg" />
                  )
                }
                classNames={{
                  base: `${!href && "hidden"}`,
                  title: "font-bold text-gray-800",
                }}
                href={href}
              >
                {descriptionHref}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
