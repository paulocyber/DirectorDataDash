// Biblioteca
import { Autocomplete, AutocompleteItem, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { GoSync } from "react-icons/go";
import { RiFilterLine, RiFormatClear } from "react-icons/ri";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlinePieChart } from "react-icons/ai";
import { VscTable } from "react-icons/vsc";
import Link from "next/link";
import { ImFilePdf } from "react-icons/im";
import { CiSearch } from "react-icons/ci";

// React
import { useState } from "react";

// Componentes
import { Input } from "../../input";
import { FaStore } from "react-icons/fa6";

// Tipagem
interface DropDownProps {
    href?: string;
    descriptionHref?: string;
    displayInputSearch?: boolean;
    displayEmp?: boolean;
    searchFilter?: string;
    emp?: string;
    handleRefreshClick: () => void;
    handleFilters?: (key: React.Key | null) => void;
    handleCleanFilter?: () => void;
    setFilterSearch?: (value: string) => void;
    setEmp?: (value: string) => void;
    generatePDF?: () => void;
}

export default function OptionsToolBar({ href, descriptionHref, displayInputSearch, searchFilter, handleRefreshClick, handleCleanFilter, setFilterSearch, generatePDF, displayEmp, emp, setEmp, handleFilters }: DropDownProps) {
    const [animation, setAnimation] = useState<Boolean>(false)

    return (
        <Dropdown classNames={{ base: "top-1 right-2", content: "w-full", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out `, backdrop: "w-10" }}>
            <DropdownTrigger>
                <button>
                    <BiDotsHorizontalRounded className="text-3xl" />
                </button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                <DropdownItem
                    isReadOnly
                    startContent={<CiSearch className="text-lg" />}
                    className={displayInputSearch ? 'hidden' : `flex justify-center items-center w-full text-sm font-medium py-2 sm:hidden`}
                    textValue="Filtro de pesquisa"
                    endContent={<Input size="sm" className="w-full" onClear={() => setFilterSearch && setFilterSearch('')} onChange={(e) => setFilterSearch && setFilterSearch(e.target.value)} placeholder="Digite alguma coisa" />}
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
                {/* <DropdownItem
                    isReadOnly
                    startContent={<RiFilterLine className="text-lg" />}
                    className="flex justify-center items-center w-full text-sm font-medium py-2"
                    textValue="Filtros"
                    children={
                        <Dropdown classNames={{trigger: "w-full flex"}} >
                            <DropdownTrigger>
                                <button>
                                    Open Menu
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Action event example"
                            >
                                <DropdownItem key="new">New file</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    }
                />  */}
                <DropdownItem
                    isReadOnly
                    startContent={<FaStore className="text-lg" />}
                    className={displayEmp ? "flex justify-center items-center w-full text-sm font-medium py-2" : "hidden"}
                    // onClick={handleCleanFilter}
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
                            <AutocompleteItem key="1">PlayCell</AutocompleteItem>
                            <AutocompleteItem key="2">Play Personalizados</AutocompleteItem>
                            <AutocompleteItem key="3">Play Up</AutocompleteItem>
                        </Autocomplete>
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
                    // endContent={<Link href={href ? href : ''} className="md:text-sm text-xs w-full">{descriptionHref}</Link>}
                    endContent={<Link href={href ? href : ''} className="md:text-sm text-xs w-full">{descriptionHref}</Link>}
                />
                {/* Gerador de pdf */}
                <DropdownItem
                    startContent={<ImFilePdf className="text-lg" />}
                    className={!generatePDF ? "hidden" : "flex justify-center items-center w-full text-sm font-medium py-2"}
                    onClick={generatePDF}
                    textValue="Gerar PDF"
                    endContent={<span className="md:text-sm text-xs w-full">Gerar PDF</span>}
                />
            </DropdownMenu>
        </Dropdown>
    )
}