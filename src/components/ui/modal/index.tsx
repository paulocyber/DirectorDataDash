// Bibliotecas
import { ModalBody, ModalContent, ModalFooter, ModalHeader, Modal as ModalUI } from '@nextui-org/react';

// React
import { ReactNode } from 'react';

// Tipagem
interface ModalProps {
    title: string;
    isopen: boolean;
    children: ReactNode;
    displayFooter?: boolean;
    footerTitle?: string;
    value?: string;
    onOpenChange: () => void;
}

export default function Modal({
    title,
    isopen,
    children,
    displayFooter,
    footerTitle,
    value,
    onOpenChange,
}: ModalProps) {
    return (
        <ModalUI isOpen={isopen} size="lg" onOpenChange={onOpenChange} scrollBehavior='inside'>
            <ModalContent>
                <ModalHeader className="flex items-center justify-between gap-2 border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
                </ModalHeader>
                <ModalBody>{children}</ModalBody>
                {displayFooter && (
                    <ModalFooter>
                        <div className="flex w-full justify-between items-center">
                            <h2 className="text-base font-semibold text-gray-700 dark:text-white">
                                {footerTitle}
                            </h2>
                            <span className="text-lg font-bold text-emerald-600">{value}</span>
                        </div>
                    </ModalFooter>
                )}
            </ModalContent>
        </ModalUI>
    );
}