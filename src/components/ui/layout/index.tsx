'use client'

// React
import { ReactNode, useEffect, useRef, useState } from "react";

// Dados
import permission from "@/data/permissions/ruleByUser.json";

// Next Framework
import { usePathname } from "next/navigation";

// Componente
import { SideNav } from "../menu/sideNav";
import { HeaderNav } from './../menu/headerNav/index';
import { useDisclosure } from "@nextui-org/react";
import { Modal } from "../modal";
import { Settings } from "../settings";

// Tipagem
import { BrandData } from "@/types/brands";
type RoleType = 'vendedor' | 'diretoria' | 'tecnologia';
type PermissionType = {
    [key in RoleType]: {
        router: { name: string; path: string }[];
    };
};

interface LayoutProps {
    children: ReactNode;
    role?: string;
    brands?: BrandData[];
}

export function Layout({ children, role, brands }: LayoutProps) {
    const [isOpen, setIsopen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = usePathname()

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

    const routes = (role && (permission as PermissionType)[role as RoleType]?.router) || [];
    const { isOpen: isopenModal, onOpen, onClose } = useDisclosure();

    const canOpenSettings = (role === 'tecnologia' || role === 'diretoria') && router === '/salesbybrand';

    return (
        <>
            <Modal title="Configuração de filtros" isOpen={isopenModal} onClose={onClose} children={<Settings brands={brands ? brands : []} />} />
            <div className="relative bg-[#edf3fb] h-screen flex flex-col w-full overflow-hidden">
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50" />
                )}
                <div ref={menuRef}>
                    <SideNav toggleMenuState={isOpen} Close={setIsopen} routes={routes} />
                </div>
                <HeaderNav open={setIsopen} openModal={canOpenSettings ? onOpen : undefined} toggleMenuState={isOpen} />
                <main className="p-4 overflow-auto xl:ml-80 z-20">
                    {children}
                </main>
            </div>
        </>
    );
}