// Bibliotecas
import { Modal as ModalUi, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

// React
import { ReactNode } from "react";

// Tipagem
interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
    return (
        <ModalUi
            size="4xl"
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
            </ModalContent >
        </ModalUi>
    )
}