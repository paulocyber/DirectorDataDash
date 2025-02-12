'use client'

// React
import { ReactNode, useEffect, useRef, useState } from "react";

// Componentes
import { SideNav } from "../menu/sideNav";
import { HeaderNav } from "../menu/headerNav";
import Modal from "../modal";
import { SettingsBillsToPay } from "../settings/billsToPay"
import { SettingsSalesByBrand } from "../settings/salesByBrand";
import { SettingsSales } from "../settings/salesGoal";
import { SettingsBillsToReceive } from "../settings/billsToReceive/indext";
import { SettingsLateCustomer } from "../settings/lateCustomer";

// Dados
import rules from "@/data/router/settings/ruleByUser.json"

// Next
import { useDisclosure } from "@nextui-org/react";

// Next
import { usePathname } from "next/navigation";

// Tipagem
type RoleType = 'vendedor' | 'diretoria' | 'tecnologia';
type PermissionType = {
    [key in RoleType]: {
        router: { name: string; path: string; icon: string }[]
    }
}

interface LayoutProps {
    children: ReactNode;
    role?: string;
    enterprises?: { ID_EMP: string, SIGLA_EMP: string }[]
    suppliers?: { ID_MRC: string, DESCRICAO_MRC: string, STATUS_MRC: string }[]
    people?: { ID_PSS: string, NOME_PSS: string, APELIDO_PSS: string }[]
    employees?: { ID_PSS: string, NOME_PSS: string, APELIDO_PSS: string }[]
}

export function Layout({ children, role, enterprises, suppliers, people, employees }: LayoutProps) {
    const [isOpen, setIsopen] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const routes = (role && (rules as PermissionType)[role as RoleType]?.router) || [];
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

    const { isOpen: openSettings, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="relative bg-[#edf3fb] max-h-screen flex flex-col w-full overflow-hidden">
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50" />
                )}
                <div ref={menuRef}>
                    <SideNav toggleMenuState={isOpen} close={setIsopen} routes={routes} />
                </div>
                <HeaderNav
                    open={setIsopen}
                    openModal={router === "/billstopay/table" ?
                        onOpen :
                        router === "/salesbybrand" ?
                            onOpen :
                            router === "/salesgoal" ?
                                onOpen :
                                router === "/billstoreceive/table" ?
                                    onOpen :
                                    router === "/salesgoal/latecustomer" ?
                                        onOpen :
                                        router === "/salesbybrand/entriesxsales" ?
                                            onOpen :
                                            undefined
                    }
                    toogleMenuState={isOpen}
                />
                <main className="p-4 overflow-auto h-screen xl:ml-72 z-20">
                    {children}
                </main>
            </div>
            {(router === "/billstopay/table" || router === "/salesbybrand" || router === "/salesgoal" || router === "/billstoreceive/table" || router === "/salesgoal/latecustomer" || router === "/salesbybrand/entriesxsales") && (
                <Modal title="Configurações de Filtros" isopen={openSettings} onOpenChange={onOpenChange}>
                    {router === "/billstopay/table" ?
                        <SettingsBillsToPay /> :
                        router === "/salesbybrand" ?
                            <SettingsSalesByBrand suppliers={suppliers} /> :
                            router === "/salesgoal" ?
                                <SettingsSales enterprises={enterprises} /> :
                                router === "/billstoreceive/table" ?
                                    <SettingsBillsToReceive people={people} /> :
                                    router === "/salesgoal/latecustomer" ?
                                        <SettingsLateCustomer employees={employees} /> :
                                        router === "/salesbybrand/entriesxsales" ?
                                            <SettingsSalesByBrand suppliers={suppliers} /> :
                                            <>nenhum</>
                    }
                </Modal>
            )}
        </>
    )
}