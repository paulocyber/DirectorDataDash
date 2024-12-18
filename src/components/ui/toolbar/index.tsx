'use client'

// React
import { ReactNode, useState } from "react"

// Bibliotecas
import { Autocomplete, AutocompleteItem, DateRangePicker, DateValue, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, RangeValue } from "@nextui-org/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GoSync } from "react-icons/go";
import { RiFormatClear } from "react-icons/ri";
import { AiOutlinePieChart } from "react-icons/ai";
import { VscTable } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import { ImFilePdf } from "react-icons/im";
import { FaStore } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

// Componentes
import { Input } from "../input";
import { Button } from "../button";

// Tipagem
interface ToolBarProps {
    title: string;
    descriptionHref?: string;
    href?: string;
    dateRange?: RangeValue<DateValue>;
    selectedDateRange?: string;
    searchFilter?: string;
    displayFormOfPayment?: boolean;
    emp?: string;
    handleRefreshClick: () => void;
    handleDateRangePicker?: (date: RangeValue<DateValue>) => void;
    handleDate?: (date: string) => void;
    handleCleanFilter?: () => void;
    setFilterSearch?: (value: string) => void;
    generatePDF?: () => void;
    setEmp?: (value: string) => void;
    setFilterStatus?: (value: string) => void;
    children?: ReactNode;
}

export default function ToolBar({ title, descriptionHref, href, dateRange, searchFilter, selectedDateRange, displayFormOfPayment, emp, handleRefreshClick, handleCleanFilter, handleDateRangePicker, handleDate, setFilterSearch, generatePDF, setEmp, setFilterStatus, children }: ToolBarProps) {
    const [animation, setAnimation] = useState<Boolean>(false)

    return (
        <div className="flex flex-col w-full">
            <div className="flex w-full items-center justify-center rounded-lg bg-white py-4 px-7">
                <div className="flex justify-start w-full items-center text-gray-800">
                    <div className="flex w-full items-center ">
                        <h1 className="font-bold md:text-lg text-sm">{title} </h1>
                        <div className="lg:flex hidden">
                            <div className={`${!handleDate && 'hidden'} flex w-full items-center justify-start space-x-1 bg-white pb-4 px-7`}>
                                <Button onClick={() => { handleDate && handleDate('day') }} color={selectedDateRange === 'day' ? "primary" : undefined} className={selectedDateRange != 'day' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Dia</ Button>
                                <Button onClick={() => { handleDate && handleDate('week') }} color={selectedDateRange === 'week' ? "primary" : undefined} className={selectedDateRange != 'week' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Semana</Button>
                                <Button onClick={() => { handleDate && handleDate('month') }} color={selectedDateRange === 'month' ? "primary" : undefined} className={selectedDateRange != 'month' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Mês</Button>
                                {/* <Button onClick={() => { handleDate && handleDate('month yesterday') }} color={selectedDateRange === 'month yesterday' ? "primary" : undefined} className={selectedDateRange != 'month yesterday' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Mês Passado</Button> */}
                                <Button onClick={() => { handleDate && handleDate('others') }} color={selectedDateRange === 'others' ? "primary" : undefined} className={selectedDateRange != 'others' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Outros</Button>
                                <Button onClick={() => { handleDate && handleDate('year') }} color={selectedDateRange === 'year' ? "primary" : undefined} className={selectedDateRange != 'year' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Ano</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end w-auto lg:px-3">
                    <div className="flex w-full items-center px-3">
                        <div className="flex w-full items-center px-3">
                            {children}
                            <div className={`${!setFilterSearch ? 'hidden' : 'px-2 md:mt-0 mt-2 md:w-56 w-full sm:flex hidden mr-auto'}`}>
                                <Input
                                    size="sm"
                                    value={searchFilter}
                                    onClear={() => setFilterSearch && setFilterSearch('')}
                                    onChange={(e) => setFilterSearch && setFilterSearch(e.target.value)}
                                    placeholder="Digite alguma coisa"
                                    startContent={<CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                />
                            </div>

                            <div className="lg:flex hidden ">
                                <DateRangePicker
                                    aria-label="filtro de data"
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
                            </div>
                            <div className={`${!displayFormOfPayment ? 'hidden' : 'flex space-x-4 lg:flex hidden'} `}>
                                <Button color="primary" className="font-bold" size="sm">Avista</Button>
                                <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Outros</Button>
                                <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Todos</Button>
                            </div>
                        </div>

                        <Dropdown classNames={{ base: "px-2", content: "w-full", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out `, backdrop: "w-10" }}>
                            <DropdownTrigger>
                                <button>
                                    <BiDotsHorizontalRounded className="text-3xl" />
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                                <DropdownItem
                                    isReadOnly
                                    className={`flex justify-center items-center text-sm font-medium py-2 lg:hidden ${!dateRange && 'hidden'} `}
                                    textValue="Filtro de data"
                                    children={
                                        <DateRangePicker
                                            aria-label="filtro de data"
                                            size="sm"
                                            classNames={{
                                                inputWrapper: `bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500`,
                                                base: `text-white  ${!dateRange && 'hidden'}`,
                                                innerWrapper: "py-[0.2em] text-white ",
                                                segment: "text-white",
                                                selectorIcon: "text-center text-white",
                                            }}
                                            value={dateRange}
                                            onChange={handleDateRangePicker}
                                        />
                                    }
                                />
                                <DropdownItem
                                    isReadOnly
                                    startContent={<FaStore className="text-lg" />}
                                    className={emp ? "flex justify-center items-center w-full text-sm font-medium py-2" : "hidden"}
                                    textValue="lojas"
                                    children={
                                        <Autocomplete aria-label="Filtro de empresas" selectedKey={emp} onSelectionChange={(key) => {
                                            if (setEmp) {
                                                if (key) {
                                                    setEmp(key.toString());
                                                } else {
                                                    setEmp('');
                                                }
                                            }
                                        }} value={emp} className="w-full" size="sm">
                                            <AutocompleteItem key="0">Grupo PlayCell</AutocompleteItem>
                                            <AutocompleteItem key="1">PlayCell</AutocompleteItem>
                                            <AutocompleteItem key="2">Play Personalizados</AutocompleteItem>
                                            <AutocompleteItem key="3">Play Up</AutocompleteItem>
                                            <AutocompleteItem key="4">Play Capas</AutocompleteItem>
                                            <AutocompleteItem key="4">Inow</AutocompleteItem>
                                        </Autocomplete>
                                    }
                                />
                                <DropdownItem
                                    startContent={<GoSync className={animation ? "animate-spin text-lg" : "text-lg"} />}
                                    onMouseEnter={() => setAnimation(true)}
                                    onMouseLeave={() => setAnimation(false)}
                                    className="flex justify-center items-center text-sm font-medium py-2"
                                    textValue="atualizar"
                                    onClick={handleRefreshClick}
                                    endContent={<span className="md:text-sm text-xs w-full">Atualizar</span>}
                                />
                                <DropdownItem
                                    isReadOnly
                                    className={`flex ${!setFilterStatus && 'hidden'} justify-center items-center text-sm font-medium py-2`}
                                    textValue="status"
                                    // onClick={handleRefreshClick}
                                    children={
                                        <Dropdown classNames={{ base: "end-10" }}>
                                            <DropdownTrigger>
                                                <div className="w-full flex ">
                                                    <button className="w-full flex items-start justify-start">
                                                        <MdOutlineKeyboardArrowDown className="text-xl" />
                                                        <span className="md:text-sm text-xs px-4 font-semibold">Status</span>
                                                    </button>
                                                </div>
                                            </DropdownTrigger>
                                            <DropdownMenu variant="faded" aria-label="Dropdown status">
                                                <DropdownItem>
                                                    <button onClick={() => setFilterStatus && setFilterStatus('Paga')} className="md:text-sm text-xs w-full">Pago</button>
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <button onClick={() => setFilterStatus && setFilterStatus('Em aberto')} className="md:text-sm text-xs w-full">Em Aberto</button>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    }
                                />
                                <DropdownItem
                                    startContent={<RiFormatClear className="text-lg" />}
                                    className="flex justify-center items-center w-full text-sm font-medium py-2"
                                    onClick={handleCleanFilter}
                                    textValue="limpa filtro"
                                    endContent={<span className="md:text-sm text-xs w-full">Limpa filtro</span>}
                                />
                                <DropdownItem
                                    id="href"
                                    key="homeback"
                                    startContent={descriptionHref === 'Grafico' ? <AiOutlinePieChart className="text-lg" /> : <VscTable className="text-lg" />}
                                    className={!href ? 'hidden' : `flex justify-center items-center text-sm font-medium py-2`}
                                    textValue="tabela"
                                    href={href}
                                    endContent={<p className="md:text-sm text-xs w-full">{descriptionHref}</p>}
                                />
                                <DropdownItem
                                    startContent={<ImFilePdf className="text-lg" />}
                                    className={!generatePDF ? "hidden" : "flex justify-center items-center w-full text-sm font-medium py-2"}
                                    onClick={generatePDF}
                                    textValue="Gerar PDF"
                                    endContent={<span className="md:text-sm text-xs w-full">Gerar PDF</span>}
                                />
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            {/* Responsivo */}
            <div className="flex w-full items-center justify-between sm:flex-nowrap flex-wrap lg:hidden overflow-auto px-7">
                <div className={`${!handleDate && 'hidden'} flex w-full  justify-start space-x-1 bg-white pb-4 px-0`}>
                    <Button onClick={() => { handleDate && handleDate('day') }} color={selectedDateRange === 'day' ? "primary" : undefined} className={selectedDateRange !== 'day' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="sm">Dia</Button>
                    <Button onClick={() => { handleDate && handleDate('week') }} color={selectedDateRange === 'week' ? "primary" : undefined} className={selectedDateRange !== 'week' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="sm">Semana</Button>
                    <Button onClick={() => { handleDate && handleDate('month') }} color={selectedDateRange === 'month' ? "primary" : undefined} className={selectedDateRange !== 'month' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="sm">Mês</Button>
                    <Button onClick={() => { handleDate && handleDate('year') }} color={selectedDateRange === 'year' ? "primary" : undefined} className={selectedDateRange !== 'year' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="sm">Ano</Button>
                </div>

                <div className={`${!setFilterSearch ? 'hidden' : 'px-2 my-2 w-full flex sm:hidden'} `}>
                    <Input
                        size="sm"
                        value={searchFilter}
                        onClear={() => setFilterSearch && setFilterSearch('')}
                        onChange={(e) => setFilterSearch && setFilterSearch(e.target.value)}
                        placeholder="Digite alguma coisa"
                        startContent={<CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                    />
                </div>

                <div className={`${!displayFormOfPayment ? 'hidden' : 'flex space-x-4 justify-end w-full '} `}>
                    <Button color="primary" className="font-bold" size="sm">Avista</Button>
                    <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Outros</Button>
                    <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Todos</Button>
                </div>
            </div>
        </div>
    )
}