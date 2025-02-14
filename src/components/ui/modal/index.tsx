import { ModalBody, ModalContent, ModalFooter, ModalHeader, Modal as ModalUI } from "@nextui-org/react";
import { GoSync } from "react-icons/go";
import { ReactNode } from "react";
import { Button } from "../button";

interface ModalProps {
    title: string;
    isopen: boolean;
    children: ReactNode;
    displayFooter?: boolean;
    footerTitle?: string;
    value?: string;
    onOpenChange: () => void;
    setActiveRefresh?: (value: boolean) => void;
}

export default function Modal({
    title,
    isopen,
    children,
    displayFooter,
    footerTitle,
    value,
    onOpenChange,
    setActiveRefresh,
}: ModalProps) {
    return (
        <ModalUI isOpen={isopen} size="2xl" onOpenChange={onOpenChange} scrollBehavior="inside">
            <ModalContent className="rounded-2xl shadow-xl bg-white dark:bg-gray-900">
                <ModalHeader className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
                </ModalHeader>

                <ModalBody className="p-6">{children}</ModalBody>

                {(displayFooter || setActiveRefresh) && (
                    <ModalFooter className="flex flex-col gap-3 border-t border-gray-300 dark:border-gray-700 p-4 rounded-b-2xl bg-gray-100 dark:bg-gray-800">
                        {displayFooter && (
                            <div className="flex w-full justify-between items-center">
                                <h2 className="text-base font-semibold text-gray-700 dark:text-white">{footerTitle}</h2>
                                <span className="text-lg font-bold text-emerald-600">{value}</span>
                            </div>
                        )}
                        {setActiveRefresh && (
                            <Button
                                startContent={<GoSync className="text-lg font-bold" />}
                                color="primary"
                                className="w-full font-bold"
                                onPress={() => setActiveRefresh(true)}
                            >
                                Refresh
                            </Button>
                        )}
                    </ModalFooter>
                )}
            </ModalContent>
        </ModalUI>
    );
}
