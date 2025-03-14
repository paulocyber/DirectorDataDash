// Biblioteca
import {
    DateRangePicker,
    DateValue,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    RangeValue
} from "@heroui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaChartPie, FaFilter } from "react-icons/fa";
import { GoSync } from "react-icons/go";
import { RiFormatClear } from "react-icons/ri";
import { ImFilePdf } from "react-icons/im";

// Componentes
import { Input } from "../input";

// Tipagem
interface ToolBarProps {
    title: string;
    descriptionHref?: string;
    href?: string;
    dateRange?: RangeValue<DateValue>;
    search?: string;
    setSearch?: (value: string) => void;
    handleDateRangePicker?: (date: RangeValue<DateValue> | null) => void;
    handleRefreshClick: () => void;
    handleFilters?: () => void;
    handleCleanFilter: () => void;
    exportToPDF?: () => void;
}

export default function ToolBar({
    title,
    descriptionHref,
    href,
    dateRange,
    search,
    setSearch,
    handleDateRangePicker,
    handleRefreshClick,
    handleFilters,
    handleCleanFilter,
    exportToPDF
}: ToolBarProps) {
    return (
        <div className="flex flex-col w-full p-3">
            <div className="flex items-center justify-between mb-2">
                <h1 className="font-bold text-xl text-gray-800">{title}</h1>

                <div className="flex items-center space-x-3">

                    <Input
                        size="sm"
                        placeholder="Pesquise algo"
                        className={search === undefined ? 'hidden' : 'max-w-xs'}
                        startContent={<CiSearch className="w-4 h-4 text-gray-500" />}
                        value={search}
                        onChange={(e) => setSearch && setSearch(e.target.value)}
                    />

                    <DateRangePicker
                        aaria-label="Selecionar intervalo de datas"
                        disableAnimation
                        className={dateRange ? `lg:flex hidden` : 'hidden'}
                        size="sm"
                        classNames={{
                            inputWrapper:
                                "bg-blue-600 hover:bg-blue-700 text-white rounded-md",
                            innerWrapper: "py-[0.2em] text-white",
                            segment: "text-white",
                            selectorIcon: "text-white",
                        }}
                        value={dateRange}
                        onChange={handleDateRangePicker}
                    />

                    <Dropdown>
                        <DropdownTrigger>
                            <button
                                className="p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                                aria-label="Abrir menu de ações"
                            >
                                <BiDotsHorizontalRounded className="text-2xl" />
                            </button>
                        </DropdownTrigger>

                        <DropdownMenu variant="faded" aria-label="Menu de ações">
                            <DropdownItem
                                key="FiltroDeData"
                                isReadOnly
                                className={`lg:hidden ${!dateRange && "hidden"}`}
                                textValue="Filtro de data"
                            >
                                <DateRangePicker
                                    aria-label="Filtro de data"
                                    disableAnimation
                                    size="sm"
                                    classNames={{
                                        inputWrapper: `lg:flex bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500`,
                                        base: `text-white  ${!dateRange && 'hidden'}`,
                                        innerWrapper: "py-[0.2em] text-white ",
                                        segment: "text-white",
                                        selectorIcon: "text-center text-white",
                                    }}
                                    value={dateRange}
                                    onChange={handleDateRangePicker}
                                />
                            </DropdownItem>

                            <DropdownItem
                                key="Refresh"
                                startContent={<GoSync className="text-lg" />}
                                onClick={handleRefreshClick}
                            >
                                Atualizar
                            </DropdownItem>

                            <DropdownItem
                                key="Clear"
                                startContent={<RiFormatClear className="text-lg" />}
                                onClick={handleCleanFilter}
                            >
                                Limpar Filtro
                            </DropdownItem>

                            <DropdownItem
                                key="Filters"
                                startContent={<FaFilter />}
                                onClick={handleFilters}

                                classNames={{ base: `${!handleFilters && 'hidden'}`, }}
                            >
                                Filtros
                            </DropdownItem>

                            <DropdownItem
                                key="ToggleView"
                                startContent={
                                    descriptionHref === "Visualizar em Gráfico" ? (
                                        <FaChartPie className="text-lg" />
                                    ) : (
                                        <BsTable className="text-lg" />
                                    )
                                }
                                classNames={{ base: `${!href && 'hidden'}` }}
                                href={href}
                            >
                                {descriptionHref}
                            </DropdownItem>

                            <DropdownItem
                                key="generatePdf"
                                startContent={<ImFilePdf className="text-lg" />}
                                className={!exportToPDF ? "hidden" : "flex justify-center items-center w-full text-sm font-medium py-2"}
                                onClick={exportToPDF}
                                textValue="Gerar PDF"
                                endContent={<span className="md:text-sm text-xs w-full">Gerar PDF</span>}
                            />
                        </DropdownMenu>
                    </Dropdown>
                </div>

            </div>
        </div >
    );
}
