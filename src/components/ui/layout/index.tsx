'use client'

// React
import { ReactNode, useEffect, useRef, useState } from "react";

// Componente
import { SideNav } from "../menu/SideNav";
import { HeaderNav } from './../menu/HeaderNav';

// Dados
import permission from "@/data/linkPermission.json";

// Biblioteca
import { useDisclosure } from "@nextui-org/react";

// Tipagem
type RoleType = 'vendedor' | 'diretoria' | 'tecnologia'; // Defina as roles possíveis aqui
type PermissionType = {
    [key in RoleType]: {
        router: { name: string; path: string }[];
    };
};

export function Layout({ children, role }: { children: ReactNode; role?: string }) {
    const [isOpen, setIsopen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsopen(false);
            }
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

    // Acessando as rotas com segurança
    const routes = (role && (permission as PermissionType)[role as RoleType]?.router) || [];

    const {isOpen: isOpenModal, onOpen, onOpenChange} = useDisclosure();
console.log("Rotas: ", routes)
    return (
        <div className="relative bg-[#edf3fb] h-screen flex flex-col w-full overflow-hidden">
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50" />
            )}
            <div ref={menuRef}>
                <SideNav toggleMenuState={isOpen} Close={setIsopen} routes={routes}/>
            </div>
            <HeaderNav open={setIsopen} toggleMenuState={isOpen} />
            <main className="p-4 overflow-auto xl:ml-80 z-20">
                {children}
            </main>
        </div>
    );
}