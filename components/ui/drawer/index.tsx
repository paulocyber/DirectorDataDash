// Bibliotecas
import { Button, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Drawer as DrawerUi } from "@heroui/react";
import { FaFilter } from "react-icons/fa";
import { useAtom } from "jotai";

// React
import { ReactNode } from "react";

// Atom
import { refreshAtom } from "@/atom/isActivateRefresh";

// Tipagem
interface DrawerProps {
    children: ReactNode;
    isOpen: boolean;
    setClear: () => void;
    onOpenChange: () => void;
}

export default function Drawer({ children, isOpen, setClear, onOpenChange }: DrawerProps) {
    const [, setActiveRefresh] = useAtom(refreshAtom)

    return (
        <DrawerUi
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            placement="right"
            scrollBehavior="inside"
        >
            <DrawerContent className="">
                <DrawerHeader className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex pl-2 items-center gap-2">
                        <FaFilter className="text-blue-600 w-5 h-5" />
                        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
                    </div>
                </DrawerHeader>

                <DrawerBody className="pl-5">
                    {children}
                </DrawerBody>

                <DrawerFooter className="flex justify-end items-center gap-3 p-4 border-t">
                    <Button onPress={() => { setClear(); setActiveRefresh(true) }} className="w-1/2 bg-gray-100 hover:bg-gray-200 rounded-md">Limpar Tudo</Button>
                    <Button onPress={() => setActiveRefresh(true)} color="primary" className="w-1/2 rounded-md">
                        Atualizar
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </DrawerUi>
    )
}