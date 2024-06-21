// Biblioteca
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GoSync } from "react-icons/go";
import { VscTable } from "react-icons/vsc";
import { RiFormatClear } from "react-icons/ri"

// Famework
import Link from "next/link";

// React
import { useEffect } from "react";;

// Tipagem
interface optionsProps {
    setDropDown: (value: boolean) => void
    setAnimation: (value: boolean) => void
    dropDown: boolean
    handleRefreshClick: () => void
    handleClearFilter: () => void
    animation: boolean
    href: string
    descriptionHref: string
}

export function Options({ dropDown, setDropDown, handleRefreshClick, handleClearFilter, animation, setAnimation, descriptionHref, href }: optionsProps) {
    return (
        <Dropdown classNames={{ base: "top-1 right-2", content: "w-full", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out ${dropDown ? "bg-blue-700 aria-expanded:opacity-100 text-white" : ""}`, backdrop: "w-10" }}>
            <DropdownTrigger onClick={() => setDropDown(!dropDown)}>
                <button>
                    <BiDotsHorizontalRounded className="text-3xl" />
                </button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons" >
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
                    startContent={<VscTable className="text-lg" />}
                    className="flex justify-center items-center text-sm font-medium py-2"
                    textValue="tabela"
                    onClick={() => setDropDown(false)}
                    key="tabela"
                    endContent={<Link href={href} className="md:text-sm text-xs w-full">{descriptionHref}</Link>}
                />
                <DropdownItem
                    startContent={<RiFormatClear className="text-lg" />}
                    className="flex justify-center items-center w-full text-sm font-medium py-2"
                    onClick={handleClearFilter}
                    textValue="limpa filtro"
                    endContent={<span className="md:text-sm text-xs w-full">Limpa filtro</span>}
                />
            </DropdownMenu>
        </Dropdown>
    )
}