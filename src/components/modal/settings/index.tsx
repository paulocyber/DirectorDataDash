'use client'

// Biblioteca
import { Checkbox, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";

// Componentes
import { Input } from "@/components/ui/input";

// React
import { useState } from "react";

// Utils
import { searchFilter } from "@/utils/filters/search";
import { handleSelecting } from "@/utils/filters/handleSelecting";

// Tipagem
import { EnterpriseData } from "@/utils/types/enterprise";
import { Supplier } from "@/utils/types/suppliers";

interface SettingsProps {
    isOpen: boolean;
    enterprise: EnterpriseData[];
    supplier: Supplier[];
    onOpenChange: () => void;
}

export default function Settings({ isOpen, enterprise, supplier, onOpenChange }: SettingsProps) {
    const [menuOptions, setMenuOptions] = useState<string>('Empresas')
    const [searchParams, setSearchParams] = useState<string>('');

    const filterSearch = searchFilter({ data: supplier, search: searchParams })
    const { selecting: supplierSelection, handleCheckboxChange: handleSelectionSupplier } = handleSelecting()
    const { selecting: enterpriseSelection, handleCheckboxChange: handleSelectionEnterprise } = handleSelecting()
    
    return (
        <Modal
            size="5xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{}}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-2 rounded-lg bg-gray-200 p-6 shadow-md">
                        <p className="text-2xl font-bold text-gray-800">Configuração de filtros</p>
                    </ModalHeader>

                    <ModalBody>
                        <div className="hidden h-full md:block bg-white rounded-lg shadow-sm">
                            <div className="flex flex-col lg:flex-row">
                                <nav className="flex lg:flex-col pr-2 border-r">
                                    <button 
                                        onClick={() => setMenuOptions('Empresas')} 
                                        className={`inline-flex my-2 items-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${menuOptions === "Empresas" ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-blue-100"} h-10 px-4 justify-start`}
                                    >
                                        Empresas
                                    </button>
                                    <button 
                                        onClick={() => setMenuOptions('Fornecedores')} 
                                        className={`inline-flex items-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${menuOptions === "Fornecedores" ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-blue-100"} h-10 px-4 justify-start`}
                                    >
                                        Fornecedores
                                    </button>
                                </nav>

                                <div className="w-full flex-grow p-4">
                                    {menuOptions === 'Empresas' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {enterprise.map((item) => (
                                                <div key={item.ID_EMP} className="flex items-center">
                                                    <Checkbox 
                                                        classNames={{ label: "truncate w-40" }} 
                                                        className="rounded-lg" 
                                                        isSelected={enterpriseSelection.includes(item.SIGLA_EMP)} 
                                                        onChange={() => handleSelectionEnterprise(item.SIGLA_EMP)}
                                                    >
                                                        {item.SIGLA_EMP}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <Input
                                                    value={searchParams}
                                                    onChange={(e) => setSearchParams(e.target.value)}
                                                    onClear={() => setSearchParams('')}
                                                    size="sm"
                                                    placeholder="Digite algo"
                                                    startContent={<CiSearch className="w-4 h-4 text-gray-500" />}
                                                />
                                            </div>
                                            <div className="w-full max-h-[450px] overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {filterSearch.map((item) => (
                                                    <div key={item.ID_PSS} className="flex items-center">
                                                        <Checkbox 
                                                            classNames={{ label: "truncate w-52" }} 
                                                            className="rounded-lg" 
                                                            isSelected={supplierSelection.includes(item.APELIDO_OU_NOME)} 
                                                            onChange={() => handleSelectionSupplier(item.APELIDO_OU_NOME)}
                                                        >
                                                            {item.APELIDO_OU_NOME}
                                                        </Checkbox>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    )
}