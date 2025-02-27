'use client'

// React
import { useState } from "react";

// Componentes
import { Input } from "../../input";
import { searchFilter } from "@/utils/filters/searchFilter";

// Biblioteca
import { CiSearch } from "react-icons/ci";
import { Checkbox } from "@nextui-org/react";

// Tipagem
interface SettingsDavsProps {
    formOfPaymentsData?: { ID_FRM: string; DESCRICAO_FRM: string }[];
}

export function SettingsDavs({ formOfPaymentsData }: SettingsDavsProps) {
    const [search, setSearch] = useState<string>('')
    const [formOfPayments, setFormOfPayments] = useState(formOfPaymentsData)

    const filterSearch = searchFilter({ data: formOfPayments || [], search: search })

    return (
        <main className="w-full">
            <section className="mb-4">
                <h3 className="text-gray-700 font-medium text-base">Formas de pagamentos</h3>
            </section>
            <div className="w-full flex-grow">
                <div className="flex flex-col mb-4">
                    <div className="flex items-center">
                        <Input
                            size="sm"
                            placeholder="Digite alguma coisa"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startContent={<CiSearch className="w-4 h-4 text-gray-500" />}
                            className="flex-grow focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {filterSearch.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 h-full max-h-[240px] py-2 overflow-auto">
                        {filterSearch?.map((supplier) => (
                            <div key={supplier.ID_FRM} className="flex items-center transition-all duration-300 ease-in-out">
                                <Checkbox
                                    classNames={{ label: "truncate w-[10em] truncate text-gray-700 text-sm font-medium" }}
                                    className="rounded-lg"
                                // isSelected={suppliersSelect.includes(supplier.DESCRICAO_MRC)}
                                // onChange={() => handleCheckboxChange(supplier.DESCRICAO_MRC)}
                                >
                                    {supplier.DESCRICAO_FRM}
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm text-center pb-3">
                        Nenhum fornecedor encontrado.
                    </p>
                )}
            </div>
        </main>
    );
}
