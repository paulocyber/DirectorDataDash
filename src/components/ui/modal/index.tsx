// Bibliotecas
import { Modal as ModalUi, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

// React
import { ReactNode } from "react";

// Tipagem
interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    width?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | undefined;
    displayFooter?: boolean;
    children: ReactNode;
    footerTitle?: string;
    value?: string;
}

export function Modal({ title, isOpen, onClose, children, width, displayFooter, value, footerTitle }: ModalProps) {
    return (
        <ModalUi
            size={width ? width : "4xl"}
            isOpen={isOpen}
            onClose={onClose}
            classNames={{ closeButton: 'text-white hover:text-gray-800' }}
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="text-xl font-bold text-white flex flex-col gap-2 rounded-lg bg-blue-700 p-5 shadow-md">{title}</ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
                {displayFooter && (
                    <ModalFooter>
                        <div className="flex w-full flex justify-between">
                            <h2 className="mb-0 text-base font-bold  dark:text-white dark:opacity-60">{footerTitle}</h2>
                            <span className="mb-0 text-sm font-bold text-emerald-600">{value}</span>
                        </div>
                    </ModalFooter>
                )}
            </ModalContent >
        </ModalUi >
    )
}